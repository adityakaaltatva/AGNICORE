import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import RequestsTable from '../components/RequestsTable';
import { getDecisionMeta, getRiskMeta } from '../lib/ui';
import { api } from '../lib/api';
import { DashboardMetrics, AccessRequest } from '../types';

const methodologySteps = [
  {
    title: 'Context enrichment',
    description: 'Map user, device, location, and request sensitivity before scoring begins.',
  },
  {
    title: 'Risk scoring',
    description: 'Weight trust signals and behavior drift to estimate request exposure.',
  },
  {
    title: 'Policy evaluation',
    description: 'Apply allow, verify, or deny rules against the computed request profile.',
  },
  {
    title: 'Decision telemetry',
    description: 'Stream explainable verdicts and analyst-facing logs for follow-up action.',
  },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsData, logsData] = await Promise.all([
          api.get<DashboardMetrics>('/access/metrics'),
          api.get<any[]>('/access/logs'),
        ]);
        
        setMetrics(metricsData);
        // Map backend LogEntry to frontend AccessRequest
        setRequests(logsData.map(log => ({
          id: log.id,
          user: log.user,
          ip: 'Dynamic', // Backend doesn't store IP yet
          device: 'Dynamic',
          riskScore: log.risk_score,
          decision: log.decision,
          time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          resource: log.resource,
          action: 'access',
          location: 'Remote',
          severity: log.risk_score > 60 ? 'high' : log.risk_score > 30 ? 'medium' : 'low',
          trustLabel: log.decision === 'DENY' ? 'Security Violation' : 'Verified Access',
        })));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return <div className="flex h-96 items-center justify-center text-slate-400">Initializing command center...</div>;
  }

  const decisionMeta = getDecisionMeta(metrics.decision as any);
  const riskMeta = getRiskMeta(metrics.riskScore);
  const DecisionIcon = decisionMeta.icon;

  return (
    <div className="space-y-6">

      <PageHeader
        eyebrow="Trust Posture"
        title="Live access intelligence for every trust decision."
        description="AGNICORE monitors request pressure, highlights suspicious posture drift, and keeps operators close to the context behind each access verdict."
      >
        <div className="decision-badge border-emerald-300/15 bg-emerald-400/8 text-emerald-100">
          <span className="signal-dot bg-emerald-300 shadow-[0_0_16px_rgba(83,214,141,0.75)]" />
          Monitoring live traffic
        </div>
      </PageHeader>

      <section className="glass-panel-strong section-shell bg-mesh relative overflow-hidden">
        <div className="ambient-orb -right-10 top-0 h-40 w-40 bg-rose-400/15" />
        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="eyebrow">Command Overview</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">
                Zero-trust posture is currently elevated by privileged request attempts.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                The current environment is healthy, but AGNICORE is observing high-risk access
                intent against sensitive resources and enforcing stronger controls in response.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Threat index</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metrics.threat_index}</p>
                <p className="mt-2 text-sm text-slate-300">Week-over-week alert pressure</p>
              </div>
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Trust coverage</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metrics.trust_coverage}</p>
                <p className="mt-2 text-sm text-slate-300">Managed endpoints under policy watch</p>
              </div>
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Verification queue</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {metrics.verification_queue}
                </p>
                <p className="mt-2 text-sm text-slate-300">Requests waiting for step-up proof</p>
              </div>
            </div>
          </div>

          <div className="glass-inset rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Latest verdict</p>
                <p className="mt-2 text-xl font-semibold text-white">{decisionMeta.label}</p>
              </div>
              <div className={`rounded-[22px] p-4 ${decisionMeta.badgeClassName}`}>
                <DecisionIcon className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Risk score</span>
                  <span>{metrics.risk_score}/100</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${riskMeta.meterClassName}`}
                    style={{ width: `${metrics.risk_score}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Operator note</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Suspicious activity is clustered around privileged write attempts from unknown
                  devices and weak location confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current risk"
          value={metrics.risk_score}
          subtitle="Elevated privileged activity"
          icon={AlertTriangle}
          tone="danger"
        />
        <MetricCard
          title="Decision state"
          value={metrics.decision}
          subtitle="Latest request verdict"
          icon={ShieldAlert}
          tone="warning"
        />
        <MetricCard
          title="Requests today"
          value={metrics.requests_today}
          subtitle="Monitored access attempts"
          icon={Activity}
          tone="info"
        />
        <MetricCard
          title="Blocked requests"
          value={metrics.blocked_requests}
          subtitle="Denied by policy engine"
          icon={ShieldCheck}
          tone="success"
        />
      </div>

      <section className="glass-panel section-shell">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Methodology Strip</p>
            <h2 className="panel-title text-2xl">How AGNICORE evaluates access</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
            <Waypoints className="h-4 w-4" />
            Context to verdict pipeline
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {methodologySteps.map((step) => (
            <div key={step.title} className="glass-inset rounded-[24px] p-4">
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                Active stage
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <RequestsTable requests={requests} />
    </div>
  );
}
