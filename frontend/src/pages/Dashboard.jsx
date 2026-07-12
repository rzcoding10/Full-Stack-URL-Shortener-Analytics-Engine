import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserLinks } from '../services/linkService';
import { 
    FiBarChart2, FiLink, FiCopy, FiCheck, 
    FiExternalLink, FiSearch, FiLoader, FiAlertCircle, FiActivity 
} from 'react-icons/fi';

const Dashboard = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await getUserLinks();
                setLinks(response.data || []);
            } catch {
                setError('Failed to fetch your links.');
                // TODO: Add toast notification for failure
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    const totalClicks = links.reduce((sum, link) => sum + (link.totalClicks || 0), 0);
    const averageClicks = links.length ? (totalClicks / links.length).toFixed(1) : 0;
    
    const filteredLinks = links.filter((link) => {
    const query = searchTerm.toLowerCase();

    const normalizedUrl = link.originalUrl
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

    return (
    normalizedUrl.includes(query) ||
    link.shortUrl.toLowerCase().includes(query)
);
});

    const handleCopy = async (shortUrl, id) => {
        const fullUrl = `${backendUrl}/api/url/${shortUrl}`;
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // TODO: Add toast notification for clipboard failure
        }
    };

    const formatUrl = (url) => {
        try {
            const urlObj = new URL(url);
            let cleanUrl = urlObj.hostname.replace('www.', '') + (urlObj.pathname !== '/' ? urlObj.pathname : '');
            return cleanUrl.length > 40 ? cleanUrl.substring(0, 40) + '...' : cleanUrl;
        } catch {
            return url.length > 40 ? url.substring(0, 40) + '...' : url;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50 font-sans">
                <FiLoader className="text-4xl text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Fetching your analytics...</p>
            </div>
        );
    }

    

    return (
        <div className="min-h-[85vh] bg-slate-50 font-sans pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage and track your shortened links.</p>
                    </div>
                    <Link 
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FiLink />
                        <span>Create New Link</span>
                    </Link>
                </div>

                {error && (
                    <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100">
                        <FiAlertCircle className="text-xl flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {links.length === 0 && !error ? (
                    <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FiLink />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No links yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">
                            You haven't created any short links. Create your first one to start tracking analytics!
                        </p>
                        <Link 
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Create Your First Link
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
                                    <FiLink />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Links</p>
                                    <p className="text-4xl font-extrabold text-slate-900">{links.length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center text-xl">
                                    <FiBarChart2 />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Clicks</p>
                                    <p className="text-4xl font-extrabold text-slate-900">{totalClicks}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">
                                    <FiActivity />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Avg Clicks / Link</p>
                                    <p className="text-4xl font-extrabold text-slate-900">{averageClicks}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table Controls (Search) */}
                        <div className="bg-white rounded-t-xl border-x border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-semibold text-slate-800">Recent Links</h3>
                            <div className="relative w-full sm:w-72">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search links..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                        <th className="px-6 py-4">Original URL</th>
                                        <th className="px-6 py-4">Short Link</th>
                                        <th className="px-6 py-4 text-center">Clicks</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredLinks.length > 0 ? (
                                        filteredLinks.map((link) => (
                                            <tr key={link._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <a 
                                                            href={link.originalUrl} 
                                                            target="_blank" 
                                                            rel="noreferrer" 
                                                            className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                                                            title={link.originalUrl}
                                                        >
                                                            {formatUrl(link.originalUrl)}
                                                            <FiExternalLink className="flex-shrink-0 text-slate-400" />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a 
                                                        href={`${backendUrl}/api/url/${link.shortUrl}`} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    >
                                                        /{link.shortUrl}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                                        {link.totalClicks}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(link.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {copiedId === link._id ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                                <FiCheck /> Copied!
                                                            </span>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleCopy(link.shortUrl, link._id)}
                                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                                                                title="Copy Link"
                                                            >
                                                                <FiCopy className="text-lg" />
                                                            </button>
                                                        )}
                                                        <Link 
                                                            to={`/analytics/${link.shortUrl}`} 
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 rounded-lg transition-all shadow-sm"
                                                        >
                                                            <FiBarChart2 />
                                                            Analytics
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                                                No links match your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;