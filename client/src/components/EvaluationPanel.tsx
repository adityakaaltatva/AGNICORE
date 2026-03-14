import { Decision } from '../types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface EvaluationResult {
  riskScore: number;
  decision: Decision;
  reasons: string[];
}

interface EvaluationPanelProps {
  result: EvaluationResult;
}

export default function EvaluationPanel({ result }: EvaluationPanelProps) {
  const getDecisionIcon = () => {
    switch (result.decision) {
      case 'ALLOW':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'VERIFY':
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case 'DENY':
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getDecisionColor = () => {
    switch (result.decision) {
      case 'ALLOW':
        return 'text-green-600';
      case 'VERIFY':
        return 'text-yellow-600';
      case 'DENY':
        return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Evaluation Result</h2>

      <div className="flex items-center justify-center py-4">
        {getDecisionIcon()}
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600 text-sm">Risk Score</p>
        <p className="text-4xl font-bold text-gray-900">{result.riskScore}</p>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600 text-sm">Decision</p>
        <p className={`text-3xl font-bold ${getDecisionColor()}`}>{result.decision}</p>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors:</p>
        <ul className="space-y-2">
          {result.reasons.map((reason, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-red-500 mt-1">•</span>
              <span className="text-gray-600">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
