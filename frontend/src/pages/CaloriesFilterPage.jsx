import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CaloriesFilterPage = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxCalories, setMaxCalories] = useState('');
    const [showResults, setShowResults] = useState(false);

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

    const handleFilter = () => {
        if (maxCalories && parseInt(maxCalories) > 0) {
            setShowResults(true);
        }
    };

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
                {!showResults ? (
                    <div className="p-6 bg-green-50 rounded-lg max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-center">Calories Filter</h2>
                        <label className="block text-lg font-semibold mb-4">Max calories (e.g. 300):</label>
                        <input
                            type="number"
                            placeholder="Max calories"
                            value={maxCalories}
                            onChange={(e) => setMaxCalories(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-6"
                            min="0"
                        />
                        <button 
                            onClick={handleFilter}
                            disabled={!maxCalories || parseInt(maxCalories) <= 0}
                            className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                        >
                            Show Low-Calorie Items
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-blue-600 mb-6">Showing items under {maxCalories} calories</p>
                        {categories.map(category => {
                            const categoryItems = menu.filter(item => 
                                item.category === category && 
                                (!maxCalories || item.calories <= parseInt(maxCalories))
                            );
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
                        {categories.every(cat => 
                            menu.filter(item => 
                                item.category === cat && 
                                item.calories <= parseInt(maxCalories)
                            ).length === 0
                        ) && (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-500">No items under {maxCalories} calories. Try adjusting the filter.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CaloriesFilterPage;

