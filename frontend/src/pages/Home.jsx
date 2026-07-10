import { useState } from 'react';
import { createShortLink } from '../services/linkService';
import { FiLink, FiCopy, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

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
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 font-sans bg-gradient-to-br from-slate-50 via-white to-cyan-50 selection:bg-cyan-100">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Shorten your links. <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
                        Expand your reach.
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    Paste any long URL below to get a clean, tracking-ready short link in seconds.
                </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
                {/* Error State */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
                        <FiAlertCircle className="text-xl flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Shortener Card */}
                <form 
                    onSubmit={handleSubmit} 
                    className="bg-white p-2 sm:p-3 rounded-2xl shadow-xl shadow-indigo-100/40 border border-slate-100 flex flex-col sm:flex-row gap-3 relative z-10 transition-shadow hover:shadow-2xl hover:shadow-indigo-100/50"
                >
                    <div className="relative flex-grow flex items-center">
                        <FiLink className="absolute left-4 text-slate-400 text-lg pointer-events-none" />
                        <input 
                            type="url" 
                            placeholder="https://your-really-long-url.com/something-complicated" 
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            required
                            autoFocus
                            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-transparent text-slate-700 placeholder:text-slate-400 text-base outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 px-8 py-3 sm:py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                            loading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-indigo-500/25 active:scale-[0.98]'
                        }`}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin text-lg" />
                                <span>Shortening...</span>
                            </>
                        ) : (
                            <span>Shorten Link</span>
                        )}
                    </button>
                </form>

                {/* Success Card */}
                {shortUrl && (
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 transition-all duration-500">
                        <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">
                            Success! Your link is ready.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-2 sm:p-2 pl-4 rounded-xl border border-slate-200">
                            <a 
                                href={shortUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-grow text-indigo-600 font-medium text-lg truncate hover:text-indigo-800 transition-colors"
                            >
                                {shortUrl}
                            </a>
                            <button 
                                type="button"
                                onClick={handleCopy}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                    copied 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <FiCheck className="text-lg" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="text-lg" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;