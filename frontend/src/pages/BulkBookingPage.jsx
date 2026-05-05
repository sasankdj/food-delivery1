import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const BulkBookingPage = () => {
    const navigate = useNavigate();
    const { addToCart, updateQuantity, cartItems } = useCart();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/menu`);
                setMenu(data);
                // Initialize quantities
                const initQty = {};
                data.forEach(item => {
                    initQty[item._id] = 0;
                });
                setQuantities(initQty);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch menu', error);
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const updateQty = (id, qty) => {
        setQuantities(prev => ({ ...prev, [id]: parseInt(qty) || 0 }));
    };

    const handleBulkAdd = () => {
        let addedCount = 0;
        Object.entries(quantities).forEach(([id, qty]) => {
            if (qty > 0) {
                const item = menu.find(i => i._id === id);
                if (item) {
                    const existing = cartItems.find(c => c._id === id);
                    if (existing) {
                        updateQuantity(id, existing.qty + qty);
                    } else {
                        const bulkItem = { ...item, qty };
                        addToCart(bulkItem); // Triggers qty=bulk qty since no increment for new
                    }
                    addedCount += qty;
                }
            }
        });
        if (addedCount > 0) {
            alert(`${addedCount} items added to cart in bulk! Check discounts for qty >=5.`);
            // Reset quantities
            const resetQty = {};
            menu.forEach(item => resetQty[item._id] = 0);
            setQuantities(resetQty);
        } else {
            alert('Please select quantities first.');
        }
    };

    const estimatedTotal = menu.reduce((total, item) => {
        const qty = quantities[item._id] || 0;
        if (qty > 0) {
            const discountFactor = qty >= 5 ? 0.9 : 1.0; // Same as cart
            return total + qty * item.price * discountFactor;
        }
        return total;
    }, 0);

    const categories = ['North Indian', 'South Indian', 'Chinese'];

    if (loading) return <p className="text-center mt-8">Loading menu...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <button 
                    onClick={() => navigate('/menu')}
                    className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Back to Menu
                </button>
                <div className="bg-indigo-50 p-6 rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Bulk Booking</h2>
                    <p className="text-sm text-indigo-700 mb-4">Enter quantities for bulk (discount 10% for 5+ per item)</p>
                    <div className="flex justify-between items-center mb-4">
                        <span>Estimated Total: ₹{estimatedTotal.toFixed(2)}</span>
                        <button 
                            onClick={handleBulkAdd}
                            disabled={Object.values(quantities).every(q => q === 0)}
                            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 font-semibold"
                        >
                            Add Bulk to Cart
                        </button>
                    </div>
                </div>
                {categories.map(category => {
                    const categoryItems = menu.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;
                    return (
                        <div key={category} className="mb-12">
                            <h2 className="text-3xl font-bold border-b-2 border-gray-300 pb-2 mb-6">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryItems.map(item => (
                                    <div key={item._id} className="border rounded-lg overflow-hidden shadow-lg">
                                        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold">{item.name}</h3>
                                            <p className="text-gray-600 mt-2">{item.description}</p>
                                            <p className="text-sm font-medium text-orange-600 mt-1">Calories: {item.calories} kcal</p>
                                            <p className="font-semibold text-lg">₹{item.price}</p>
                                            <div className="mt-4 flex items-center space-x-2">
                                                <label className="text-sm font-medium">Qty:</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    value={quantities[item._id] || 0}
                                                    onChange={(e) => updateQty(item._id, e.target.value)}
                                                    className="w-20 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BulkBookingPage;

