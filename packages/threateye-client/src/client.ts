import type { ApiResponse, ClientOptions, Device, DeviceRegistration, Threat } from './types';

export class ThreatEyeClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl || 'https://api.threateye.io';
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 30000;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: undefined,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || 'An error occurred',
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Request failed',
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async registerDevice(deviceData: DeviceRegistration): Promise<ApiResponse<Device>> {
    return this.request<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/devices/${deviceId}`);
  }

  async updateDevice(deviceId: string, data: Partial<Device>): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/devices/${deviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getThreats(deviceId: string): Promise<ApiResponse<Threat[]>> {
    return this.request<Threat[]>(`/devices/${deviceId}/threats`);
  }

  async reportThreat(deviceId: string, threat: Omit<Threat, 'id' | 'deviceId' | 'detectedAt' | 'status'>): Promise<ApiResponse<Threat>> {
    return this.request<Threat>(`/devices/${deviceId}/threats`, {
      method: 'POST',
      body: JSON.stringify({
        ...threat,
        deviceId,
        detectedAt: new Date().toISOString(),
        status: 'active',
      }),
    });
  }

  async resolveThreat(deviceId: string, threatId: string): Promise<ApiResponse<Threat>> {
    return this.request<Threat>(`/devices/${deviceId}/threats/${threatId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({
        resolvedAt: new Date().toISOString(),
        status: 'resolved'
      }),
    });
  }

  async ping(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/ping');
  }
} 