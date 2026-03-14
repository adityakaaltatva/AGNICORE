import { useState, useMemo } from 'react';
import { AccessRequest, Decision } from '../types';
import { Search, ChevronUp, ChevronDown, Eye, X } from 'lucide-react';

interface RequestsTableProps {
  requests: AccessRequest[];
}

type SortField = 'riskScore' | 'time' | null;
type SortOrder = 'asc' | 'desc';
type RiskLevel = 'all' | 'low' | 'medium' | 'high';

const getRiskLevel = (score: number): RiskLevel => {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
};

const getRiskColor = (score: number) => {
  const level = getRiskLevel(score);
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
  }
};

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

const getRiskFactors = (score: number, device: string): string[] => {
  const factors: string[] = [];
  if (score > 70) factors.push('High risk score');
  if (device === 'Unknown') factors.push('Unknown device');
  if (score > 50) factors.push('Untrusted activity pattern');
  if (score > 60) factors.push('High request frequency');
  return factors.length > 0 ? factors : ['Normal activity'];
};

export default function RequestsTable({ requests }: RequestsTableProps) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);

  const filteredAndSorted = useMemo(() => {
    let filtered = requests.filter((req) => {
      const matchesSearch =
        req.user.toLowerCase().includes(search.toLowerCase()) ||
        req.ip.toLowerCase().includes(search.toLowerCase()) ||
        req.device.toLowerCase().includes(search.toLowerCase());

      const matchesRisk =
        riskFilter === 'all' || getRiskLevel(req.riskScore) === riskFilter;

      return matchesSearch && matchesRisk;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: number | string;
        let bVal: number | string;

        if (sortField === 'riskScore') {
          aVal = a.riskScore;
          bVal = b.riskScore;
        } else {
          aVal = a.time;
          bVal = b.time;
        }

        if (sortOrder === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [requests, search, riskFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Access Requests</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, IP, or device..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  riskFilter === level
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500 text-sm">No access requests found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => toggleSort('riskScore')}
                >
                  Risk Score <SortIcon field="riskScore" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => toggleSort('time')}
                >
                  Time <SortIcon field="time" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSorted.map((request) => (
                <tr
                  key={request.id}
                  className={`hover:bg-gray-50 transition ${
                    request.riskScore > 70 ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{request.ip}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.device}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(request.riskScore)}`}>
                      {request.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDecisionColor(request.decision)}`}>
                      {request.decision}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.time}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">User</p>
                <p className="text-sm text-gray-900 font-medium">{selectedRequest.user}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">IP Address</p>
                <p className="text-sm text-gray-900 font-mono">{selectedRequest.ip}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Device</p>
                <p className="text-sm text-gray-900">{selectedRequest.device}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Risk Score</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getRiskColor(selectedRequest.riskScore)}`}>
                  {selectedRequest.riskScore}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Decision</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getDecisionColor(selectedRequest.decision)}`}>
                  {selectedRequest.decision}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                <p className="text-sm text-gray-900">{selectedRequest.time}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Risk Factors</p>
                <ul className="space-y-1">
                  {getRiskFactors(selectedRequest.riskScore, selectedRequest.device).map((factor, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
