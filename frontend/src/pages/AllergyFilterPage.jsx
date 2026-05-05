import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AllergyFilterPage = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAllergens, setSelectedAllergens] = useState([]);
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
        setShowResults(true);
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
                    <div className="p-6 bg-yellow-50 rounded-lg max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-center">Allergy Filter</h2>
                        <label className="block text-lg font-semibold mb-4">Select allergens to exclude:</label>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {['nuts', 'dairy', 'gluten', 'eggs', 'shellfish'].map(allergen => (
                                <label key={allergen} className="flex items-center p-2 bg-white rounded border">
                                    <input
                                        type="checkbox"
                                        value={allergen}
                                        checked={selectedAllergens.includes(allergen)}
                                        onChange={(e) => {
                                            const allergenVal = e.target.value;
                                            setSelectedAllergens(prev =>
                                                prev.includes(allergenVal)
                                                    ? prev.filter(a => a !== allergenVal)
                                                    : [...prev, allergenVal]
                                            );
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm capitalize">{allergen}</span>
                                </label>
                            ))}
                        </div>
                        <button 
                            onClick={handleFilter}
                            disabled={selectedAllergens.length === 0}
                            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            Show Filtered Menu
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-red-600 mb-6">Excluding: {selectedAllergens.join(', ')}</p>
                        {categories.map(category => {
                            const categoryItems = menu.filter(item => 
                                item.category === category && 
                                !selectedAllergens.some(allergen => 
                                    item.ingredients?.some(ing => ing.toLowerCase().includes(allergen))
                                )
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
                                !selectedAllergens.some(allergen => 
                                    item.ingredients?.some(ing => ing.toLowerCase().includes(allergen))
                                )
                            ).length === 0
                        ) && (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-500">No items matching allergy exclusions. Try adjusting filters.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllergyFilterPage;

