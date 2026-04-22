import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Search, X } from 'lucide-react';
import { AccessRequest } from '../types';
import { getDecisionMeta, getRiskMeta } from '../lib/ui';

interface RequestsTableProps {
  readonly requests: AccessRequest[];
}

type SortField = 'riskScore' | 'time' | null;
type SortOrder = 'asc' | 'desc';
type RiskLevel = 'all' | 'low' | 'medium' | 'high';

const riskFilters: RiskLevel[] = ['all', 'low', 'medium', 'high'];

const getRiskLevel = (score: number): Exclude<RiskLevel, 'all'> => {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
};

const getRiskFactors = (request: AccessRequest): string[] => {
  const factors: string[] = [];

  if (request.device === 'Unknown') factors.push('Unknown endpoint posture');
  if (request.location === 'Unknown') factors.push('Location confidence unavailable');
  if (request.action === 'write' || request.action === 'approve') factors.push('Mutation-capable action');
  if (request.riskScore > 60) factors.push('Request exceeded deny threshold');

  return factors.length > 0 ? factors : ['Baseline-aligned behavior'];
};

export default function RequestsTable({ requests }: RequestsTableProps) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);

  const filteredAndSorted = useMemo(() => {
    const filtered = requests.filter((request) => {
      const query = search.toLowerCase();
      const matchesSearch =
        request.user.toLowerCase().includes(query) ||
        request.ip.toLowerCase().includes(query) ||
        request.device.toLowerCase().includes(query) ||
        request.resource.toLowerCase().includes(query);
      const matchesRisk =
        riskFilter === 'all' || getRiskLevel(request.riskScore) === riskFilter;

      return matchesSearch && matchesRisk;
    });

    if (!sortField) {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      const leftValue = sortField === 'riskScore' ? left.riskScore : left.time;
      const rightValue = sortField === 'riskScore' ? right.riskScore : right.time;

      if (sortOrder === 'asc') {
        return leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      }

      return leftValue > rightValue ? -1 : leftValue < rightValue ? 1 : 0;
    });
  }, [requests, search, riskFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortOrder('desc');
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <section className="glass-panel-strong section-shell overflow-hidden">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Recent Requests</p>
          <h2 className="panel-title text-2xl">Live analyst feed</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Search, sort, and inspect requests to understand what pushed each decision toward
            allow, verify, or deny.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[420px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by user, IP, device, or resource"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field-shell w-full pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {riskFilters.map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  riskFilter === level
                    ? 'bg-white/14 text-white'
                    : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-subtle">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate-500">
              <th className="px-4 py-2 font-medium">Identity</th>
              <th className="px-4 py-2 font-medium">Resource</th>
              <th className="px-4 py-2 font-medium">Context</th>
              <th className="px-4 py-2 font-medium">
                <button
                  onClick={() => toggleSort('riskScore')}
                  className="flex items-center gap-1 text-left"
                >
                  Risk
                  {renderSortIcon('riskScore')}
                </button>
              </th>
              <th className="px-4 py-2 font-medium">Decision</th>
              <th className="px-4 py-2 font-medium">
                <button
                  onClick={() => toggleSort('time')}
                  className="flex items-center gap-1 text-left"
                >
                  Time
                  {renderSortIcon('time')}
                </button>
              </th>
              <th className="px-4 py-2 font-medium">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((request) => {
              const riskMeta = getRiskMeta(request.riskScore);
              const decisionMeta = getDecisionMeta(request.decision);
              const DecisionIcon = decisionMeta.icon;

              return (
                <tr key={request.id} className="glass-inset">
                  <td className="rounded-l-[22px] px-4 py-4 align-top">
                    <div className="text-sm font-medium text-white">{request.user}</div>
                    <div className="mt-2 text-xs font-mono text-slate-400">{request.ip}</div>
                    <div className="mt-2 text-xs text-slate-500">{request.trustLabel}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-slate-300">
                    <div className="font-medium text-white">{request.resource}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      {request.action}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-slate-300">
                    <div>{request.device}</div>
                    <div className="mt-2 text-xs text-slate-500">{request.location}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className={`decision-badge ${riskMeta.toneClassName}`}>
                      {request.riskScore} / {riskMeta.label}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className={`decision-badge ${decisionMeta.badgeClassName}`}>
                      <DecisionIcon className="h-4 w-4" />
                      {request.decision}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-slate-300">{request.time}</td>
                  <td className="rounded-r-[22px] px-4 py-4 align-top">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="mt-4 rounded-[22px] border border-white/8 bg-black/10 px-4 py-8 text-center text-sm text-slate-400">
          No requests matched the current search and filter state.
        </div>
      ) : null}

      {selectedRequest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md">
          <div className="glass-panel-strong w-full max-w-2xl rounded-[30px] p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Request Detail</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {selectedRequest.user}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Detailed context behind the selected access decision.
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="button-secondary !rounded-full !p-3"
                aria-label="Close detail modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Identity</p>
                <p className="mt-3 text-lg font-semibold text-white">{selectedRequest.user}</p>
                <p className="mt-2 text-sm font-mono text-slate-400">{selectedRequest.ip}</p>
                <p className="mt-2 text-sm text-slate-300">{selectedRequest.trustLabel}</p>
              </div>
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Request shape</p>
                <p className="mt-3 text-lg font-semibold text-white">{selectedRequest.resource}</p>
                <p className="mt-2 text-sm text-slate-300">
                  {selectedRequest.action} from {selectedRequest.location}
                </p>
                <p className="mt-2 text-sm text-slate-400">{selectedRequest.device}</p>
              </div>
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Risk snapshot</p>
                <div className={`mt-3 decision-badge ${getRiskMeta(selectedRequest.riskScore).toneClassName}`}>
                  {selectedRequest.riskScore} / {getRiskMeta(selectedRequest.riskScore).label}
                </div>
                <p className="mt-3 text-sm text-slate-300">Observed at {selectedRequest.time}</p>
              </div>
              <div className="glass-inset rounded-[24px] p-4">
                <p className="eyebrow">Decision</p>
                <div
                  className={`mt-3 decision-badge ${getDecisionMeta(selectedRequest.decision).badgeClassName}`}
                >
                  {selectedRequest.decision}
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Severity tagged as {selectedRequest.severity}.
                </p>
              </div>
            </div>

            <div className="mt-4 glass-inset rounded-[24px] p-4">
              <p className="eyebrow">Primary factors</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {getRiskFactors(selectedRequest).map((factor) => (
                  <span
                    key={factor}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-200"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
