import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ManageOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/api/orders`, config);
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
    
    const handleMarkAsShipped = async (orderId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/orders/${orderId}/ship`, {}, config);
            fetchOrders(); // Refresh orders to show updated status
        } catch (error) {
            console.error('Failed to mark as shipped', error);
            toast.error('Failed to update order status.');
        }
    };

    const handleMarkAsDelivered = async (orderId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/orders/${orderId}/deliver`, {}, config);
            fetchOrders(); // Refresh orders to show updated status
        } catch (error) {
            console.error('Failed to mark as delivered', error);
            toast.error('Failed to update order status.');
        }
    };

    if (loading) return <p className="text-center mt-8">Loading orders...</p>;

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                                    <p className="text-sm text-gray-500">User: {order.user.name} ({order.user.email})</p>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="text-lg font-bold">Total: ₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Shipping Address:</h3>
                                <p className="text-gray-700">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                <p className="text-gray-700">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Items:</h3>
                                {order.orderItems.map(item => <p key={item.product} className="text-gray-700">{item.name} (x{item.qty})</p>)}
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-2">Status:</h3>
                                <div className="flex items-center space-x-4">
                                    <p className={`font-medium ${order.isDelivered ? 'text-green-600' : order.isShipped ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : order.isShipped ? `Shipped on ${new Date(order.shippedAt).toLocaleDateString()}` : 'Placed'}
                                    </p>
                                    {!order.isShipped && (
                                        <button onClick={() => handleMarkAsShipped(order._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                                            Mark as Shipped
                                        </button>
                                    )}
                                    {order.isShipped && !order.isDelivered && (
                                        <button onClick={() => handleMarkAsDelivered(order._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOrdersPage;