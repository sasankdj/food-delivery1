import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const OrderSuccessPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);
            setOrder(data);
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
${order.orderItems.map(item => `${item.name} (x${item.qty}) - ₹${item.price} each`).join('\n')}

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

    if (!order) return <p className="text-center mt-8">Loading order details...</p>;

    return (
        <div className="container mx-auto mt-10">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md" role="alert">
                <p className="font-bold">Order Successful!</p>
                <p>Thank you for your purchase. Your order is being processed.</p>
            </div>

            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
                <p className="text-lg">
                    <span className="font-semibold">Order ID:</span> {id}
                </p>
                <p className="mt-2">
                    A confirmation and bill have been sent to your registered email address.
                </p>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-bold">Shipping to:</h3>
                    <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>

                    <h3 className="font-bold mt-4">Items:</h3>
                    <ul className="list-disc list-inside">
                        {order.orderItems.map(item => (
                            <li key={item.product}>
                                {item.name} (x{item.qty}) - ₹{item.price} each
                            </li>
                        ))}
                    </ul>

                    <h3 className="font-bold mt-4">Total: ₹{order.totalPrice.toFixed(2)}</h3>
                </div>

                <button
                    onClick={downloadReceipt}
                    className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Download Receipt
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;