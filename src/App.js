import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Product from './pages/Product';
import Account from './pages/Account';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
