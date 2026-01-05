import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('analyst'); // Default role for signup
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login Flow
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);

                const res = await axios.post('http://localhost:8000/auth/token', formData);
                login(res.data.access_token);
                navigate('/');
            } else {
                // Signup Flow
                await axios.post('http://localhost:8000/auth/register', {
                    email,
                    hashed_password: password,
                    role: role
                });
                // Auto login after signup
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);
                const res = await axios.post('http://localhost:8000/auth/token', formData);
                login(res.data.access_token);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                            DealFlow
                        </h1>
                        <p className="text-gray-500">Investment Pipeline Management</p>
                    </div>

                    <div className="flex bg-gray-100/50 p-1 rounded-lg mb-6 relative">
                        <div
                            className={`w-1/2 absolute h-full top-0 rounded-md bg-white shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-0' : 'left-1/2'}`}
                        />
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium relative z-10 transition-colors ${isLogin ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium relative z-10 transition-colors ${!isLogin ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="name@fund.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Role</label>
                                    <select
                                        className="input-field"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="analyst">Analyst</option>
                                        <option value="partner">Partner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </motion.div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
