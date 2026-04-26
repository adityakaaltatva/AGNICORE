import { useState, useEffect } from 'react';
import { Check, X, Users, ShieldCheck, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface User {
  id: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await api.get<User[]>('/auth/users');
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Unable to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(userId: string) {
    setActionLoading(userId);
    try {
      await api.post(`/auth/approve/${userId}`, {});
      await fetchUsers();
    } catch (err) {
      console.error('Failed to approve user:', err);
      setError('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(userId: string) {
    setActionLoading(userId);
    try {
      await api.post(`/auth/reject/${userId}`, {});
      await fetchUsers();
    } catch (err) {
      console.error('Failed to reject user:', err);
      setError('Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading user management...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="User Management"
        description="Review and approve pending user registrations."
      >
        <div className="flex gap-4">
          <div className="glass-panel-strong section-shell px-4 py-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-slate-300">Total: {users.length}</span>
            </div>
          </div>
          <div className="glass-panel-strong section-shell px-4 py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-slate-300">Pending: {pendingUsers.length}</span>
            </div>
          </div>
        </div>
      </PageHeader>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Pending Users Section */}
      {pendingUsers.length > 0 && (
        <section className="glass-panel-strong section-shell">
          <div className="mb-6">
            <p className="eyebrow text-amber-400/80">Pending Approval</p>
            <h2 className="panel-title text-2xl">New Registrations</h2>
          </div>
          
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="glass-inset rounded-[22px] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={actionLoading === user.id}
                      className="button-primary !py-2 !px-4 text-sm"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      disabled={actionLoading === user.id}
                      className="button-secondary !py-2 !px-4 text-sm"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Users Section */}
      <section className="glass-panel-strong section-shell">
        <div className="mb-6">
          <p className="eyebrow text-emerald-400/80">Active Users</p>
          <h2 className="panel-title text-2xl">Approved Members</h2>
        </div>
        
        {activeUsers.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No active users yet.</p>
        ) : (
          <div className="space-y-3">
            {activeUsers.map((user) => (
              <div key={user.id} className="glass-inset rounded-[22px] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/20 p-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-500">
                        Role: {user.role} • {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}