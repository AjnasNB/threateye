export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface ClientOptions {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  monitorConfig?: MonitorConfig;
}

export interface MonitorConfig {
  deviceId?: string;
  monitoringInterval?: number;
  autoStart?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'server' | 'other';
  os: string;
  ip?: string;
  mac?: string;
  status: 'active' | 'inactive' | 'compromised';
  lastSeen?: string;
  registered?: string;
  metadata?: Record<string, any>;
  organizationId?: string;
  userId?: string;
}

export type DeviceRegistration = Omit<Device, 'id' | 'status' | 'registered'>;

export interface Threat {
  id: string;
  deviceId: string;
  type: string;
  name?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  status: 'active' | 'resolved' | 'false-positive';
  metadata?: Record<string, any>;
  resolvedAt?: string;
  resolution?: string;
}

export type MonitorEvent = 
  | { type: 'registering'; timestamp: Date }
  | { type: 'registered'; device: Device; timestamp: Date }
  | { type: 'starting'; device?: Device; timestamp: Date }
  | { type: 'started'; device?: Device; timestamp: Date }
  | { type: 'stopped'; device?: Device; timestamp: Date }
  | { type: 'scanning'; timestamp: Date }
  | { type: 'scan-complete'; threats: number; timestamp: Date }
  | { type: 'heartbeat'; device: Device; timestamp: Date }
  | { type: 'threats-detected'; device: Device; threats: Threat[]; timestamp: Date }
  | { type: 'threat-detected'; threat: Threat; timestamp: Date }
  | { type: 'threat-reported'; device: Device; threat: Threat; timestamp: Date }
  | { type: 'error'; error: ApiError | Error; message?: string; timestamp: Date }; 