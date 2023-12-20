import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CartDetails = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = user && user.userData ? user.userData.UserID : null;

      try {
        const url = userId
          ? `http://localhost:5000/api/cart/items/${userId}`
          : 'http://localhost:5000/api/cart/items';
        const response = await fetch(url);
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles du panier', error);
      }
    };

    const fetchColors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/colors');
        const data = await response.json();
        setColors(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des couleurs', error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/images');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des images', error);
      }
    };

    fetchCartData();
    if (cartItems.length > 0) {
      fetchColors();
      fetchImages();
    }
  }, [user, cartItems]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${cartId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.CartID !== cartId));
      } else {
        alert('Erreur lors de la suppression du produit du panier.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête vers l\'API', error);
      alert('Erreur lors de la requête vers l\'API.');
    }
  };


  const getColorName = (colorId) => {
    const color = colors.find((c) => c.ColorID === parseInt(colorId, 10));
    return color ? color.Name : '';
  };

  const getImagePath = (colorId) => {
    const image = images.find((img) => img.ColorID === parseInt(colorId, 10));
    const path = image ? image.Road : '';
    return path;
  };

  return (
    <section className="cart">
      <div className='content'>
        <div className="cart__header">
          <h2>Votre Panier</h2>
        </div>
        <div className="cart__list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.CartID} className="cart__list__product">
                <div className="product__image">
                  <img
                    src={process.env.PUBLIC_URL + '/images/product-images/' + getImagePath(item.Color)}
                    alt={`Product ${item.ProductID}`}
                  />
                </div>
                <div className="product__informations">
                  <p className="product__name">{item.Name}</p>
                  <p className="product__price">{`${item.Price} €`}</p>
                  <p className="product__color">{`Couleur : ${getColorName(item.Color)}`}</p>
                  <p className="product__size">{`Taille : ${item.Size} cm`}</p>
                  <p className="product__quantity">{`Quantité : ${item.Quantity}`}</p>
                  <button className="button__remove" onClick={() => handleRemoveFromCart(item.CartID)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="cart__list__empty">
              <p>Votre panier est vide</p>
              <NavLink to="/shop" className="button__shop">
                Aller en Boutique
              </NavLink>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="buttons">
              <NavLink to="/shop" className="button__add-products">
                Ajouter des produits
              </NavLink>
            </div>

          )}
        </div>

      </div>
    </section>
  );
};

export default CartDetails;
