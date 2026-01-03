import { useState, useEffect } from 'react';
import {Search,Filter,ChevronLeft,ChevronRight,RefreshCw,X} from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: number; // epoch millis
  apiKey: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ip: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterApiKey, setFilterApiKey] = useState('');
  const [filterEndpoint, setFilterEndpoint] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const logsPerPage = 15;

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:8080/admin/logs');
      const data: LogEntry[] = await res.json();

      // Sort newest first
      data.sort((a, b) => b.timestamp - a.timestamp);

      setLogs(data);
      setFilteredLogs(data);
    } catch {
      toast.error('Failed to load API logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ============================
     Filtering logic
  ============================ */

  useEffect(() => {
    let result = logs;

    if (searchQuery) {
      result = result.filter(log =>
        log.apiKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery)
      );
    }

    if (filterApiKey) {
      result = result.filter(log => log.apiKey === filterApiKey);
    }

    if (filterEndpoint) {
      result = result.filter(log => log.endpoint === filterEndpoint);
    }

    if (filterStatus) {
      result = result.filter(
        log => log.statusCode.toString() === filterStatus
      );
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  }, [logs, searchQuery, filterApiKey, filterEndpoint, filterStatus]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  const uniqueApiKeys = [...new Set(logs.map(l => l.apiKey))];
  const uniqueEndpoints = [...new Set(logs.map(l => l.endpoint))];
  const uniqueStatuses = [...new Set(logs.map(l => l.statusCode))].sort(
    (a, b) => a - b
  );

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300) return 'badge-success';
    if (status >= 400 && status < 500) return 'badge-warning';
    return 'badge-destructive';
  };

  const getMethodClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-success';
      case 'POST':
        return 'text-primary';
      case 'PUT':
        return 'text-warning';
      case 'DELETE':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const clearFilters = () => {
    setFilterApiKey('');
    setFilterEndpoint('');
    setFilterStatus('');
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterApiKey || filterEndpoint || filterStatus || searchQuery;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">API Logs</h1>
          <p className="page-subtitle">API request analytics</p>
        </div>
        <button onClick={fetchLogs} className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            placeholder="Search by API key, endpoint or IP"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filterApiKey}
              onChange={e => setFilterApiKey(e.target.value)}
              className="input-field"
            >
              <option value="">All API Keys</option>
              {uniqueApiKeys.map(k => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <select
              value={filterEndpoint}
              onChange={e => setFilterEndpoint(e.target.value)}
              className="input-field"
            >
              <option value="">All Endpoints</option>
              {uniqueEndpoints.map(e => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status Codes</option>
              {uniqueStatuses.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost text-destructive"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">API Key</th>
              <th className="px-6 py-4 text-left">Method</th>
              <th className="px-6 py-4 text-left">Endpoint</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Response</th>
              <th className="px-6 py-4 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  Loading logs...
                </td>
              </tr>
            ) : paginatedLogs.length > 0 ? (
              paginatedLogs.map(log => (
                <tr key={log.id} className="border-t">
                  <td className="px-6 py-4 text-sm">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {log.apiKey}
                  </td>
                  <td className={`px-6 py-4 ${getMethodClass(log.method)}`}>
                    {log.method}
                  </td>
                  <td className="px-6 py-4">{log.endpoint}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${getStatusBadgeClass(
                        log.statusCode
                      )}`}
                    >
                      {log.statusCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.responseTime} ms
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {log.ip}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="btn-secondary"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
