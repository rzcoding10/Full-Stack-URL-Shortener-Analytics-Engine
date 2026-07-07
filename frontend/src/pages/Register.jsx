import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    // REMOVED the 'name' state to match your backend
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = await register({ email, password });
            loginUser(data.user);
            navigate('/dashboard'); // We will build this next, but the router will handle the redirect!
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '10vh auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>Create an Account</h2>
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
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Sign Up
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;