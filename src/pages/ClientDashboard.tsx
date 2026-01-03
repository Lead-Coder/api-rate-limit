import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Activity, Gauge, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const ClientDashboard = () => {
  const { apiKey } = useAuth();

  const [usageData, setUsageData] = useState({
    requestsUsed: 0,
    rateLimit: 0,
    remainingQuota: 0,
    avgResponseTime: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:8080/client/stats', {
          headers: {
            'X-API-KEY': apiKey
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }
       const data = await res.json();
       setUsageData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, [apiKey]);

  const usagePercentage =
    usageData.rateLimit === 0
      ? 0
      : (usageData.requestsUsed / usageData.rateLimit) * 100;

  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading usage data...</div>;
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">API Usage Dashboard</h1>
        <p className="page-subtitle">Live API usage from database</p>
      </div>

      {isNearLimit && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          isAtLimit
            ? 'bg-destructive/10 border border-destructive/20'
            : 'bg-warning/10 border border-warning/20'
        }`}>
          <AlertTriangle className={isAtLimit ? 'text-destructive' : 'text-warning'} />
          <p className="text-sm">
            {isAtLimit
              ? 'Rate limit is reached, no more requests granted.'
              : 'Approaching rate limit'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Requests Used Today"
          value={usageData.requestsUsed.toLocaleString()}
          icon={<Activity className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Rate Limit / Min"
          value={usageData.rateLimit.toLocaleString()}
          icon={<Gauge className="w-6 h-6" />}
        />
        <StatCard
          title="Remaining Quota"
          value={usageData.remainingQuota.toLocaleString()}
          icon={<TrendingUp className="w-6 h-6" />}
          variant={isNearLimit ? 'warning' : 'success'}
        />
        <StatCard
          title="Avg Response Time"
          value={`${usageData.avgResponseTime} ms`}
          icon={<Clock className="w-6 h-6" />}
          variant="accent"
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="card-title mb-4">Current Usage</h3>

        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${
              isAtLimit
                ? 'bg-destructive'
                : isNearLimit
                  ? 'bg-warning'
                  : 'bg-primary'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-sm text-muted-foreground">
          <span>0</span>
          <span>{usageData.rateLimit} requests</span>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
