import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Assurez-vous du chemin correct


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, setIsLoggingIn } = useAuth();
  const navigate = useNavigate();

  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrorMessages((prevState) => ({
      ...prevState,
      [name]: '',
    }));

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailError = !email ? 'Veuillez remplir ce champ.' : '';
    const passwordError = !password ? 'Veuillez remplir ce champ.' : '';

    setErrorMessages({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        login(userData);
        setIsLoggingIn(true);
        console.log('Connexion réussie');

        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Erreur de connexion:', errorData.error);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form__content">
      <h2>Connexion</h2>
      <div className="group__input">
        <label>Email :</label>
        <input type="text" name="email" value={email} onChange={handleInputChange} />
        {errorMessages.email && <div className="error-message">{errorMessages.email}</div>}
      </div>
      <div className="group__input">
        <label>Mot de passe :</label>
        <input type="password" name="password" value={password} onChange={handleInputChange} />
        {errorMessages.password && <div className="error-message">{errorMessages.password}</div>}
      </div>
      <button type="submit" className="button__login" onClick={handleLogin}>Se connecter</button>
    </form>
  );
};

export default LoginForm;
