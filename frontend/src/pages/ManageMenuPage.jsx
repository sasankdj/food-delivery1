import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ManageMenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'North Indian', image: '/images/default.jpg' });
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    const fetchMenu = async () => {
        const { data } = await axios.get(`${API_URL}/api/menu`);
        setMenu(data);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.image) {
            toast.error('Please upload an image first.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/menu`, newItem, config);
            toast.success('Item added successfully!');
            setNewItem({ name: '', description: '', price: '', category: 'North Indian', image: '/images/default.jpg' });
            document.getElementById('image-file-input').value = ''; // Reset file input
            fetchMenu();
        } catch (error) {
            console.error('Failed to add menu item', error);
            toast.error('Failed to add item.');
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);
            setNewItem({ ...newItem, image: data.image });
            setUploading(false);
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed');
            setUploading(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/api/menu/${id}`, config);
                toast.success('Item deleted successfully!');
                fetchMenu();
            } catch (error) {
                console.error('Failed to delete menu item', error);
                toast.error('Failed to delete item.');
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input id="image-file-input" type="file" onChange={uploadFileHandler} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        {uploading && <p>Uploading...</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" disabled={uploading}>
                        {uploading ? 'Uploading Image...' : 'Add Item'}
                    </button>
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