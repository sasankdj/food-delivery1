import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuItemCard = ({ item }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!user) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        addToCart(item);
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow-lg">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <p className="text-sm font-medium text-orange-600 mt-1">Calories: {item.calories} kcal</p>
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <p className="text-xs font-semibold text-gray-800 mb-1">Ingredients:</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
                      {item.ingredients.map((ing, index) => (
                        <li key={index}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-lg">₹{item.price}</span>
                    <button onClick={handleAddToCart} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;