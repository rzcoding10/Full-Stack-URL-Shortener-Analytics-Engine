import { useState } from 'react';
import { createShortLink } from '../services/linkService';

const Home = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShortUrl(null);
        setCopied(false);

        try {
            const response = await createShortLink(originalUrl);
            // Based on your controller, the response structure is { data: { shortUrl: ... } }
            setShortUrl(response.data.shortUrl);
            setOriginalUrl(''); // Clear the input field
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten the URL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert("Failed to copy link to clipboard. Please copy it manually.");
            console.error("Clipboard error:", err);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '10vh auto', textAlign: 'center', fontFamily: 'sans-serif', padding: '0 20px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Shorten Your Links</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Paste any long URL below to get a clean, tracking-ready short link.
            </p>

            {error && <div style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
                <input 
                    type="url" 
                    placeholder="https://your-really-long-url.com/something-complicated" 
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                    style={{ flex: 1, padding: '12px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: '12px 24px', 
                        fontSize: '1rem', 
                        backgroundColor: loading ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Shortening...' : 'Shorten'}
                </button>
            </form>

            {shortUrl && (
                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#28a745' }}>Success! Here is your short link:</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <a href={shortUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {shortUrl}
                        </a>
                        <button 
                            onClick={handleCopy}
                            style={{ marginLeft: '15px', padding: '8px 15px', backgroundColor: copied ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;