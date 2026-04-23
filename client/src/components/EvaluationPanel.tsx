import { Activity, ChevronRight } from 'lucide-react';
import { SimulationResult } from '../types';
import { getDecisionMeta, getRiskMeta } from '../lib/ui';

interface EvaluationPanelProps {
  readonly result: SimulationResult | null;
}

const stageToneClasses = {
  neutral: 'border-white/10 bg-white/5 text-slate-200',
  positive: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
  danger: 'border-rose-300/20 bg-rose-400/10 text-rose-100',
};

export default function EvaluationPanel({ result }: EvaluationPanelProps) {
  if (!result) {
    return (
      <div className="glass-panel section-shell flex min-h-[540px] flex-col justify-between">
        <div className="space-y-3">
          <p className="eyebrow">Decision Console</p>
          <h2 className="panel-title text-2xl">Awaiting evaluation</h2>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            Run a simulation to visualize how context, risk, and policy combine into a final
            access verdict.
          </p>
        </div>

        <div className="glass-inset mt-10 rounded-[28px] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-200">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Zero-trust evaluation pipeline</p>
              <p className="text-xs text-slate-400">Context ingestion, risk scoring, policy check</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {['Context enriched', 'Risk score computed', 'Policy verdict emitted'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm text-slate-300"
              >
                <span>{label}</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const decisionMeta = getDecisionMeta(result.decision);
  const riskMeta = getRiskMeta(result.riskScore);
  const DecisionIcon = decisionMeta.icon;
  const ringFill = Math.min(result.riskScore, 100);

  return (
    <div className={`glass-panel-strong section-shell space-y-6 ${decisionMeta.glowClassName}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="eyebrow">Decision Console</p>
          <h2 className="panel-title text-2xl">Evaluation result</h2>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            Each request is assessed through context weighting, behavior scoring, and policy
            enforcement before a trust decision is returned.
          </p>
        </div>
        <div className={`decision-badge ${decisionMeta.badgeClassName}`}>
          <DecisionIcon className="h-4 w-4" />
          {result.decision}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-inset rounded-[26px] p-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Risk score</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-semibold tracking-tight text-white">
                  {result.riskScore}
                </span>
                <span className={`decision-badge ${riskMeta.toneClassName}`}>{riskMeta.label}</span>
              </div>
              <p className="text-sm text-slate-300">{decisionMeta.label}</p>
            </div>

            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${decisionMeta.accentColor} ${ringFill * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className="glass-panel absolute inset-3 rounded-full" />
              <div className="relative text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Decision</p>
                <p className="mt-2 text-lg font-semibold text-white">{result.decision}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-inset rounded-[26px] p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Reason stack</p>
          <div className="mt-4 space-y-3">
            {result.reasons.map((reason) => (
              <div
                key={reason}
                className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-sm text-slate-200"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Evaluation stages</p>
        <div className="grid gap-3">
          {result.stages.map((stage) => (
            <div
              key={stage.id}
              className={`rounded-[22px] border px-4 py-4 ${stageToneClasses[stage.state]}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{stage.label}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-300">{stage.detail}</p>
                </div>
                <span className="text-sm font-semibold">{stage.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
