import React, { useState } from 'react';
import Logo from '../images/eliosLogo.png';

function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('Envoyer');
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const handlePhoneNumberChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
  
    if (numericValue.length === 10) {
      setPhoneNumber(numericValue);
      setErrorMessages((prevState) => ({
        ...prevState,
        phoneNumber: '',
      }));
    } else {
      setPhoneNumber(numericValue);
      setErrorMessages((prevState) => ({
        ...prevState,
        phoneNumber: 'Le numéro de téléphone n\'est pas valide',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!firstName) {
      setErrorMessages((prevState) => ({
        ...prevState,
        firstName: 'Veuillez remplir ce champ.',
      }));
    }
    if (!lastName) {
      setErrorMessages((prevState) => ({
        ...prevState,
        lastName: 'Veuillez remplir ce champ.',
      }));
    }
    if (!email) {
      setErrorMessages((prevState) => ({
        ...prevState,
        email: 'Veuillez remplir ce champ.',
      }));
    }
    if (!phoneNumber) {
      setErrorMessages((prevState) => ({
        ...prevState,
        phoneNumber: 'Veuillez remplir ce champ.',
      }));
    }
    if (!message) {
      setErrorMessages((prevState) => ({
        ...prevState,
        message: 'Veuillez remplir ce champ.',
      }));
    }
  
    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('Message envoyé avec succès !');
        setSubmitButtonText('Message envoyé !');
        setIsButtonClicked(true);
      } else {
        console.error('Erreur lors de l\'envoi du message.', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message.', error);
    }
  };

  return (
    <section className="contact">
        <img src={Logo}/>
        <div className="form__container">
            <p>Le mode de vie durable fait désormais partie de notre vie quotidienne. Certains adoptent des pratiques pour minimiser leur empreinte carbone, que se soit en composant des déchets alimentaires ou en utilisant moins de plastiques à usage unique, tandis que d'autres vont encore plus loin et tente de trouver comment tirer parti de l'énergie solaire dans un appartement.</p>
            <p>Rendre le solaire accessible à tous est notre objectif, afin que les gens puissent récolter la lumière du soleil à travers leur fenêtre, tout en ayant un élément de décoration intérieure.</p>
            <h2>Nous contacter</h2>

            <form onSubmit={handleSubmit}>
              <div>
                <input 
                  type="text" 
                  placeholder="Prénom" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
                {errorMessages.firstName && <div className="error-message">{errorMessages.firstName}</div>}
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Nom" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
                {errorMessages.lastName && <div className="error-message">{errorMessages.lastName}</div>}
              </div>

              <div>
                <input 
                  type="email" 
                  placeholder="Adresse Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                {errorMessages.email && <div className="error-message">{errorMessages.email}</div>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Numéro de Téléphone"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  pattern="[0-9]*"
                />
                {errorMessages.phoneNumber && <div className="error-message">{errorMessages.phoneNumber}</div>}
              </div>

              <div>
                <textarea 
                  placeholder="Message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
                {errorMessages.message && <div className="error-message">{errorMessages.message}</div>}
              </div>

              <div className="submit-button">
                  <button type="submit" className={isButtonClicked ? 'clicked' : ''}>
                      {submitButtonText}
                  </button>
              </div>
            </form>
        </div>
    </section>
  );
}

export default ContactForm;
