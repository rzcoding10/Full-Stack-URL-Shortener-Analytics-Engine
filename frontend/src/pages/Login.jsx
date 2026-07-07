import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = await login({ email, password });
            loginUser(data.user); // Update global state
            navigate('/dashboard'); // Send them to the protected area
        } catch (err) {
            // Extract the error message from your Express backend
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '10vh auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>Welcome Back</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;