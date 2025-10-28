import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { itemsCount } = useCart();

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-xl font-bold">FoodFleet</Link>
                <nav>
                    <ul className="flex items-center space-x-6">
                        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                        <li><Link to="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                        {user ? (
                            <>
                                <li>
                                    <Link to="/cart" className="relative hover:text-gray-300">
                                        Cart
                                        {itemsCount > 0 && <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemsCount}</span>}
                                    </Link>
                                </li>
                                <li><Link to="/myorders" className="hover:text-gray-300">My Orders</Link></li>
                                {user.isAdmin && <li><Link to="/admin" className="hover:text-gray-300">Admin</Link></li>}
                                <li className="text-gray-300">Hi, {user.name}</li>
                                <li>
                                    <button onClick={logout} className="hover:text-gray-300">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                                <li><Link to="/signup" className="hover:text-gray-300">Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;