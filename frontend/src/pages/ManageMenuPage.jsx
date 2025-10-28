import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ManageMenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'North Indian', image: '/images/default.jpg' });
    const { user } = useAuth();

    const fetchMenu = async () => {
        const { data } = await axios.get('/api/menu');
        setMenu(data);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/menu', newItem, config);
            alert('Item added!');
            setNewItem({ name: '', description: '', price: '', category: 'North Indian', image: '/images/default.jpg' });
            fetchMenu();
        } catch (error) {
            console.error('Failed to add menu item', error);
            alert('Failed to add item.');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/menu/${id}`, config);
                alert('Item deleted!');
                fetchMenu();
            } catch (error) {
                console.error('Failed to delete menu item', error);
                alert('Failed to delete item.');
            }
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-8">Manage Menu</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
                <form onSubmit={handleAddItem} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required className="w-full px-4 py-2 border rounded-md" />
                    <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} required className="w-full px-4 py-2 border rounded-md"></textarea>
                    <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required className="w-full px-4 py-2 border rounded-md" />
                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-4 py-2 border rounded-md">
                        <option>North Indian</option>
                        <option>South Indian</option>
                        <option>Chinese</option>
                    </select>
                    <input type="text" placeholder="Image URL" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} required className="w-full px-4 py-2 border rounded-md" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Add Item</button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Existing Items</h2>
                <div className="space-y-4">
                    {menu.map(item => (
                        <div key={item._id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{item.name} ({item.category})</p>
                                <p>₹{item.price}</p>
                            </div>
                            <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageMenuPage;