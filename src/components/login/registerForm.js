import React, { useState } from 'react';

const RegisterForm = ({ onRegistrationSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear the corresponding error message when the user starts typing
    setErrorMessages((prevState) => ({
      ...prevState,
      [name]: '',
    }));

    // Update the input value
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'firstName') {
      setFirstName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    } else if (name === 'birthdate') {
      setBirthdate(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailError = !email ? 'Veuillez remplir ce champ.' : '';
    const passwordError = !password ? 'Veuillez remplir ce champ.' : '';
    const confirmPasswordError = password !== confirmPassword ? 'Les mots de passe ne correspondent pas.' : '';
    const firstNameError = !firstName ? 'Veuillez remplir ce champ.' : '';
    const lastNameError = !lastName ? 'Veuillez remplir ce champ.' : '';
  
    setErrorMessages({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      firstName: firstNameError,
      lastName: lastNameError,
    });
  
    if (emailError || passwordError || confirmPasswordError || firstNameError || lastNameError) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          birthdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Inscription réussie:', data.success);
        onRegistrationSuccess();
      } else {
        console.log('Erreur d\'inscription:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la requête d\'inscription:', error.message);
    }
  };

  return (
    <form className="form__content" onSubmit={handleRegister}>
      <h2>Inscription</h2>
      <div className="group__input">
        <label>Prénom :</label>
        <input type="text" name="firstName" value={firstName} onChange={handleInputChange} />
        {errorMessages.firstName && (
          <div className="error-message">{errorMessages.firstName}</div>
        )}
      </div>
      <div className="group__input">
        <label>Nom :</label>
        <input type="text" name="lastName" value={lastName} onChange={handleInputChange} />
        {errorMessages.lastName && (
          <div className="error-message">{errorMessages.lastName}</div>
        )}
      </div>
      <div className="group__input">
        <label>Email :</label>
        <input type="text" name="email" value={email} onChange={handleInputChange} />
        {errorMessages.email && (
          <div className="error-message">{errorMessages.email}</div>
        )}
      </div>
      <div className="group__input">
        <label>Mot de passe :</label>
        <input type="password" name="password" value={password} onChange={handleInputChange} />
        {errorMessages.password && (
          <div className="error-message">{errorMessages.password}</div>
        )}
      </div>
      <div className="group__input">
        <label>Confirmer le mot de passe :</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleInputChange}
        />
        {errorMessages.confirmPassword && (
          <div className="error-message">{errorMessages.confirmPassword}</div>
        )}
      </div>
      <div className="group__input">
        <label>Date de naissance :</label>
        <input type="date" name="birthdate" value={birthdate} onChange={handleInputChange} />
      </div>
      <button type="submit" className="button__login">S'inscrire</button>
    </form>

  );
};

export default RegisterForm;
