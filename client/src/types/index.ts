export type Decision = 'ALLOW' | 'VERIFY' | 'DENY';

export interface AccessRequest {
  id: string;
  user: string;
  ip: string;
  device: string;
  riskScore: number;
  decision: Decision;
  time: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  ip: string;
  device: string;
  riskScore: number;
  decision: Decision;
}

export interface DashboardMetrics {
  riskScore: number;
  decision: Decision;
  requestsToday: number;
  blockedRequests: number;
}

export interface SimulationInput {
  device: string;
  location: string;
  requestFrequency: number;
}
