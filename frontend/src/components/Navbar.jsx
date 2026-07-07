import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(); // Calls your backend to clear the secure cookie
            logoutUser();   // Clears the React context state
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd', fontFamily: 'sans-serif' }}>
            <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                LinkPulse
            </Link>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ color: '#666' }}>Hello, {user.email}</span>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
                        <button onClick={handleLogout} style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</Link>
                        <Link to="/register" style={{ padding: '5px 15px', textDecoration: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '4px' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;