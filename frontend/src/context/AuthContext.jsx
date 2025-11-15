import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user info is in localStorage on initial load
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            navigate('/');
        } catch (error) {
            console.error("Login failed", error.response.data);
            alert('Error logging in. Please check your credentials.');
        }
    };

    const signup = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
            // We get a token on signup, so we can log the user in directly
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            alert('Signup successful! You are now logged in.');
            navigate('/');
        } catch (error) {
            console.error("Signup failed", error.response.data);
            alert('Error signing up. The user may already exist.');
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    const value = { user, login, signup, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};