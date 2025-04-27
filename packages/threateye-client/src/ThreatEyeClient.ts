import { ThreatEyeConfig, Device } from './types';

export class ThreatEyeClient {
  private config: ThreatEyeConfig;
  private baseUrl: string;

  constructor(config: ThreatEyeConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl.endsWith('/') ? config.apiUrl.slice(0, -1) : config.apiUrl;
  }

  async getDevices(): Promise<Device[]> {
    const response = await this.request('/devices');
    return response.devices;
  }

  async getDevice(id: string): Promise<Device> {
    const response = await this.request(`/devices/${id}`);
    return response.device;
  }

  async registerDevice(name: string, metadata?: Record<string, any>): Promise<Device> {
    const response = await this.request('/devices', {
      method: 'POST',
      body: JSON.stringify({ name, metadata }),
    });
    return response.device;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
} 