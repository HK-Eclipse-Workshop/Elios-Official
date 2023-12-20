import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import CartDetails from '../components/CartDetails';
import Footer from '../components/Footer';


const Home = () => {

  return (
    <div>
      <Navbar />
      <CartDetails />
      <Footer />
    </div>
  );
};

export default Home;