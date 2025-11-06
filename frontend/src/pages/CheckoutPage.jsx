import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress: { address, city, postalCode },
                    totalPrice,
                },
                config
            );

            clearCart();
            navigate(`/order/${data._id}`);

        } catch (error) {
            console.error('Order placement failed', error);
            toast.error('Failed to place order.');
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">Checkout</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <form onSubmit={placeOrderHandler} className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-4">
                            <label className="block text-gray-700">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full px-4 py-2 mt-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-2 mt-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Postal Code</label>
                            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full px-4 py-2 mt-2 border rounded-md" />
                        </div>
                        <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Place Order
                        </button>
                    </form>
                </div>
                <div className="md:w-1/3">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold border-b pb-2">Order Summary</h2>
                        <div className="flex justify-between mt-4 font-bold">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;