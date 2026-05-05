import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/menu`);
                setMenu(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch menu', error);
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const categories = ['North Indian', 'South Indian', 'Chinese'];

    if (loading) return <p className="text-center mt-8">Loading menu...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Explore Menu Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <button 
                        onClick={() => navigate('/menu/allergy-filter')}
                        className="p-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        🥜 Allergy Filter
                    </button>
                    <button 
                        onClick={() => navigate('/menu/calories-filter')}
                        className="p-4 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        🔥 Calories Filter
                    </button>
                    <button 
                        onClick={() => navigate('/menu/budget-filter')}
                        className="p-4 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        💰 Budget Filter
                    </button>
                    <button 
                        onClick={() => navigate('/menu/bulk-booking')}
                        className="p-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        📦 Bulk Booking
                    </button>
                </div>
                <p className="text-center mt-6 text-blue-100">Or scroll down for full menu</p>
            </div>
            {categories.map(category => {
                const categoryItems = menu.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                return (
                    <div key={category} className="mb-12">
                        <h2 className="text-3xl font-bold border-b-2 border-gray-300 pb-2 mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryItems.map(item => (
                                <MenuItemCard key={item._id} item={item} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MenuPage;
