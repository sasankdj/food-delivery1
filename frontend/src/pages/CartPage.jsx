import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, itemsCount } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Your cart is empty. <Link to="/" className="text-blue-500">Go Shopping</Link>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-3/4">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />
                                        <div className="ml-4">
                                            <h2 className="font-bold">{item.name}</h2>
                                            <p className="text-gray-600">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateQuantity(item._id, e.target.value)}
                                            className="w-16 text-center border rounded mx-4"
                                            min="1"
                                        />
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/4">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-bold border-b pb-2">Order Summary</h2>
                            <div className="flex justify-between mt-4">
                                <span>Subtotal ({itemsCount} items)</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={() => navigate('/checkout')}
                                className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;