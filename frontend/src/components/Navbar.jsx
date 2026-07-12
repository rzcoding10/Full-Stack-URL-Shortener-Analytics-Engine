import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import { FiActivity, FiLogOut, FiPieChart } from 'react-icons/fi';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            logoutUser();
            navigate('/login');
        } catch {
            // TODO: replace with toast notification
        }
    };

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight group">
                        <FiActivity className="text-indigo-600 text-3xl transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300 group-hover:brightness-110">
                            LinkPulse
                        </span>
                    </Link>
                    
                    {/* Right side navigation */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <>
                                {/* User Avatar Badge (Hidden on mobile) */}
                                <div 
                                    className="hidden md:flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 pl-1 pr-3 py-1 rounded-full border border-slate-200"
                                    title={user.email}
                                >
                                    <div 
                                        className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-bold text-xs"
                                        aria-label="User avatar"
                                    >
                                        {userInitial}
                                    </div>
                                    <span className="truncate max-w-[150px]">{user.email}</span>
                                </div>
                                
                                <NavLink 
                                    to="/dashboard" 
                                    className={({ isActive }) => `flex items-center gap-2 font-medium transition-colors px-3 py-2 rounded-lg ${
                                        isActive 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                                    }`}
                                >
                                    <FiPieChart className="text-lg" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </NavLink>
                                
                                <button 
                                    onClick={handleLogout} 
                                    type="button"
                                    className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:shadow-sm rounded-lg font-medium transition-all duration-200"
                                >
                                    <FiLogOut className="text-lg" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;