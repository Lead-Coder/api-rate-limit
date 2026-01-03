import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Copy,
  Check,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  apiKey: string;
  clientName: string;
  role: 'ADMIN' | 'CLIENT';
  status: 'ACTIVE' | 'INACTIVE';
  rateLimitPerMinute: number;
  requestsToday: number;
}

/* ============================
   Component
============================ */

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Create form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientRateLimit, setNewClientRateLimit] = useState(1000);

  /* ============================
     Load clients from backend
  ============================ */

  useEffect(() => {
    fetch('http://localhost:8080/admin/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => toast.error('Failed to load clients'));
  }, []);

  /* ============================
     Helpers
  ============================ */

  const filteredClients = clients.filter(client =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.apiKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    toast.success('API key copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /* ============================
     Create client
  ============================ */

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error('Client name is required');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName: newClientName,
          rateLimitPerMinute: newClientRateLimit
        })
      });

      const createdClient: Client = await res.json();
      setClients(prev => [...prev, createdClient]);

      setIsCreateModalOpen(false);
      setNewClientName('');
      setNewClientRateLimit(1000);

      toast.success('Client created successfully');
    } catch {
      toast.error('Failed to create client');
    }
  };

  /* ============================
     UI
  ============================ */

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">API Clients</h1>
          <p className="page-subtitle">Manage API keys and rate limits</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Create Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or API key"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4">Client</th>
              <th className="text-left px-6 py-4">API Key</th>
              <th className="text-left px-6 py-4">Rate Limit</th>
              <th className="text-left px-6 py-4">Role</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Usage Today</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {client.clientName}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded">
                      {client.apiKey.substring(0, 12)}...
                    </code>
                    <button onClick={() => handleCopyKey(client.apiKey)}>
                      {copiedKey === client.apiKey
                        ? <Check className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {client.rateLimitPerMinute} /min
                </td>

                <td className="px-6 py-4">
                  <span className="badge badge-primary">
                    {client.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={`badge ${client.status === 'ACTIVE'
                    ? 'badge-success'
                    : 'badge-destructive'}`}>
                    {client.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {client.requestsToday}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No clients found
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create API Client"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Client Name</label>
            <input
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block mb-2">Rate Limit (per minute)</label>
            <input
              type="number"
              min={1}
              value={newClientRateLimit}
              onChange={e => setNewClientRateLimit(Number(e.target.value))}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateClient}
              className="btn-primary flex-1"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
