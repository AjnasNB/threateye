import React, { useEffect, useState } from 'react';
import { ThreatEyeClient } from './client';
import { ThreatEyeMonitor } from './monitor';
import type { MonitorEvent, Threat } from './types';

export interface SystemMonitorProps {
  userId: string;
  deviceId: string;
  organizationId: string;
  apiKey: string;
  baseUrl?: string;
  monitoringInterval?: number;
  captureScreenshots?: boolean;
  captureAudio?: boolean;
  captureSystemInfo?: boolean;
  onThreatDetected?: (threat: Threat) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: 'starting' | 'started' | 'stopped') => void;
  disabled?: boolean;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({
  userId,
  deviceId,
  organizationId,
  apiKey,
  baseUrl = 'https://api.threateye.io',
  monitoringInterval = 60000,
  captureScreenshots = false,
  captureAudio = false,
  captureSystemInfo = true,
  onThreatDetected,
  onError,
  onStatusChange,
  disabled = false,
}) => {
  const [monitor, setMonitor] = useState<ThreatEyeMonitor | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'active' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    // Create and configure monitor
    const client = new ThreatEyeClient({
      baseUrl,
      apiKey,
      monitorConfig: {
        deviceId,
        monitoringInterval,
        autoStart: !disabled,
      }
    });

    const newMonitor = new ThreatEyeMonitor(client, {
      deviceId,
      monitoringInterval,
      autoStart: false,
    });

    // Event handling
    const handleEvent = (event: MonitorEvent) => {
      // Add timestamp to all events
      const timestamp = new Date();
      
      switch (event.type) {
        case 'starting':
          setStatus('starting');
          onStatusChange?.('starting');
          break;
        case 'started':
          setStatus('active');
          onStatusChange?.('started');
          break;
        case 'stopped':
          setStatus('idle');
          onStatusChange?.('stopped');
          break;
        case 'threat-detected':
          if (event.threat) {
            setThreats(prev => [...prev, event.threat]);
            onThreatDetected?.(event.threat);
          }
          break;
        case 'threats-detected':
          if (event.threats) {
            setThreats(prev => [...prev, ...event.threats]);
            event.threats.forEach(threat => {
              onThreatDetected?.(threat);
            });
          }
          break;
        case 'error':
          const errorObj = new Error(event.message || 'Unknown error');
          setError(errorObj);
          setStatus('error');
          onError?.(errorObj);
          break;
      }
    };

    newMonitor.on(handleEvent);
    setMonitor(newMonitor);

    // Start monitoring if not disabled
    if (!disabled) {
      newMonitor.start().catch(err => {
        setError(err);
        setStatus('error');
        onError?.(err);
      });
    }

    // Cleanup
    return () => {
      if (newMonitor) {
        newMonitor.off(handleEvent);
        newMonitor.stop();
      }
    };
  }, [
    apiKey, 
    baseUrl, 
    deviceId, 
    disabled, 
    monitoringInterval, 
    onError, 
    onStatusChange, 
    onThreatDetected,
    organizationId, 
    userId
  ]);

  // Update monitoring status when disabled prop changes
  useEffect(() => {
    if (monitor) {
      if (disabled && monitor.isMonitoring()) {
        monitor.stop();
      } else if (!disabled && !monitor.isMonitoring()) {
        monitor.start().catch(err => {
          setError(err);
          setStatus('error');
          onError?.(err);
        });
      }
    }
  }, [disabled, monitor, onError]);

  // This is a headless component that doesn't render anything
  return null;
}; 