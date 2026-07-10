import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLinkAnalytics } from '../services/analyticService'; 
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
    FiArrowLeft, FiMousePointer, FiClock, 
    FiGlobe, FiMonitor, FiSmartphone, FiLoader, FiAlertCircle
} from 'react-icons/fi';

const Analytics = () => {
    const { hash } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getLinkAnalytics(hash);
                setData(response.data); 
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analytics.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [hash]);

    if (loading) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50 font-sans">
                <FiLoader className="text-4xl text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Crunching your data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 font-sans px-4">
                <div className="flex flex-col items-center max-w-md text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <FiAlertCircle className="text-4xl text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h3>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Link 
                        to="/dashboard" 
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // --- Safe Data Mapping & Date Formatting ---
    const timeData = data.metrics?.dailyClicks?.map(item => {
        const dateObj = new Date(item._id);
        const formattedDate = isNaN(dateObj) ? item._id : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        return {
            date: formattedDate,
            clicks: item.clicks
        };
    }) || [];

    const browserData = data.metrics?.browsers?.map(item => ({
        name: item._id || "Unknown",
        value: item.clicks
    })) || [];

    const osData = data.metrics?.operatingSystems?.map(item => ({
        name: item._id || "Unknown",
        value: item.clicks
    })) || [];

    const deviceData = data.metrics?.devices?.map(item => ({
        name: item._id || "Unknown",
        value: item.clicks
    })) || [];

    const CustomAreaTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-indigo-600 font-bold">
                        {payload[0].value} {payload[0].value === 1 ? 'click' : 'clicks'}
                    </p>
                </div>
            );
        }
        return null;
    };

    // --- Reusable Modern Donut Chart ---
    const renderDonutChart = (title, chartData, Icon) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    <Icon className="text-lg" />
                </div>
                <h3 className="font-bold text-slate-800">{title}</h3>
            </div>
            
            <div className="flex-grow flex items-center justify-center">
                {chartData.length > 0 ? (
                    <div className="w-full h-[220px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={chartData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={55}
                                    outerRadius={80} 
                                    paddingAngle={3}
                                    dataKey="value" 
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#334155', fontWeight: '600' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-slate-400 text-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-2">
                            <span className="text-lg font-serif">?</span>
                        </div>
                        No data yet
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-[85vh] bg-slate-50 font-sans pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                
                {/* Header & Back Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Link 
                                to="/dashboard" 
                                className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg hover:-translate-x-0.5 transition-all duration-200 shadow-sm"
                                title="Back to Dashboard"
                            >
                                <FiArrowLeft className="text-lg" />
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900">Analytics Overview</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-12">
                            Viewing real-time data for <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">/{hash}</span>
                        </p>
                    </div>
                </div>

                {/* Top Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
                            <FiMousePointer />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Clicks</p>
                            <p className="text-4xl font-extrabold text-slate-900">{data.totalClicks}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center text-xl">
                            <FiClock />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Last Visited</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                                {data.lastVisited ? new Date(data.lastVisited).toLocaleString('en-GB', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                }) : 'Never'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Time Series Area Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Clicks Over Time</h3>
                    {timeData.length > 0 ? (
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer>
                                <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        allowDecimals={false} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <RechartsTooltip content={<CustomAreaTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="clicks" 
                                        stroke="#4f46e5" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorClicks)" 
                                        activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-slate-500 font-medium">
                            <p>No click history yet. Share your link to start collecting analytics.</p>
                        </div>
                    )}
                </div>

                {/* Breakdown Donut Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderDonutChart('Top Browsers', browserData, FiGlobe)}
                    {renderDonutChart('Operating Systems', osData, FiMonitor)}
                    {renderDonutChart('Devices', deviceData, FiSmartphone)}
                </div>
            </div>
        </div>
    );
};

export default Analytics;