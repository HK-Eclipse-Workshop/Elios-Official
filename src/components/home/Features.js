import React from 'react';

import EconomyEnergy from "../../images/economyEnergy.png"
import CarbonFootprint from "../../images/carbonFootprint.png"
import ModularProduct from "../../images/modularProduct.png"

import ElegantSolis from "../../images/elegantSolisDef.png"
import UsefulSolis from "../../images/usefulSolisDef.png"

const Features = () => {
    return (
        <section className="features">
            <h2>Un objet bénéfique pour tous</h2>
            <div className="cards">
                <figure className="card">
                    <img src={EconomyEnergy} alt="Icône d'économie d'énergie" />
                    <figcaption className="card__content">
                        <h3>Economie d'énergie</h3>
                        <p>L'énergie solaire, c'est gratuit ! Commencez à économiser sur vos factures d'énergie grâce à Solis.</p>
                    </figcaption>
                </figure>

                <figure className="card">
                    <img src={CarbonFootprint} alt="Icône d'empreinte carbone"/>
                    <figcaption className="card__content">
                        <h3>Empreinte carbone</h3>
                        <p>Un petit geste qui permet de protéger votre planète en réduisant votre empreinte carbone.</p>
                    </figcaption>
                </figure>

                <figure className="card">
                    <img src={ModularProduct} alt="Icône de produit modulaire"/>
                    <figcaption className="card__content">
                        <h3>Un produit modulaire</h3>
                        <p>Dû à ses différents modules Solis est facilement réparable et permet ainsi d'éviter le gaspillage.</p>
                    </figcaption>
                </figure>
            </div>

            <div className="cards">
                <figure className="card">
                    <img src={ElegantSolis}  alt="Image de Solis avec design élégant" className="product"/>
                    <figcaption className="card__content">
                        <h3>Sobre et élégant</h3>
                        <p>Pensé pour être utilisé en intérieur, ce panneau solaire s'adapte à tout type d'habitation, appartement ou maison. Avec un design sobre, Solis camoufle sa fonction principale dans un objet de décor passe-partout.</p>
                    </figcaption>
                </figure>

                <figure className="card">
                    <img src={UsefulSolis} alt="Image de Solis en utilisation quotidienne" className="product"/>
                    <figcaption className="card__content">
                        <h3>Utile au quotidien</h3>
                        <p>Dans un quotidien entouré par de nombreux appareils électroniques, Solis vous permet de charger tout type de périphérique via USB. Smartphone, IPhone, Casque Bluetooth, Airpods ...</p>
                    </figcaption>
                </figure>
            </div>
                                
        </section>
    );
};
  
export default Features;