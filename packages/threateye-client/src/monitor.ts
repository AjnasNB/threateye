import { EventEmitter } from 'events';
import { ThreatEyeClient } from './client';
import type { Device, MonitorConfig, MonitorEvent, Threat } from './types';

export class ThreatEyeMonitor {
  private client: ThreatEyeClient;
  private config: MonitorConfig;
  private intervalId?: NodeJS.Timeout;
  private device?: Device;
  private isRunning = false;
  private eventHandlers: ((event: MonitorEvent) => void)[] = [];
  
  /**
   * Creates a new instance of the ThreatEye monitoring client
   */
  constructor(client: ThreatEyeClient, config: MonitorConfig = {}) {
    this.client = client;
    this.config = {
      monitoringInterval: config.monitoringInterval || 60000, // Default to 1 minute
      autoStart: config.autoStart ?? false,
      deviceId: config.deviceId
    };
    
    // Auto-start monitoring if configured and deviceId is provided
    if (this.config.autoStart && this.config.deviceId) {
      this.start();
    }
  }
  
  /**
   * Registers a device with the ThreatEye service
   */
  async registerDevice(deviceInfo: Omit<Device, 'id' | 'status' | 'lastSeen' | 'registered'>): Promise<Device | null> {
    try {
      this.emitEvent({ 
        type: 'registering', 
        timestamp: new Date()
      });
      
      const response = await this.client.registerDevice({
        ...deviceInfo,
        lastSeen: new Date().toISOString()
      });

      if (response.success && response.data) {
        this.device = response.data;
        this.config.deviceId = this.device.id;
        
        this.emitEvent({ 
          type: 'registered', 
          device: this.device,
          timestamp: new Date()
        });
        
        return this.device;
      } else {
        this.emitEvent({ 
          type: 'error', 
          error: response.error || { code: 'UNKNOWN', message: 'Device registration failed' },
          timestamp: new Date()
        });
        return null;
      }
    } catch (error) {
      this.emitEvent({ 
        type: 'error', 
        error: { 
          code: 'REGISTRATION_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error during registration' 
        },
        timestamp: new Date()
      });
      return null;
    }
  }
  
  /**
   * Starts the monitoring process
   */
  async start(): Promise<boolean> {
    if (this.isRunning) {
      return true;
    }
    
    if (!this.device && this.config.deviceId) {
      // Try to fetch the device information
      try {
        const response = await this.client.getDevice(this.config.deviceId);
        if (response.success && response.data) {
          this.device = response.data;
        } else {
          this.emitEvent({
            type: 'error',
            error: response.error || { code: 'DEVICE_NOT_FOUND', message: 'Device not found' },
            timestamp: new Date()
          });
          return false;
        }
      } catch (error) {
        this.emitEvent({ 
          type: 'error', 
          error: { 
            code: 'DEVICE_FETCH_ERROR', 
            message: error instanceof Error ? error.message : 'Failed to fetch device information' 
          },
          timestamp: new Date()
        });
        return false;
      }
    }
    
    if (!this.device) {
      this.emitEvent({ 
        type: 'error', 
        error: { 
          code: 'NO_DEVICE', 
          message: 'Cannot start monitoring without a registered device' 
        },
        timestamp: new Date()
      });
      return false;
    }
    
    // Start monitoring
    this.isRunning = true;
    this.emitEvent({
      type: 'starting',
      device: this.device,
      timestamp: new Date()
    });
    
    // Set up the monitoring interval
    const interval = this.config.monitoringInterval || 60000; // Default to 1 minute
    this.intervalId = setInterval(() => this.checkSystem(), interval);
    
    // Run an initial check
    await this.checkSystem();
    
    this.emitEvent({
      type: 'started',
      device: this.device,
      timestamp: new Date()
    });
    
    return true;
  }
  
  /**
   * Stops the monitoring process
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    this.isRunning = false;
    this.emitEvent({
      type: 'stopped',
      device: this.device,
      timestamp: new Date()
    });
  }
  
  /**
   * Checks for threats and emits events
   */
  private async checkSystem(): Promise<void> {
    if (!this.device) {
      return;
    }
    
    try {
      this.emitEvent({ 
        type: 'scanning',
        timestamp: new Date()
      });
      
      // Update device status
      const deviceResponse = await this.client.updateDevice(this.device.id, {
        status: 'active',
        lastSeen: new Date().toISOString()
      });
      
      if (deviceResponse.success && deviceResponse.data) {
        this.device = deviceResponse.data;
      }
      
      // Check for threats
      const threatResponse = await this.client.getThreats(this.device.id);
      
      if (threatResponse.success && threatResponse.data) {
        const threats = threatResponse.data;
        const activeThreats = threats.filter(threat => threat.status === 'active');
        
        if (activeThreats.length > 0) {
          this.emitEvent({
            type: 'threats-detected',
            device: this.device,
            threats: activeThreats,
            timestamp: new Date()
          });
          
          // Emit individual threat events
          for (const threat of activeThreats) {
            this.emitEvent({
              type: 'threat-detected',
              threat,
              timestamp: new Date()
            });
          }
        }
        
        this.emitEvent({ 
          type: 'scan-complete', 
          threats: threats.length,
          timestamp: new Date()
        });
      } else {
        this.emitEvent({
          type: 'error',
          error: threatResponse.error || { code: 'THREAT_FETCH_ERROR', message: 'Failed to fetch threats' },
          message: threatResponse.error?.message || 'Failed to check for threats',
          timestamp: new Date()
        });
      }
    } catch (error) {
      this.emitEvent({ 
        type: 'error', 
        error: { 
          code: 'CHECK_ERROR', 
          message: error instanceof Error ? error.message : 'Error during system check' 
        },
        timestamp: new Date()
      });
    }
  }
  
  /**
   * Reports a threat to the ThreatEye service
   */
  async reportThreat(threat: Omit<Threat, 'id' | 'deviceId' | 'detectedAt' | 'status'>): Promise<Threat | null> {
    if (!this.device) {
      this.emitEvent({
        type: 'error',
        error: { code: 'NO_DEVICE', message: 'No device registered. Call registerDevice() first.' },
        timestamp: new Date()
      });
      return null;
    }
    
    try {
      const response = await this.client.reportThreat(this.device.id, threat);
      
      if (response.success && response.data) {
        this.emitEvent({
          type: 'threat-reported',
          device: this.device,
          threat: response.data,
          timestamp: new Date()
        });
        
        return response.data;
      } else {
        this.emitEvent({
          type: 'error',
          error: response.error || { code: 'REPORT_THREAT_ERROR', message: 'Failed to report threat' },
          message: response.error?.message || 'Failed to report threat',
          timestamp: new Date()
        });
        
        return null;
      }
    } catch (error) {
      this.emitEvent({
        type: 'error',
        error: { 
          code: 'REPORT_THREAT_ERROR', 
          message: error instanceof Error ? error.message : 'Error reporting threat'
        },
        timestamp: new Date()
      });
      
      return null;
    }
  }
  
  /**
   * Gets the current registered device
   */
  getDevice(): Device | undefined {
    return this.device;
  }
  
  /**
   * Returns the monitoring status
   */
  isMonitoring(): boolean {
    return this.isRunning;
  }

  /**
   * Add an event handler
   */
  on(handler: (event: MonitorEvent) => void): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Remove an event handler
   */
  off(handler: (event: MonitorEvent) => void): void {
    this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
  }

  /**
   * Emit an event to all registered handlers
   */
  private emitEvent(event: MonitorEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    }
  }
} 