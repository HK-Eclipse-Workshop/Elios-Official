const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());


// MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elios-db',
});

connection.connect();

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, birthdate } = req.body;

  if (!email || !password || !firstName || !lastName || !birthdate) {
    return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires.' });
  }

  connection.query('SELECT * FROM User WHERE Email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      'INSERT INTO User (Email, Password, FirstName, LastName, DateOfBirth) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, birthdate],
      (insertError, insertResults) => {
        if (insertError) {
          console.log(insertError);
          return res.status(500).json({ error: 'Erreur interne du serveur lors de l\'enregistrement.' });
        }

        res.status(201).json({ success: 'Inscription réussie.' });
      }
    );
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe.' });
  }

  connection.query('SELECT * FROM User WHERE Email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  
    console.log('Résultats de la base de données:', results);
  
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
  
    const isPasswordMatch = await bcrypt.compare(password, results[0].Password);
  
    console.log('Mot de passe correspond:', isPasswordMatch);
  
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
  
    res.status(200).json({ success: 'Connexion réussie.', userData: results[0] });
  });
});

app.put('/update-profile', async (req, res) => {
  try {
    const { userID, email, password, firstName, lastName, dateOfBirth } = req.body;

    const updateQuery = 'UPDATE User SET Email=?, Password=?, FirstName=?, LastName=?, DateOfBirth=? WHERE UserID=?';
    const updateValues = [email, password, firstName, lastName, dateOfBirth, userID];

    connection.query(updateQuery, updateValues, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }

      res.status(200).json({ success: 'Mise à jour réussie.' });
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

app.put('/update-password', async (req, res) => {
  try {
    const { userID, currentPassword, newPassword } = req.body;

    connection.query('SELECT * FROM User WHERE UserID = ?', [userID], async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      const isPasswordMatch = await bcrypt.compare(currentPassword, results[0].Password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      connection.query('UPDATE User SET Password = ? WHERE UserID = ?', [hashedNewPassword, userID], (updateError) => {
        if (updateError) {
          console.log(updateError);
          return res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe.' });
        }

        res.status(200).json({ success: 'Mot de passe mis à jour avec succès.' });
      });
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

app.get('/api/products', (req, res) => {
  const query = `
    SELECT 
      Product.ProductID,
      Product.Name,
      Product.Price,
      CONCAT('/images/product-images/', SUBSTRING_INDEX(GROUP_CONCAT(Image.Road ORDER BY Image.ImageID), ',', 1)) AS ImagePath
    FROM Product
    LEFT JOIN Image ON Product.ProductID = Image.ProductID
    GROUP BY Product.ProductID;
  `;
  
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits depuis la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des produits', details: err.message });
    } else {
      console.log('Résultat de la requête /api/products :', result);
      res.json(result);
    }
  });
});

app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;

  const productQuery = 'SELECT * FROM Product WHERE ProductID = ?';
  connection.query(productQuery, [productId], (productErr, productResult) => {
    if (productErr) {
      console.error('Erreur lors de la récupération des détails du produit depuis la base de données:', productErr);
      res.status(500).json({ error: 'Erreur lors de la récupération des détails du produit', details: productErr.message });
    } else {
      if (productResult.length > 0) {
        const productDetails = productResult[0];

        const imageQuery = 'SELECT * FROM Image WHERE ProductID = ?';
        connection.query(imageQuery, [productId], (imageErr, imageResult) => {
          if (imageErr) {
            console.error('Erreur lors de la récupération des images du produit depuis la base de données:', imageErr);
            res.status(500).json({ error: 'Erreur lors de la récupération des images du produit', details: imageErr.message });
          } else {
            productDetails.images = imageResult;

            const colorIds = imageResult.map(image => image.ColorID);
            const colorQuery = 'SELECT * FROM Color WHERE ColorID IN (?)';
            connection.query(colorQuery, [colorIds], (colorErr, colorResult) => {
              if (colorErr) {
                console.error('Erreur lors de la récupération des couleurs du produit depuis la base de données:', colorErr);
                res.status(500).json({ error: 'Erreur lors de la récupération des couleurs du produit', details: colorErr.message });
              } else {
                productDetails.colors = colorResult;

                const sizeQuery = 'SELECT * FROM Size WHERE ProductID = ?';
                connection.query(sizeQuery, [productId], (sizeErr, sizeResult) => {
                  if (sizeErr) {
                    console.error('Erreur lors de la récupération des tailles du produit depuis la base de données:', sizeErr);
                    res.status(500).json({ error: 'Erreur lors de la récupération des tailles du produit', details: sizeErr.message });
                  } else {
                    productDetails.sizes = sizeResult;

                    res.json(productDetails);
                  }
                });
              }
            });
          }
        });
      } else {
        res.status(404).json({ error: 'Produit non trouvé' });
      }
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity, color, size, userId } = req.body;

  const query = 'INSERT INTO Cart (ProductID, Quantity, Color, Size, UserID) VALUES (?, ?, ?, ?, ?)';
  
  connection.query(query, [productId, quantity, color, size, userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de l\'ajout de l\'article au panier', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'article au panier', details: error.message });
    } else {
      res.status(200).json({ message: 'Article ajouté au panier avec succès' });
    }
  });
});

app.get('/api/cart/items/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT Cart.*, Product.Name, Product.Price
    FROM Cart
    JOIN Product ON Cart.ProductID = Product.ProductID
    WHERE Cart.UserID = ?
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des articles du panier', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des articles du panier', details: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.delete('/api/cart/remove/:cartId', (req, res) => {
  const cartId = req.params.cartId;

  const query = 'DELETE FROM Cart WHERE CartID = ?';

  connection.query(query, [cartId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la suppression du produit du panier', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du produit du panier', details: error.message });
    } else {
      res.status(200).end();
    }
  });
});

app.get('/api/colors', (req, res) => {
  const query = 'SELECT * FROM Color';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des couleurs', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des couleurs', details: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/images', (req, res) => {
  const query = 'SELECT * FROM Image';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching images', error);
      res.status(500).json({ error: 'Error fetching images', details: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !message) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs.' });
  }

  const query = 'INSERT INTO Contact (FirstName, LastName, Email, Telephone, Message) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, email, phoneNumber, message], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données dans la base de données.', err);
      return res.status(500).json({ error: 'Erreur lors de l\'insertion des données dans la base de données.' });
    }

    console.log('Données insérées avec succès dans la base de données.');
    res.status(201).json({ success: true });
  });
});


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});