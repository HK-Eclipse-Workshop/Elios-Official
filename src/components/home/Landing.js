import React from 'react';
import Logo from '../../images/eliosLogo.png';

const Landing = () => {
    return (
        <section className="home">
            <div className="content">
                <div className='top-content'>
                    <img src={Logo} alt="Elios logo"/>
                    <h2>Solis</h2>
                </div>
                <div className='bottom-content'>
                    <p>Votre reflet, votre lumière, votre énergie. Solis permet de profiter de la lumière naturelle pour recharger toutes sortes de petits appareils électroniques.</p>
                </div>
            </div>
        </section>
    );
  };
  
  export default Landing;
  