// In-memory storage for devices - in a real app, this would be a database
export const devices: Record<string, any> = {};

// Add some sample devices
devices['dev-001'] = {
  id: 'dev-001',
  name: 'Main Server',
  type: 'server',
  os: 'Ubuntu 22.04',
  ip: '192.168.1.10',
  mac: '00:1A:2B:3C:4D:5E',
  status: 'active',
  registered: new Date().toISOString(),
  lastSeen: new Date().toISOString(),
  organizationId: 'default-org',
  userId: 'admin',
  metadata: {}
};

devices['dev-002'] = {
  id: 'dev-002',
  name: 'Admin Laptop',
  type: 'desktop',
  os: 'Windows 11',
  ip: '192.168.1.20',
  mac: '00:1A:2B:3C:4D:6F',
  status: 'active',
  registered: new Date().toISOString(),
  lastSeen: new Date().toISOString(),
  organizationId: 'default-org',
  userId: 'admin',
  metadata: {}
};

// Map to track device threats
export const deviceThreats: Record<string, any[]> = {
  'dev-002': [
    {
      id: 'threat-001',
      deviceId: 'dev-002',
      name: 'Suspicious File Detected',
      type: 'malware',
      severity: 'medium',
      description: 'Potentially malicious file detected in downloads folder',
      detectedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'active'
    }
  ]
}; 