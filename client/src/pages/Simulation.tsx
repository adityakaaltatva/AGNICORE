import { useState } from 'react';
import { Cpu, Fingerprint, Shield, Waypoints } from 'lucide-react';
import EvaluationPanel from '../components/EvaluationPanel';
import PageHeader from '../components/PageHeader';
import SimulationForm from '../components/SimulationForm';
import { SimulationInput, SimulationResult } from '../types';
import { api } from '../lib/api';

export default function Simulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (input: SimulationInput) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('agnicore_token');
      const response = await api.post<any>('/access/access', {
        token,
        resource: `${input.sensitivity.toLowerCase()} / ${input.action}`,
      });

      const { risk_score: riskScore, decision } = response;
      const reasons = [
        decision === 'DENY' 
          ? 'Combined risk factors from devicePosture and location exceeded safe threshold.' 
          : 'Request evaluation complete. No critical policy violations found.'
      ];

      const stages: SimulationResult['stages'] = [
        {
          id: 'context',
          label: 'Context enrichment',
          value: `${input.device} / ${input.location}`,
          detail: `Requested ${input.action} access against a ${input.sensitivity.toLowerCase()} resource profile.`,
          state: input.location === 'Unknown' ? 'danger' : input.location === 'External' ? 'warning' : 'positive',
        },
        {
          id: 'behavior',
          label: 'Behavior analysis',
          value: `${input.requestFrequency}/100`,
          detail: 'Request frequency is compared to the expected behavioral baseline.',
          state:
            input.requestFrequency > 70
              ? 'danger'
              : input.requestFrequency > 50
                ? 'warning'
                : 'positive',
        },
        {
          id: 'policy',
          label: 'Policy verdict',
          value: decision,
          detail:
            decision === 'DENY'
              ? 'Policy blocks this request because combined risk exceeds the enforcement threshold.'
              : decision === 'VERIFY'
                ? 'Policy requires an extra verification step before access can be granted.'
                : 'Policy allows the request because trust signals remain within acceptable bounds.',
          state: decision === 'DENY' ? 'danger' : decision === 'VERIFY' ? 'warning' : 'positive',
        },
      ];

      setResult({ riskScore, decision, reasons, stages });
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Simulation Lab"
        title="Compose a request and watch the trust engine respond."
        description="This interactive lab mirrors AGNICORE’s methodology so analysts can test how context, device posture, and behavior drift affect the final access decision."
      >
        <div className="flex gap-2">
          {[
            { icon: Fingerprint, label: 'Identity' },
            { icon: Cpu, label: 'Context' },
            { icon: Waypoints, label: 'Risk' },
            { icon: Shield, label: 'Policy' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 sm:flex sm:items-center sm:gap-2"
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            );
          })}
        </div>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SimulationForm onSimulate={handleSimulate} />
        <EvaluationPanel result={result} />
      </div>
    </div>
  );
}
