import { AlertTriangle, CheckCircle, Activity, ShieldAlert } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import RequestsTable from '../components/RequestsTable';
import { dashboardMetrics, recentRequests } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Risk Score"
          value={dashboardMetrics.riskScore}
          icon={AlertTriangle}
          color="text-orange-600"
        />
        <MetricCard
          title="Access Decision"
          value={dashboardMetrics.decision}
          icon={ShieldAlert}
          color="text-red-600"
        />
        <MetricCard
          title="Requests Today"
          value={dashboardMetrics.requestsToday}
          icon={Activity}
          color="text-blue-600"
        />
        <MetricCard
          title="Blocked Requests"
          value={dashboardMetrics.blockedRequests}
          icon={CheckCircle}
          color="text-green-600"
        />
      </div>

      <RequestsTable requests={recentRequests} />
    </div>
  );
}
