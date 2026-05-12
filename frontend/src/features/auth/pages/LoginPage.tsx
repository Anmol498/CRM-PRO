import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import logo from '../../../assets/logo.png';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('remembered_email');
        const savedPassword = localStorage.getItem('remembered_password');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        if (savedPassword) {
            try { setPassword(atob(savedPassword)); } catch (e) {}
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (rememberMe) {
                localStorage.setItem('remembered_email', email);
                localStorage.setItem('remembered_password', btoa(password));
            } else {
                localStorage.removeItem('remembered_email');
                localStorage.removeItem('remembered_password');
            }
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center">
                    <img src={logo} alt="Travel Window" className="w-32 md:w-56 h-auto drop-shadow-sm"/>
                </div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-4 text-center text-sm text-slate-500 font-bold uppercase tracking-widest"
                >
                     Travel CRM Portal
                </motion.p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-12 border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl p-4 font-bold flex items-center gap-3 shadow-sm"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                Email Address
                            </label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl shadow-sm bg-slate-50/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary sm:text-sm transition-all font-medium"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-2xl shadow-sm bg-slate-50/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary sm:text-sm transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev: boolean) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 px-1">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-slate-200 rounded-lg cursor-pointer transition-all"
                                />
                                <label htmlFor="remember-me" className="ml-2.5 block text-xs font-bold text-slate-500 cursor-pointer select-none uppercase tracking-wider">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full py-6 text-sm uppercase tracking-widest"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} Travel Window Private Limited
                </p>
            </motion.div>
        </div>
    );
};


