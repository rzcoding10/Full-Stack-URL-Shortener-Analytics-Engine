import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const data = await login({ email, password });
            loginUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 font-sans bg-gradient-to-br from-slate-50 via-white to-cyan-50 selection:bg-cyan-100">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-indigo-100/40 border border-slate-100 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                    <p className="text-slate-500">Enter your details to access your dashboard.</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
                        <FiAlertCircle className="text-xl flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 text-slate-700 placeholder:text-slate-400 text-base outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl transition-all"
                        />
                    </div>
                    
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 text-slate-700 placeholder:text-slate-400 text-base outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl transition-all"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 mt-2 ${
                            isLoading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="animate-spin text-lg" />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                </form>
                
                {/* Footer */}
                <p className="text-center mt-8 text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;