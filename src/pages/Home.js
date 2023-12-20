import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import Landing from '../components/home/Landing'
import Features from '../components/home/Features'
import Footer from '../components/Footer';


const Home = () => {

  return (
    <div>
      <Navbar />
      <Landing />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;