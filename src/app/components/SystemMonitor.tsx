"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface SystemMonitorProps {
  userId: string;
  deviceId: string;
  organizationId: string;
  apiKey: string;
  monitoringInterval?: number; // in milliseconds
  captureScreenshots?: boolean;
  captureAudio?: boolean;
  captureSystemInfo?: boolean;
}

interface SystemInfo {
  osVersion: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  ipAddress: string;
  runningProcesses: string[];
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  batteryLevel?: number;
  networkConnections: number;
}

/**
 * SystemMonitor component that can be embedded in client applications
 * to monitor and detect threats in real-time
 */
export default function SystemMonitor({
  userId,
  deviceId,
  organizationId,
  apiKey,
  monitoringInterval = 30000,
  captureScreenshots = true,
  captureAudio = true,
  captureSystemInfo = true
}: SystemMonitorProps) {
  const [isActive, setIsActive] = useState(true);
  const [lastReport, setLastReport] = useState<Date | null>(null);
  const [detectedIssues, setDetectedIssues] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Mock function to get system information
  const getSystemInfo = (): SystemInfo => {
    // In a real implementation, this would use actual system APIs
    return {
      osVersion: navigator.platform,
      browser: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ipAddress: '192.168.1.100', // Would be determined on server side
      runningProcesses: ['chrome.exe', 'explorer.exe', 'system32.exe'],
      memoryUsage: Math.random() * 80,
      cpuUsage: Math.random() * 60,
      diskUsage: Math.random() * 70,
      batteryLevel: navigator.getBattery ? Math.random() * 100 : undefined,
      networkConnections: Math.floor(Math.random() * 10)
    };
  };

  // Mock function to capture screenshot
  const captureScreenshot = async (): Promise<string> => {
    // In a real implementation, this would use ScreenPipe or similar
    // This is just a placeholder for demonstration
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  };

  // Mock function to capture audio
  const captureAudio = async (): Promise<string> => {
    // In a real implementation, this would record and transcribe audio
    return "User talking about project planning. No suspicious keywords detected.";
  };

  // Function to establish WebSocket connection
  const connectWebSocket = () => {
    setConnectionStatus('connecting');
    
    // In production, use a secure WebSocket connection
    const ws = new WebSocket(`ws://${window.location.host}/api/monitor`);
    
    ws.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connection established');
      
      // Send authentication
      ws.send(JSON.stringify({
        type: 'auth',
        data: {
          apiKey,
          deviceId,
          userId,
          organizationId
        }
      }));
    };
    
    ws.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket connection closed');
      
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'command') {
          handleRemoteCommand(message.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    setSocket(ws);
    
    return ws;
  };

  // Handle commands from admin
  const handleRemoteCommand = (command: any) => {
    switch (command.action) {
      case 'stopMonitoring':
        setIsActive(false);
        break;
      case 'startMonitoring':
        setIsActive(true);
        break;
      case 'captureScreenshot':
        captureScreenshot().then(image => {
          sendData({ type: 'screenshotResponse', data: { image, requestId: command.requestId } });
        });
        break;
      case 'updateSettings':
        // Update monitoring settings
        break;
      case 'getSystemInfo':
        const systemInfo = getSystemInfo();
        sendData({ type: 'systemInfoResponse', data: { systemInfo, requestId: command.requestId } });
        break;
      default:
        console.warn('Unknown command:', command.action);
    }
  };

  // Function to send data to the server
  const sendData = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, data not sent:', data);
      if (connectionStatus !== 'connecting') {
        connectWebSocket();
      }
    }
  };

  // Process that runs on the monitoring interval
  const runMonitoring = async () => {
    if (!isActive) return;
    
    try {
      const data: any = {
        type: 'monitoring',
        timestamp: new Date().toISOString(),
        deviceId,
        userId,
        organizationId,
        data: {}
      };
      
      // Collect system info
      if (captureSystemInfo) {
        data.data.systemInfo = getSystemInfo();
      }
      
      // Capture screenshot
      if (captureScreenshots) {
        data.data.screenshot = await captureScreenshot();
      }
      
      // Capture audio
      if (captureAudio) {
        data.data.audioTranscript = await captureAudio();
      }
      
      // Send data to the server
      sendData(data);
      
      setLastReport(new Date());
      
      // Check for suspicious activity using local detection
      const mockDetection = checkForSuspiciousActivity(data);
      if (mockDetection) {
        setDetectedIssues(prev => [...prev, mockDetection]);
      }
    } catch (error) {
      console.error('Error in monitoring process:', error);
    }
  };

  // Mock function to detect suspicious activity locally
  const checkForSuspiciousActivity = (data: any): any | null => {
    // In a real implementation, this would use AI to detect threats
    // This is just a placeholder that randomly generates alerts
    
    if (Math.random() > 0.9) {
      return {
        id: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        level: Math.random() > 0.5 ? 'high' : 'medium',
        type: Math.random() > 0.5 ? 'system' : 'behavior',
        description: 'Suspicious process activity detected',
        details: {
          process: 'unknown.exe',
          activity: 'Unexpected network connections'
        }
      };
    }
    
    return null;
  };

  // Initialize monitoring
  useEffect(() => {
    const ws = connectWebSocket();
    
    // Set up interval for monitoring
    const interval = setInterval(runMonitoring, monitoringInterval);
    
    // Run once immediately
    runMonitoring();
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [monitoringInterval, isActive]);

  // Send detected issues to the server when they occur
  useEffect(() => {
    if (detectedIssues.length > 0) {
      const latestIssue = detectedIssues[detectedIssues.length - 1];
      sendData({
        type: 'issue',
        data: latestIssue
      });
    }
  }, [detectedIssues]);

  // This component is invisible to the user
  return null;
} 