import { securityLogs } from '../data/mockData';
import { Decision } from '../types';

const getDecisionColor = (decision: Decision) => {
  switch (decision) {
    case 'ALLOW':
      return 'bg-green-100 text-green-800';
    case 'VERIFY':
      return 'bg-yellow-100 text-yellow-800';
    case 'DENY':
      return 'bg-red-100 text-red-800';
  }
};

export default function Logs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Security Logs</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.device}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.riskScore}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDecisionColor(log.decision)}`}>
                      {log.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
