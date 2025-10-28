import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/menu" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 text-center text-xl font-semibold">
                    Manage Menu
                </Link>
                <Link to="/admin/orders" className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 text-center text-xl font-semibold">
                    Manage Orders
                </Link>
            </div>
        </div>
    );
};

export default AdminPage;