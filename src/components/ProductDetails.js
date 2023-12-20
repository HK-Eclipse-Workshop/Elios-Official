import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductDetails = () => {
  const navigate = useNavigate(); 
  const { user} = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCharacteristics, setShowCharacteristics] = useState(false);


  const [selectedColor, setSelectedColor] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };


  const handleCharacteristicsToggle = () => {
    setShowCharacteristics(!showCharacteristics);
  };

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
  };

  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        setProductDetails(data);
        console.log('Détails du produit:', data);
      })
      .catch(error => console.error('Erreur lors de la récupération des détails du produit', error));
  }, [productId]);

  useEffect(() => {
    if (productDetails.colors && productDetails.colors.length > 0 && selectedColor === null) {
      handleColorChange(productDetails.colors[0].ColorID);
    }
  }, [productDetails.colors, selectedColor]);
  
  useEffect(() => {
    if (productDetails.images && selectedColor !== null) {
      setFilteredImages(productDetails.images.filter(image => image.ColorID === selectedColor));
    }
  
    setActiveImageIndex(0);
  }, [selectedColor, productDetails.images]);

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    const newFilteredImages = productDetails.images.filter(image => image.ColorID === colorId);
    setFilteredImages(newFilteredImages);
  };

  const sizes = productDetails ? productDetails.sizes : [];

  const handleQuantityChange = (action) => {
    if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (action === 'increase' && productDetails) {
      if (quantity < productDetails.Quantity) {
        setQuantity(quantity + 1);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert("Veuillez sélectionner une couleur et une taille avant d'ajouter au panier.");
      return;
    }

    const cartItem = {
      productId: productDetails.ProductID,
      quantity: quantity,
      color: selectedColor, 
      size: selectedSize,
      userId: user ? user.userData.UserID : null,
    };

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        navigate('/cart')
      } else {
        alert('Erreur lors de l\'ajout de l\'article au panier. Veuillez réessayer plus tard.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête vers l\'API', error);
      alert('Erreur lors de la requête vers l\'API. Veuillez réessayer plus tard.');
    }
  };
  
  return (
    <section className="product">

      <div className="content">
        <div className="product__images__dekstop">
          {filteredImages.map(image => (
            <div className="product__image" key={image.ImageID}>
              <img src={process.env.PUBLIC_URL + '/images/product-images/' + image.Road} alt={`Color ${image.ColorID}`} />
            </div>
          ))}
        </div>
        <div className="product__images__mobile">
          <div className='product__image product__image--active'>
            <img src={`${process.env.PUBLIC_URL}/images/product-images/${filteredImages[activeImageIndex]?.Road}`} alt={`Image ${activeImageIndex + 1}`} />
          </div>
          <div className="product__thumbnail-images">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className={`product__image-thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => handleImageClick(index)}
              >
                <img src={process.env.PUBLIC_URL + '/images/product-images/' + image.Road} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="product__informations">
          <h2 className="product__name">
            {productDetails.Name}
          </h2>
          <p className="product__price">
            {productDetails.Price} €
          </p>
          <div className="product__colors">
            <h3>Couleurs :</h3>
            <div className="product__colors__inputs">
              {productDetails.colors &&
              productDetails.colors.map((color, index) => (
                <input
                  type="radio"
                  name="colorOption"
                  value={color.ColorID}
                  checked={selectedColor === color.ColorID}
                  onChange={() => handleColorChange(color.ColorID)}
                  className={`color-input color-${index}`}
                />
              ))}
            </div>
          </div>
          <div className="product__sizes">
            <h3>Tailles:</h3>
            <div className="product__sizes__inputs">
              {sizes && sizes.map((size, index) => (
                <span
                  key={index}
                  className={`size__option ${selectedSize === size.Value ? 'selected' : ''}`}
                  onClick={() => handleSizeChange(size.Value)}
                >
                  {size.Value} cm
                </span>
              ))}
            </div>
          </div>

          <div className="product__quantities">
            <h3>Quantité :</h3>
            <div className="handle__quantity">
              <button type="button" onClick={() => handleQuantityChange('decrease')}>-</button>
              <p>{quantity}</p>
              <button type="button" onClick={() => handleQuantityChange('increase')}>+</button>
            </div>
          </div>
          <div className="buttons">
            <button type="button" className="button__cart" onClick={handleAddToCart}>
              Placer dans le panier
            </button>

            <button type="button" className="button__order">
              Commander
            </button>

          </div>

          <div className={`product__characteristics ${showCharacteristics ? 'visible' : ''}`}>
            <div className='product__characteristics__header' onClick={handleCharacteristicsToggle} >
              <h3>Caractéristiques techniques</h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="16" 
                width="16" 
                viewBox="0 0 512 512"
                className={`rotate-icon ${showCharacteristics ? 'rotate' : 'initial'}`}
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
              </svg>
            </div>
            <div className="characteristics-content">
              <h4>Technologies</h4>
              {productDetails?.Technology && (
                <ul>
                  {productDetails.Technology.split(', ').map((tech, index) => (
                    <li key={index}>- {tech}</li>
                  ))}
                </ul>
              )}
              <h4>Contenu</h4>
              {productDetails?.Content && (
                <ul>
                  {productDetails.Content.split(', ').map((cont, index) => (
                    <li key={index}>- {cont}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductDetails;
