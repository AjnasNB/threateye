import { NextRequest } from 'next/server';

// Connected clients and session management
let connectedClients: Map<string, WebSocket> = new Map();
let activeDevices: Map<string, {
  userId: string;
  deviceId: string;
  organizationId: string;
  lastActive: Date;
  connectionId: string;
  status: 'online' | 'offline';
  systemInfo: any;
}> = new Map();

export function GET(request: NextRequest) {
  // This handler upgrades the HTTP connection to a WebSocket connection
  const { socket: response, upgrade } = Deno.upgradeWebSocket(request);
  
  // Generate a unique connection ID
  const connectionId = Math.random().toString(36).substring(2, 15);
  
  response.onopen = () => {
    console.log(`WebSocket connection opened: ${connectionId}`);
    // Store the connection
    connectedClients.set(connectionId, response);
  };
  
  response.onclose = () => {
    console.log(`WebSocket connection closed: ${connectionId}`);
    // Remove connection and mark device as offline
    connectedClients.delete(connectionId);
    
    // Find and update device status
    for (const [deviceId, device] of activeDevices.entries()) {
      if (device.connectionId === connectionId) {
        device.status = 'offline';
        device.lastActive = new Date();
        break;
      }
    }
  };
  
  response.onerror = (error) => {
    console.error(`WebSocket error on ${connectionId}:`, error);
  };
  
  response.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      // Handle authentication message
      if (message.type === 'auth') {
        handleAuth(connectionId, message.data, response);
        return;
      }
      
      // Handle device monitoring data
      if (message.type === 'monitoring') {
        handleMonitoringData(connectionId, message, response);
        return;
      }
      
      // Handle detected issues
      if (message.type === 'issue') {
        handleIssue(connectionId, message.data, response);
        return;
      }
      
      // Handle responses to commands
      if (message.type.endsWith('Response')) {
        handleCommandResponse(connectionId, message, response);
        return;
      }
      
      console.log(`Received message from ${connectionId}:`, message);
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  
  return upgrade;
}

// Handle client authentication
function handleAuth(connectionId: string, data: any, socket: WebSocket) {
  const { apiKey, deviceId, userId, organizationId } = data;
  
  // In a real implementation, validate the API key against the database
  if (!apiKey || !deviceId || !userId || !organizationId) {
    socket.send(JSON.stringify({
      type: 'error',
      data: {
        code: 'AUTH_ERROR',
        message: 'Invalid authentication parameters'
      }
    }));
    return;
  }
  
  // Store device information
  activeDevices.set(deviceId, {
    userId,
    deviceId,
    organizationId,
    lastActive: new Date(),
    connectionId,
    status: 'online',
    systemInfo: null
  });
  
  // Acknowledge successful authentication
  socket.send(JSON.stringify({
    type: 'auth_success',
    data: {
      message: 'Successfully authenticated',
      deviceId
    }
  }));
  
  // Request system information
  socket.send(JSON.stringify({
    type: 'command',
    data: {
      action: 'getSystemInfo',
      requestId: Math.random().toString(36).substring(2, 15)
    }
  }));
  
  console.log(`Device ${deviceId} authenticated for user ${userId}`);
}

// Handle monitoring data from client
function handleMonitoringData(connectionId: string, message: any, socket: WebSocket) {
  const { deviceId, userId, organizationId, timestamp, data } = message;
  
  // Get device from active devices
  const device = activeDevices.get(deviceId);
  
  if (!device) {
    socket.send(JSON.stringify({
      type: 'error',
      data: {
        code: 'DEVICE_NOT_FOUND',
        message: 'Device not found or not authenticated'
      }
    }));
    return;
  }
  
  // Update device last active time
  device.lastActive = new Date();
  
  // If system info is included, update it
  if (data.systemInfo) {
    device.systemInfo = data.systemInfo;
  }
  
  // Process data for threats (in a real implementation, this would use AI)
  processDataForThreats(message);
  
  // Acknowledge receipt
  socket.send(JSON.stringify({
    type: 'monitoring_ack',
    data: {
      timestamp: new Date().toISOString(),
      message: 'Data received and processed'
    }
  }));
}

// Process monitoring data for threats (mock implementation)
function processDataForThreats(message: any) {
  const { deviceId, data } = message;
  
  // In a real implementation, this would analyze the data using ML/AI
  // and generate alerts for suspicious activity
  
  // Mock implementation: 5% chance of generating an alert
  if (Math.random() > 0.95) {
    // Create mock alert
    const alert = {
      id: Math.floor(Math.random() * 1000000),
      deviceId,
      timestamp: new Date().toISOString(),
      level: Math.random() > 0.5 ? 'high' : 'medium',
      type: Math.random() > 0.5 ? 'behavior' : 'content',
      content: 'Potential security threat detected',
      details: {
        evidence: 'Suspicious patterns in user activity',
        confidence: 0.85
      }
    };
    
    // In a real implementation, store the alert in a database
    console.log('New alert generated:', alert);
    
    // Notify any admin dashboards that are connected
    notifyAdmins(alert);
  }
}

// Handle an issue detected by the client
function handleIssue(connectionId: string, issue: any, socket: WebSocket) {
  // In a real implementation, validate and store the issue in a database
  console.log('Issue reported by client:', issue);
  
  // Notify admin dashboards
  notifyAdmins(issue);
  
  // Acknowledge receipt
  socket.send(JSON.stringify({
    type: 'issue_ack',
    data: {
      issueId: issue.id,
      message: 'Issue recorded successfully'
    }
  }));
}

// Handle responses to commands
function handleCommandResponse(connectionId: string, message: any, socket: WebSocket) {
  // In a real implementation, this would forward the response to the admin
  // that requested the action
  console.log(`Received command response for request ${message.data.requestId}:`, message);
}

// Notify admin dashboards of new alerts/issues
function notifyAdmins(alert: any) {
  // In a real implementation, this would identify which admin dashboards
  // should receive the notification based on organization, permissions, etc.
  // and send the alert to those dashboards
  
  // For this example, we'll just log it
  console.log('Would notify admins of new alert:', alert);
}

// Admin API: Get list of active devices
export function listActiveDevices(organizationId: string) {
  const devices = [];
  
  for (const [deviceId, device] of activeDevices.entries()) {
    if (device.organizationId === organizationId) {
      devices.push({
        deviceId,
        userId: device.userId,
        status: device.status,
        lastActive: device.lastActive,
        systemInfo: device.systemInfo
      });
    }
  }
  
  return devices;
}

// Admin API: Send command to device
export function sendCommandToDevice(deviceId: string, command: any) {
  const device = activeDevices.get(deviceId);
  
  if (!device || device.status !== 'online') {
    return {
      success: false,
      message: 'Device not found or offline'
    };
  }
  
  const socket = connectedClients.get(device.connectionId);
  
  if (!socket) {
    return {
      success: false,
      message: 'Connection not found'
    };
  }
  
  try {
    socket.send(JSON.stringify({
      type: 'command',
      data: command
    }));
    
    return {
      success: true,
      message: 'Command sent successfully'
    };
  } catch (error) {
    console.error('Error sending command to device:', error);
    return {
      success: false,
      message: 'Error sending command'
    };
  }
} 