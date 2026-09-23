import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');

            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
        } catch (error) {
            console.error('Error loading user:', error);
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    // LOGIN
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });

            console.log('LOGIN SUCCESS:', data);

            setUser(data);

            localStorage.setItem(
                'userInfo',
                JSON.stringify(data)
            );

            localStorage.setItem(
                'token',
                data.token
            );

            return data;

        } catch (error) {

            console.error('LOGIN ERROR:', error);
            console.error('LOGIN RESPONSE:', error.response?.data);

            if (error.response?.data?.needsVerification) {
                throw error.response.data;
            }

            throw new Error(
                error.response?.data?.message ||
                'Unable to connect to server'
            );
        }
    };

    // REGISTER
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            console.log('REGISTER SUCCESS:', data);

            return data;

        } catch (error) {

            console.error('REGISTER ERROR:', error);
            console.error('REGISTER RESPONSE:', error.response?.data);

            throw new Error(
                error.response?.data?.message ||
                'Registration failed'
            );
        }
    };

    // VERIFY OTP
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', {
                email: email.trim().toLowerCase(),
                otp: String(otp).trim()
            });

            console.log('OTP VERIFICATION SUCCESS:', data);

            setUser(data);

            localStorage.setItem(
                'userInfo',
                JSON.stringify(data)
            );

            localStorage.setItem(
                'token',
                data.token
            );

            return data;

        } catch (error) {

            console.error('OTP ERROR:', error);
            console.error('OTP RESPONSE:', error.response?.data);

            throw new Error(
                error.response?.data?.message ||
                'OTP verification failed'
            );
        }
    };

    // LOGOUT
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                verifyOtp,
                logout,
                loading
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};