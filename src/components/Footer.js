import React from 'react';
import Logo from '../images/eliosLogo.png';

import Instagram from '../images/social-media/instagram.svg'
import Facebook from '../images/social-media/facebook.svg'
import Twitter from '../images/social-media/twitter.svg'

const Footer = () => {
    return (
        <footer>
            <img src={Logo} alt="Elios logo"></img>
            <div className="social-media">
                <a href="" target="_blank">
                    <img src={Instagram} alt="Instagram icon" />
                </a>
                <a href="" target="_blank">
                    <img src={Facebook} alt="Facebook icon" />
                </a>
                <a href="" target="_blank">
                    <img src={Twitter} alt="Twitter icon" />
                </a>
            </div>
        </footer>
    );
  };
  
export default Footer;