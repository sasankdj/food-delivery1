import React from 'react';
import Hero from '../components/Hero'; // Assuming Hero is in components
import MenuPage from './pages/MenuPage';
import { useAuth } from './context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    user ? <MenuPage /> : <Hero />
  );
};

export default HomePage;