import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MobileMenu = ({ isOpen, toggleMobileMenu }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 

    const handleNavLinkClick = () => {
        if (location.pathname === window.location.pathname) {
        toggleMobileMenu();
        }
    };

    const handleAccount = () => {
        navigate('/account');
    };

    const handleLogout = () => {
        console.log('Logging out...');
        logout();
        navigate('/home');
    };

    return (
        <div className={`popup__menu ${isOpen ? 'open' : ''}`}>
            <div className="popup__menu__header">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="16" 
                    width="12" 
                    viewBox="0 0 384 512"
                    onClick={toggleMobileMenu}
                >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </div>
            <div className="popup__menu__content">
                {user ? (
                    <div>
                        <p className="user">Bonjour, {user.userData.FirstName}</p>
                        <button type="button" className="button__account" onClick={handleAccount}>
                            Mon compte
                        </button>
                    </div>
                    
                ) : (
                    null
                )}
                <NavLink exact to="/home" onClick={handleNavLinkClick}>
                    Accueil
                </NavLink>
                <NavLink to="/contact" onClick={handleNavLinkClick}>
                    Qui sommes-nous ?
                </NavLink>
                <NavLink to="/shop" onClick={handleNavLinkClick}>
                    Boutique
                </NavLink>
            </div>

            {user ? (
                <div className="popup__menu__footer">
                    <button type="button" className="button__logout" onClick={handleLogout}>
                        Se déconnecter
                    </button>
                </div>
                
            ) : (
                null
            )}
        </div>
    );
  };
  
export default MobileMenu;