# ThreatEye Client Library

A powerful client library for integrating ThreatEye security monitoring into your applications.

## Installation

```bash
npm install threateye-client
```

or 

```bash
yarn add threateye-client
```

## Usage

### React Component Integration

The easiest way to integrate ThreatEye monitoring into your React application:

```jsx
import { SystemMonitor } from 'threateye-client';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      
      {/* Add the ThreatEye monitor */}
      <SystemMonitor 
        userId="user-123"
        deviceId="device-abc"
        organizationId="org-xyz"
        apiKey="your-api-key"
        monitoringInterval={30000}
        captureScreenshots={true}
        captureAudio={true}
        captureSystemInfo={true}
        onThreatDetected={(threat) => console.log('Threat detected:', threat)}
        onError={(error) => console.error('Monitor error:', error)}
      />
      
      {/* Your app content */}
    </div>
  );
}
```

### Advanced Usage

For more control, you can use the client and monitor classes directly:

```typescript
import { ThreatEyeClient, ThreatEyeMonitor } from 'threateye-client';

// Create a client
const client = new ThreatEyeClient({
  baseUrl: 'https://api.threateye.io',
  apiKey: 'your-api-key'
});

// Create a monitor
const monitor = new ThreatEyeMonitor(client, {
  deviceId: 'device-id',
  monitoringInterval: 60000, // 1 minute
  autoStart: true
});

// Listen for events
monitor.on((event) => {
  switch (event.type) {
    case 'threat-detected':
      console.log('Threat detected:', event.threat);
      break;
    case 'error':
      console.error('Error:', event.error);
      break;
  }
});

// Register a new device
async function registerDevice() {
  const device = await monitor.registerDevice({
    name: 'My Device',
    type: 'desktop',
    os: 'Windows 10',
    ip: '192.168.1.100'
  });
  
  console.log('Registered device:', device);
}

// Report a threat manually
async function reportThreat() {
  const threat = await monitor.reportThreat({
    type: 'suspicious-activity',
    name: 'Unusual Login Attempt',
    severity: 'high',
    description: 'Multiple failed login attempts detected'
  });
  
  console.log('Reported threat:', threat);
}

// Stop monitoring when done
function cleanup() {
  monitor.stop();
}
```

## API Reference

### SystemMonitor Component

A React component for easy integration.

#### Props

- `userId`: User identifier
- `deviceId`: Device identifier
- `organizationId`: Organization identifier
- `apiKey`: API key for authentication
- `baseUrl`: API base URL (default: 'https://api.threateye.io')
- `monitoringInterval`: Interval between checks in milliseconds (default: 60000)
- `captureScreenshots`: Whether to capture screenshots (default: false)
- `captureAudio`: Whether to capture audio (default: false)
- `captureSystemInfo`: Whether to capture system information (default: true)
- `onThreatDetected`: Callback when a threat is detected
- `onError`: Callback when an error occurs
- `onStatusChange`: Callback when monitor status changes
- `disabled`: Whether monitoring is disabled (default: false)

### ThreatEyeClient

Low-level client for API communication.

#### Methods

- `registerDevice(deviceData)`: Register a new device
- `getDevice(deviceId)`: Get device information
- `updateDevice(deviceId, data)`: Update device information
- `getThreats(deviceId)`: Get threats for a device
- `reportThreat(deviceId, threat)`: Report a new threat
- `resolveThreat(deviceId, threatId)`: Resolve a threat
- `ping()`: Check API connectivity

### ThreatEyeMonitor

Monitoring service that uses the client.

#### Methods

- `registerDevice(deviceInfo)`: Register a new device
- `start()`: Start monitoring
- `stop()`: Stop monitoring
- `reportThreat(threat)`: Report a threat manually
- `getDevice()`: Get the current device
- `isMonitoring()`: Check if monitoring is active
- `on(handler)`: Add an event handler
- `off(handler)`: Remove an event handler

## License

MIT 