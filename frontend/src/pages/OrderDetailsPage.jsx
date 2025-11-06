import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order details', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const downloadReceipt = () => {
        if (!order) return;

        const receiptContent = `
Order Receipt
=============

Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Customer: ${order.user.name}
Email: ${order.user.email}

Shipping Address:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}

Items:
${order.orderItems.map(item => `${item.name} (x${item.qty}) - ₹${item.price.toFixed(2)} each`).join('\n')}

Total: ₹${order.totalPrice.toFixed(2)}
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${order._id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) return <p className="text-center mt-8">Loading order details...</p>;
    if (!order) return <p className="text-center mt-8">Order not found.</p>;

    const StatusStep = ({ title, date, isCompleted, isLast = false }) => (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {isCompleted && <span className="text-white">✓</span>}
                </div>
                {!isLast && <div className={`w-0.5 h-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
            </div>
            <div>
                <h4 className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h4>
                {isCompleted && date && <p className="text-sm text-gray-500">{new Date(date).toLocaleString()}</p>}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                        <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                        onClick={downloadReceipt}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    >
                        Download Receipt
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Order Status */}
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-lg mb-4">Order Status</h3>
                        <StatusStep title="Order Placed" date={order.createdAt} isCompleted={true} />
                        <StatusStep title="Shipped" date={order.shippedAt} isCompleted={order.isShipped} />
                        <StatusStep title="Delivered" date={order.deliveredAt} isCompleted={order.isDelivered} isLast={true} />
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-2">Shipping Address</h3>
                            <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-bold text-lg mb-4">Items</h3>
                            {order.orderItems.map(item => (
                                <div key={item.product} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded mr-4" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 mt-4 text-right">
                            <p className="text-xl font-bold">Total: ₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
