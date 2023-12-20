import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';


const Shop = () => {

  return (
    <div>
      <Navbar />
      <ProductList />
      <Footer />
    </div>
  );
};

export default Shop;