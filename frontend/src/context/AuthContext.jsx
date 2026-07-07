import { createContext, useState, useEffect } from 'react';
import { getProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const checkUser = async () => {
            try {
                const data = await getProfile();
                setUser(data.user);
            } catch (err) {
                setUser(null); // User is not authenticated
            } finally {
                setLoading(false); // Auth check complete
            }
        };

        checkUser();
    }, []);

    const loginUser = (userData) => setUser(userData);
    const logoutUser = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
            {!loading && children} {/* Don't render until auth check finishes */}
        </AuthContext.Provider>
    );
};