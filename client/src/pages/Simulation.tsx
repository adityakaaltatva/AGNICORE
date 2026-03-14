import { useState } from 'react';
import SimulationForm from '../components/SimulationForm';
import EvaluationPanel from '../components/EvaluationPanel';
import { SimulationInput, Decision } from '../types';

export default function Simulation() {
  const [result, setResult] = useState<{
    riskScore: number;
    decision: Decision;
    reasons: string[];
  } | null>(null);

  const handleSimulate = (input: SimulationInput) => {
    let riskScore = 0;
    const reasons: string[] = [];

    if (input.device === 'Unknown') {
      riskScore += 40;
      reasons.push('Unknown Device');
    } else if (input.device === 'Mobile') {
      riskScore += 15;
      reasons.push('Mobile Device');
    }

    if (input.location === 'Unknown') {
      riskScore += 30;
      reasons.push('Unknown Location');
    } else if (input.location === 'External') {
      riskScore += 20;
      reasons.push('External Location');
    }

    if (input.requestFrequency > 70) {
      riskScore += 30;
      reasons.push('High Request Rate');
    } else if (input.requestFrequency > 50) {
      riskScore += 15;
      reasons.push('Elevated Request Rate');
    }

    let decision: Decision;
    if (riskScore > 60) {
      decision = 'DENY';
    } else if (riskScore > 30) {
      decision = 'VERIFY';
    } else {
      decision = 'ALLOW';
      if (reasons.length === 0) {
        reasons.push('All checks passed');
      }
    }

    setResult({ riskScore, decision, reasons });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Access Simulation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimulationForm onSimulate={handleSimulate} />
        {result && <EvaluationPanel result={result} />}
      </div>
    </div>
  );
}
