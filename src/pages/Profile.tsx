import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Key, Shield, Gauge, Calendar, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { apiKey, role } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [usageData, setUsageData] = useState({
    requestsUsed: 0,
    rateLimit: 0,
    remainingQuota: 0,
    avgResponseTime: 0,
  });
  const ratelimit = async () => {
    const res = await fetch('http://localhost:8080/client/stats', {
        headers: {
          'X-API-KEY': apiKey
        }
      });
    const data = await res.json();
    setUsageData(data);
  }
  ratelimit();

  // Mock profile data
  const profileData = {
    clientName: role === 'admin' ? 'Administrator Account' : 'Production Application',
    rateLimit: role === 'admin' ? 2000 : 1000,
    createdAt: '2024-01-15',
    lastUsed: '2 minutes ago',
    totalRequests: 124589,
    status: 'active',
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '•'.repeat(key.length - 8);
  };

  return (
    <div className="page-container max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">View your API key and account details</p>
      </div>

      {/* API Key Card */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">API Key</h2>
              <p className="text-sm text-muted-foreground">Use this key to authenticate your API requests</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <code className="flex-1 text-sm font-mono text-foreground break-all">
              {showKey ? apiKey : maskApiKey(apiKey || '')}
            </code>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowKey(!showKey)}
                className="btn-icon text-muted-foreground hover:text-foreground"
                title={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={handleCopy}
                className="btn-icon text-muted-foreground hover:text-foreground"
                title="Copy API key"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Keep your API key secure. Do not share it publicly or commit it to version control.
        </p>
      </div>

      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Role & Permissions</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="text-lg font-medium text-foreground capitalize">{role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Permissions</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {role === 'admin' ? (
                  <>
                    <span className="badge badge-primary">View Analytics</span>
                    <span className="badge badge-primary">Manage Clients</span>
                    <span className="badge badge-primary">View Logs</span>
                    <span className="badge badge-primary">Full Access</span>
                  </>
                ) : (
                  <>
                    <span className="badge bg-muted text-muted-foreground">View Usage</span>
                    <span className="badge bg-muted text-muted-foreground">API Access</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limit Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Rate Limit</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Limit</p>
              <p className="text-lg font-medium text-foreground">
                {usageData.rateLimit.toLocaleString()} requests/minute
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className="badge badge-success capitalize">{profileData.status}</span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Account Info</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="text-lg font-medium text-foreground">{profileData.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium text-foreground">{profileData.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Usage Stats</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-lg font-medium text-foreground">
                {profileData.totalRequests.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Used</p>
              <p className="font-medium text-foreground">{profileData.lastUsed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-muted/30 rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check out our documentation for guides on using the API, best practices, and troubleshooting.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            API Documentation →
          </a>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Rate Limiting Guide →
          </a>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
