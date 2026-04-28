import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import RequestsTable from '../components/RequestsTable';
import { api } from '../lib/api';
import { DashboardMetrics, AccessRequest, Decision } from '../types';

interface LogResponse {
  id: string;
  user: string;
  risk_score: number;
  decision: string;
  created_at: string;
  resource: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsData, logsData] = await Promise.all([
          api.get<DashboardMetrics>('/access/metrics'),
          api.get<LogResponse[]>('/access/logs'),
        ]);
        
        setMetrics(metricsData);
        setRequests(logsData.map(log => {
          const getSeverity = (score: number) => {
            return score > 60 ? 'high' : score > 30 ? 'medium' : 'low';
          };
          return {
            id: log.id,
            user: log.user,
            ip: 'Dynamic',
            device: 'Dynamic',
            riskScore: log.risk_score,
            decision: log.decision as Decision,
            time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            resource: log.resource,
            action: 'access',
            location: 'Remote',
            severity: getSeverity(log.risk_score),
            trustLabel: log.decision === 'DENY' ? 'Security Violation' : 'Verified Access',
          };
        }));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unable to reach Trust Engine. Please check if the backend is active.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-sky-400" />
          <p className="eyebrow animate-pulse">Syncing with Trust Engine...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="glass-panel p-10 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sync Error</h2>
          <p className="text-slate-400 mb-6">{error || 'Metrics unavailable'}</p>
          <button 
            onClick={() => globalThis.location.reload()}
            className="button-primary px-8"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4">
      <PageHeader
        eyebrow="System Overview"
        title="Environment Posture"
        description="Real-time access intelligence and threat surface monitoring."
      >
        <div className="glass-panel px-5 py-3 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-emerald-100/90 tracking-wide uppercase">Live Stream Active</span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Risk Level"
          value={`${metrics.riskScore}%`}
          subtitle="Aggregate threat score"
          icon={AlertTriangle}
          tone="danger"
        />
        <MetricCard
          title="Latest Verdict"
          value={metrics.decision}
          subtitle="Policy engine response"
          icon={ShieldAlert}
          tone="warning"
        />
        <MetricCard
          title="Daily Traffic"
          value={metrics.requestsToday}
          subtitle="Monitored requests"
          icon={Activity}
          tone="info"
        />
        <MetricCard
          title="Integrity Index"
          value={metrics.threatIndex}
          subtitle="Posture stability"
          icon={ShieldCheck}
          tone="success"
        />
      </div>

      <div className="pt-4">
        <RequestsTable requests={requests} />
      </div>
    </div>
  );
}
