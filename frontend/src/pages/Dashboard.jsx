import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserLinks } from '../services/linkService';

const Dashboard = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Safely pull the backend URL from the environment, defaulting to localhost for local development
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await getUserLinks();
                const linksArray = response.data || []; 
                setLinks(linksArray);
            } catch (err) {
                setError('Failed to fetch your links.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '10vh', fontFamily: 'sans-serif' }}>Loading your links...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '10vh', fontFamily: 'sans-serif' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '5vh auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
            <h2>My Dashboard</h2>
            
            {links.length === 0 ? (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px', textAlign: 'center' }}>
                    <p>You haven't shortened any URLs yet.</p>
                    <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Create your first link</Link>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px' }}>Original URL</th>
                                <th style={{ padding: '12px' }}>Short Link</th>
                                <th style={{ padding: '12px' }}>Total Clicks</th>
                                <th style={{ padding: '12px' }}>Created</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <a href={link.originalUrl} target="_blank" rel="noreferrer" style={{ color: '#666' }}>
                                            {link.originalUrl}
                                        </a>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {/* Now using the environment variable instead of hardcoded localhost */}
                                        <a 
                                            href={`${backendUrl}/api/url/${link.shortUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}
                                        >
                                            /{link.shortUrl} 
                                        </a>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '10px', fontSize: '0.9rem' }}>
                                            {link.totalClicks}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                                        {new Date(link.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <Link 
                                            to={`/analytics/${link.shortUrl}`} 
                                            style={{ padding: '5px 10px', backgroundColor: '#e9ecef', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}
                                        >
                                            Analytics
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;