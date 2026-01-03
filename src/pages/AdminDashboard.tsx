import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { Activity, Users, ShieldOff, Key, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data - replace with actual API calls
const mockStats = {
  totalRequests: 1247893,
  requestsPerMinute: 856,
  blockedRequests: 1234,
  activeApiKeys: 47,
};

const mockTimelineData = [
  { time: '00:00', requests: 4200 },
  { time: '02:00', requests: 3100 },
  { time: '04:00', requests: 2400 },
  { time: '06:00', requests: 2800 },
  { time: '08:00', requests: 5600 },
  { time: '10:00', requests: 8900 },
  { time: '12:00', requests: 9200 },
  { time: '14:00', requests: 8700 },
  { time: '16:00', requests: 9800 },
  { time: '18:00', requests: 7600 },
  { time: '20:00', requests: 5400 },
  { time: '22:00', requests: 4800 },
];

const mockStatusData = [
  { name: '200 OK', value: 85, color: 'hsl(var(--success))' },
  { name: '429 Rate Limited', value: 8, color: 'hsl(var(--warning))' },
  { name: '500 Error', value: 4, color: 'hsl(var(--destructive))' },
  { name: '401/403', value: 3, color: 'hsl(var(--muted-foreground))' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [timelineData, setTimelineData] = useState(mockTimelineData);
  const [statusData, setStatusData] = useState(mockStatusData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockStats);
      setTimelineData(mockTimelineData);
      setStatusData(mockStatusData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Monitor your API gateway performance and usage</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total API Requests"
          value={formatNumber(stats.totalRequests)}
          icon={<Activity className="w-6 h-6" />}
          trend={12.5}
          variant="primary"
        />
        <StatCard
          title="Requests/Minute"
          value={formatNumber(stats.requestsPerMinute)}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={8.2}
          variant="accent"
        />
        <StatCard
          title="Blocked Requests"
          value={formatNumber(stats.blockedRequests)}
          icon={<ShieldOff className="w-6 h-6" />}
          trend={-3.4}
          variant="destructive"
        />
        <StatCard
          title="Active API Keys"
          value={stats.activeApiKeys}
          icon={<Key className="w-6 h-6" />}
          trend={5}
          variant="success"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Request Volume */}
        <div className="lg:col-span-2 chart-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="card-title">Request Volume</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
            <select className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border-none focus:ring-2 focus:ring-primary">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  fill="url(#colorRequests)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Status Codes */}
        <div className="chart-container">
          <div className="mb-6">
            <h3 className="card-title">Status Codes</h3>
            <p className="text-sm text-muted-foreground">Distribution</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 chart-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="card-title">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest API requests</p>
          </div>
          <a href="/admin/logs" className="text-sm text-primary hover:underline font-medium">
            View all logs →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">API Key</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Endpoint</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '2 mins ago', key: 'api_k***9x2', endpoint: '/api/users', status: 200 },
                { time: '5 mins ago', key: 'api_m***4f7', endpoint: '/api/orders', status: 200 },
                { time: '7 mins ago', key: 'api_p***1a3', endpoint: '/api/products', status: 429 },
                { time: '12 mins ago', key: 'api_k***9x2', endpoint: '/api/auth', status: 401 },
                { time: '15 mins ago', key: 'api_j***8n5', endpoint: '/api/analytics', status: 200 },
              ].map((log, index) => (
                <tr key={index} className="table-row">
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.time}</td>
                  <td className="py-3 px-4 text-sm font-mono text-foreground">{log.key}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{log.endpoint}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      log.status === 200 ? 'badge-success' :
                      log.status === 429 ? 'badge-warning' :
                      'badge-destructive'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
