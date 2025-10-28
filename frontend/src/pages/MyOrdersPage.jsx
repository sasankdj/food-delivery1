import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-8">Loading your orders...</p>;
    }

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            {orders.length === 0 ? (
                <p>You have no past orders. <Link to="/" className="text-blue-500">Start shopping!</Link></p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="text-lg font-bold">Total: ₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Items:</h3>
                                {order.orderItems.map(item => <p key={item.product} className="text-gray-700">{item.name} (x{item.qty})</p>)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;