import React from 'react';
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer'

const Account = () => {
  const { isLoggingIn } = useAuth();

  if (!isLoggingIn) {
    return <Navigate to="/home" />;
  }
  return (
    <div>
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Account;