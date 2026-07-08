import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLinkAnalytics } from '../services/analyticService'; 
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend 
} from 'recharts';

const Analytics = () => {
    const { hash } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getLinkAnalytics(hash);
                setData(response.data); 
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analytics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [hash]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '10vh', fontFamily: 'sans-serif' }}>Loading analytics...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '10vh', fontFamily: 'sans-serif' }}>{error}</div>;
    if (!data) return null;

    // --- Safe Data Mapping with Defensive Fallbacks ---
    const timeData = data.metrics?.dailyClicks?.map(item => ({
        date: item._id, 
        clicks: item.clicks
    })) || [];

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

    // --- Clean Percentage Labels ---
    const renderCustomizedLabel = ({ name, percent }) => {
        return `${name} (${(percent * 100).toFixed(0)}%)`;
    };

    // --- Reusable Pie Chart Component ---
    const renderPieChart = (title, chartData) => (
        <div style={{ flex: '1 1 300px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>{title}</h3>
            {chartData.length > 0 ? (
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie 
                                data={chartData} 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={80} 
                                fill="#8884d8" 
                                dataKey="value" 
                                label={renderCustomizedLabel}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p style={{ color: '#666', textAlign: 'center' }}>No data available.</p>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '5vh auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Analytics for <span style={{ color: '#007bff' }}>/{hash}</span></h2>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#666', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px' }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '1rem' }}>Total Clicks</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{data.totalClicks}</p>
                </div>
                <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '1rem' }}>Last Visited</h3>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', paddingTop: '10px' }}>
                        {data.lastVisited ? new Date(data.lastVisited).toLocaleString() : 'Never'}
                    </p>
                </div>
            </div>

            {/* Time Series Area Chart */}
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Clicks Over Time</h3>
                {timeData.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="clicks" stroke="#007bff" fill="#cce5ff" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ color: '#666' }}>Not enough data to show trend.</p>
                )}
            </div>

            {/* Breakdown Pie Charts */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {renderPieChart('Top Browsers', browserData)}
                {renderPieChart('Operating Systems', osData)}
                {renderPieChart('Devices', deviceData)}
            </div>
        </div>
    );
};

export default Analytics;