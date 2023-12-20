import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LoginForm from '../components/login/loginForm';
import RegisterForm from '../components/login/registerForm';

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [currentForm, setCurrentForm] = useState('login');


  const toggleForm = () => {
    setCurrentForm((prevForm) => (prevForm === 'login' ? 'register' : 'login'));
  };

  const handleRegistrationSuccess = () => {
    setCurrentForm('login');
  };

  return (
    <div>
      <Navbar />
      <section className="login">
        <div className="form">
          {currentForm === 'login' ? (
            <LoginForm />
          ) : (
            <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
          )}
          <a onClick={toggleForm}>
            {currentForm === 'login'
              ? 'Vous n\'avez pas de compte ? S\'inscrire'
              : 'Vous avez déjà un compte ? Se connecter'}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Login;
