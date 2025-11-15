import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ContactUsPage from './pages/ContactUsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailsPage';
import AdminPage from './pages/AdminPage';
import ManageMenuPage from './pages/ManageMenuPage';
import ManageOrdersPage from './pages/ManageOrdersPage';

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path='' element={<ProtectedRoute />}>
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/order/:id' element={<OrderSuccessPage />} />
            <Route path='/myorders' element={<MyOrdersPage />} />
            <Route path='/orders/:id' element={<OrderDetailPage />} />
          </Route>
          <Route path='/admin' element={<AdminRoute />}>
            <Route path='' element={<AdminPage />} />
            <Route path='menu' element={<ManageMenuPage />} />
            <Route path='orders' element={<ManageOrdersPage />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App;