import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // IMPORTANT: verifyOtp, not verifyOTP
    const { register, verifyOtp } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // STEP 1: Register new user
            if (!showOTP) {
                await register(name, email, password);

                setShowOTP(true);

                setSuccess(
                    'OTP has been sent to your email. Please enter the OTP to verify your account.'
                );
            }

            // STEP 2: Verify OTP
            else {
                if (otp.length !== 6) {
                    setError('Please enter a valid 6-digit OTP.');
                    return;
                }

                await verifyOtp(email, otp);

                setSuccess('Account verified successfully!');

                // User is now logged in
                navigate('/dashboard');
            }

        } catch (err) {
            console.error('Register/OTP Error:', err);

            if (typeof err === 'string') {
                setError(err);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-gray-50">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

                {/* Heading */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                            E
                        </span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {showOTP ? 'Verify Your Account' : 'Create an Account'}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {showOTP
                            ? 'Enter the OTP sent to your email'
                            : 'Join Eventora today'}
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-center border border-red-200">
                        {error}
                    </div>
                )}


                {/* Success */}
                {success && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-5 text-center border border-green-200">
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* REGISTER FORM */}
                    {!showOTP ? (
                        <>
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition"
                                />
                            </div>


                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition"
                                />
                            </div>


                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition"
                                />
                            </div>
                        </>
                    ) : (

                        /* OTP FORM */
                        <div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                                <p className="text-sm text-blue-700">
                                    We have sent a 6-digit OTP to:
                                </p>

                                <p className="font-bold text-blue-900 mt-1">
                                    {email}
                                </p>
                            </div>


                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification Code
                            </label>

                            <input
                                type="text"
                                required
                                inputMode="numeric"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .replace(/\D/g, '');

                                    setOtp(value);
                                }}
                                className="w-full px-4 py-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-gray-900 transition text-center text-2xl font-bold tracking-[0.5em]"
                            />

                            <p className="text-xs text-gray-500 text-center mt-3">
                                OTP is valid for 5 minutes.
                            </p>

                        </div>
                    )}


                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-900 hover:bg-black'
                        }`}
                    >
                        {loading
                            ? 'Processing...'
                            : showOTP
                                ? 'Verify & Complete'
                                : 'Create Account'}
                    </button>

                </form>


                {/* Login link */}
                {!showOTP && (
                    <p className="text-center mt-6 text-gray-600">
                        Already have an account?{' '}

                        <Link
                            to="/login"
                            className="text-gray-900 font-bold hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                )}

            </div>
        </div>
    );
};

export default Register;