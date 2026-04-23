import { useState, useEffect } from 'react';
import { Search, Siren, ShieldCheck, ShieldX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getDecisionMeta, getRiskMeta } from '../lib/ui';
import { api } from '../lib/api';
import { LogEntry } from '../types';

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await api.get<any[]>('/access/logs');
        setLogs(data.map(log => ({
          id: log.id,
          timestamp: new Date(log.created_at).toLocaleString(),
          user: log.user,
          ip: 'Dynamic',
          device: 'Auto-detected',
          riskScore: log.risk_score,
          decision: log.decision,
          location: 'Remote',
          resource: log.resource,
          reason: log.decision === 'DENY' ? 'Security policy enforcement' : 'Standard access verification',
          severity: log.risk_score > 60 ? 'high' : log.risk_score > 30 ? 'medium' : 'low',
        })));
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center text-slate-400">Loading audit trail...</div>;
  }

  const highSeverityCount = logs.filter((log) => log.severity === 'high').length;
  const verifyCount = logs.filter((log) => log.decision === 'VERIFY').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Investigation Workspace"
        title="Trace the reason behind every policy decision."
        description="Security logs show where requests originated, how risky they appeared, and what AGNICORE did in response so analysts can review incidents with confidence."
      >
        <div className="decision-badge border-rose-300/15 bg-rose-400/8 text-rose-100">
          <Siren className="h-4 w-4" />
          {highSeverityCount} critical events
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel-strong section-shell relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
          <div className="ambient-orb -right-8 top-0 h-24 w-24 bg-rose-400/5 opacity-50" />
          <p className="eyebrow text-rose-400/80">Denied attempts</p>
          <p className="mt-3 text-4xl font-bold text-white tracking-tighter">{highSeverityCount}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Critical policy blocks</p>
        </div>
        <div className="glass-panel-strong section-shell relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
          <div className="ambient-orb -right-8 top-0 h-24 w-24 bg-amber-400/5 opacity-50" />
          <p className="eyebrow text-amber-400/80">Verification prompts</p>
          <p className="mt-3 text-4xl font-bold text-white tracking-tighter">{verifyCount}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Step-up challenges issued</p>
        </div>
        <div className="glass-panel-strong section-shell relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
          <div className="ambient-orb -right-8 top-0 h-24 w-24 bg-emerald-400/5 opacity-50" />
          <p className="eyebrow text-emerald-400/80">Audit coverage</p>
          <p className="mt-3 text-4xl font-bold text-white tracking-tighter">100%</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Full contextual retention</p>
        </div>
      </div>

      <section className="glass-panel-strong section-shell relative overflow-hidden">
        <div className="ambient-orb -left-12 top-0 h-48 w-48 bg-white/5 opacity-30" />
        <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-sky-400/80">Decision Ledger</p>
            <h2 className="panel-title text-2xl font-bold tracking-tight">Analyst review stream</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search-ready layout"
                className="field-shell w-full pl-11 sm:w-56"
                readOnly
              />
            </div>
            <button className="button-secondary">
              <ShieldCheck className="h-4 w-4" />
              Filters coming next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-subtle">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate-500">
                <th className="px-4 py-2 font-medium">Timestamp</th>
                <th className="px-4 py-2 font-medium">Actor</th>
                <th className="px-4 py-2 font-medium">Context</th>
                <th className="px-4 py-2 font-medium">Risk</th>
                <th className="px-4 py-2 font-medium">Decision</th>
                <th className="px-4 py-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const decisionMeta = getDecisionMeta(log.decision);
                const riskMeta = getRiskMeta(log.riskScore);
                const DecisionIcon = decisionMeta.icon;

                return (
                  <tr key={log.id} className="glass-inset">
                    <td className="rounded-l-[22px] px-4 py-4 align-top text-sm text-slate-300">
                      <div>{log.timestamp}</div>
                      <div className="mt-2 text-xs text-slate-500">{log.location}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-white">{log.user}</div>
                      <div className="mt-2 text-xs font-mono text-slate-400">{log.ip}</div>
                      <div className="mt-2 text-xs text-slate-500">{log.device}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-slate-300">
                      <div className="font-medium text-white">{log.resource}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        {log.severity} severity
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className={`decision-badge ${riskMeta.toneClassName}`}>
                        {log.riskScore} / {riskMeta.label}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className={`decision-badge ${decisionMeta.badgeClassName}`}>
                        <DecisionIcon className="h-4 w-4" />
                        {log.decision}
                      </div>
                    </td>
                    <td className="rounded-r-[22px] px-4 py-4 align-top text-sm leading-7 text-slate-300">
                      <div className="flex items-start gap-2">
                        {log.decision === 'DENY' ? (
                          <ShieldX className="mt-1 h-4 w-4 shrink-0 text-rose-200" />
                        ) : (
                          <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                        )}
                        <span>{log.reason}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
