import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log('Données reçues depuis /api/products :', data);
        setProducts(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des produits', error));
  }, []);
  
    return (
      <section className="shop">
        <div className="content">
          <h2>Boutique</h2>
          <div className="products">
            {products.map(product => (
              <div key={product.ProductID} className="product">
                <Link to={`/product/${product.ProductID}`}>
                  <img src={process.env.PUBLIC_URL + `${product.ImagePath}`} alt={product.Name} />
                  <div className="product__content">
                    <h3 className="product__name">{product.Name}</h3>
                    <p className="product__price">{product.Price} €</p>
                    <p className="product__colors">Plus de couleurs</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>

      </section>
    );
  };

export default ProductList;