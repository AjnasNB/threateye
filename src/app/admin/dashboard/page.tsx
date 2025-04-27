"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThreatEyeClient } from 'threateye-client';

interface Device {
  id: string;
  name: string;
  type: string;
  os: string;
  status: 'active' | 'inactive' | 'compromised';
  lastSeen?: string;
  threats?: number;
}

interface Threat {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  status: 'active' | 'resolved' | 'false-positive';
}

export default function AdminDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    compromisedDevices: 0,
    totalThreats: 0,
    activeThreats: 0,
    criticalThreats: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would use the actual API endpoint
        // This is a mock implementation for demonstration
        
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock devices data
        const mockDevices: Device[] = [
          { id: 'dev-001', name: 'Main Server', type: 'server', os: 'Ubuntu 22.04', status: 'active', lastSeen: new Date().toISOString(), threats: 0 },
          { id: 'dev-002', name: 'Admin Laptop', type: 'desktop', os: 'Windows 11', status: 'active', lastSeen: new Date().toISOString(), threats: 2 },
          { id: 'dev-003', name: 'Reception PC', type: 'desktop', os: 'Windows 10', status: 'inactive', lastSeen: new Date(Date.now() - 86400000).toISOString(), threats: 0 },
          { id: 'dev-004', name: 'Marketing Tablet', type: 'mobile', os: 'iOS 16', status: 'active', lastSeen: new Date().toISOString(), threats: 0 },
          { id: 'dev-005', name: 'Sales Laptop', type: 'desktop', os: 'macOS Monterey', status: 'compromised', lastSeen: new Date().toISOString(), threats: 3 }
        ];
        
        // Mock threats data
        const mockThreats: Threat[] = [
          { 
            id: 'threat-001', 
            deviceId: 'dev-002', 
            deviceName: 'Admin Laptop',
            type: 'malware', 
            name: 'Suspicious File Detected',
            severity: 'medium', 
            description: 'Potentially malicious file detected in downloads folder', 
            detectedAt: new Date(Date.now() - 3600000).toISOString(), 
            status: 'active' 
          },
          { 
            id: 'threat-002', 
            deviceId: 'dev-002', 
            deviceName: 'Admin Laptop',
            type: 'network', 
            name: 'Unusual Network Activity',
            severity: 'low', 
            description: 'Unusual outbound connection to unknown IP', 
            detectedAt: new Date(Date.now() - 7200000).toISOString(), 
            status: 'active' 
          },
          { 
            id: 'threat-003', 
            deviceId: 'dev-005', 
            deviceName: 'Sales Laptop',
            type: 'credentials', 
            name: 'Brute Force Attack',
            severity: 'critical', 
            description: 'Multiple failed login attempts detected', 
            detectedAt: new Date(Date.now() - 1800000).toISOString(), 
            status: 'active' 
          },
          { 
            id: 'threat-004', 
            deviceId: 'dev-005', 
            deviceName: 'Sales Laptop',
            type: 'malware', 
            name: 'Ransomware Detected',
            severity: 'critical', 
            description: 'Ransomware activity detected - filesystem changes monitored', 
            detectedAt: new Date(Date.now() - 900000).toISOString(), 
            status: 'active' 
          },
          { 
            id: 'threat-005', 
            deviceId: 'dev-005', 
            deviceName: 'Sales Laptop',
            type: 'behavior', 
            name: 'Suspicious Process',
            severity: 'high', 
            description: 'Unusual process trying to modify system files', 
            detectedAt: new Date(Date.now() - 600000).toISOString(), 
            status: 'active' 
          }
        ];
        
        // Calculate dashboard stats
        const deviceStats = {
          totalDevices: mockDevices.length,
          activeDevices: mockDevices.filter(d => d.status === 'active').length,
          inactiveDevices: mockDevices.filter(d => d.status === 'inactive').length,
          compromisedDevices: mockDevices.filter(d => d.status === 'compromised').length,
          totalThreats: mockThreats.length,
          activeThreats: mockThreats.filter(t => t.status === 'active').length,
          criticalThreats: mockThreats.filter(t => t.severity === 'critical').length
        };
        
        setDevices(mockDevices);
        setThreats(mockThreats);
        setStats(deviceStats);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up a refresh interval
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleResolveThreat = async (threatId: string) => {
    try {
      // In a real implementation, call the API to resolve the threat
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state to mark threat as resolved
      setThreats(prev => prev.map(threat => 
        threat.id === threatId ? { ...threat, status: 'resolved' } : threat
      ));
      
      // Update device threat count
      const resolvedThreat = threats.find(t => t.id === threatId);
      if (resolvedThreat) {
        setDevices(prev => prev.map(device => 
          device.id === resolvedThreat.deviceId ? 
            { ...device, threats: (device.threats || 0) - 1 } : device
        ));
      }
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeThreats: prev.activeThreats - 1,
        criticalThreats: resolvedThreat?.severity === 'critical' ? prev.criticalThreats - 1 : prev.criticalThreats
      }));
    } catch (err) {
      console.error('Error resolving threat:', err);
      setError('Failed to resolve threat');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'inactive': return 'bg-gray-500';
      case 'compromised': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-orange-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center bg-red-900 p-6 rounded-lg max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">ThreatEye</Link>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-600 text-white text-sm py-1 px-3 rounded-full">
              Admin Dashboard
            </span>
            <div className="relative">
              <button className="flex items-center space-x-1">
                <span>Admin User</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
            <Link href="/admin/settings" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
              Settings
            </Link>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-400">Total Devices</h3>
              <span className="text-2xl font-bold">{stats.totalDevices}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-green-500">Active: {stats.activeDevices}</span>
              <span className="text-gray-500">Inactive: {stats.inactiveDevices}</span>
              <span className="text-red-500">Compromised: {stats.compromisedDevices}</span>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-400">Active Threats</h3>
              <span className="text-2xl font-bold text-red-500">{stats.activeThreats}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-red-600">Critical: {stats.criticalThreats}</span>
              <span>Total Detected: {stats.totalThreats}</span>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-400">System Status</h3>
              <span className="text-2xl font-bold text-green-500">Online</span>
            </div>
            <div className="mt-3 text-sm">
              <p>Last check: {new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-400">License</h3>
              <span className="text-2xl font-bold">Enterprise</span>
            </div>
            <div className="mt-3 text-sm">
              <p>Valid until: 31/12/2023</p>
            </div>
          </div>
        </div>
        
        {/* Active Threats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Active Threats</h2>
          {threats.filter(t => t.status === 'active').length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-5xl mb-3">✓</div>
              <p className="text-xl font-semibold">No active threats detected</p>
              <p className="text-gray-400 mt-2">Your systems are secure</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left">Device</th>
                    <th className="px-4 py-3 text-left">Threat</th>
                    <th className="px-4 py-3 text-left">Severity</th>
                    <th className="px-4 py-3 text-left">Detected</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {threats
                    .filter(threat => threat.status === 'active')
                    .sort((a, b) => {
                      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                      return severityOrder[a.severity as keyof typeof severityOrder] - 
                             severityOrder[b.severity as keyof typeof severityOrder];
                    })
                    .map(threat => (
                      <tr key={threat.id} className="border-t border-gray-700">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="font-medium">{threat.deviceName}</p>
                              <p className="text-gray-400">{devices.find(d => d.id === threat.deviceId)?.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="font-medium">{threat.name}</p>
                            <p className="text-gray-400 text-xs">{threat.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(threat.detectedAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            onClick={() => handleResolveThreat(threat.id)}
                            className="bg-green-700 hover:bg-green-800 text-white py-1 px-3 rounded-full text-xs"
                          >
                            Resolve
                          </button>
                          <Link href={`/admin/threats/${threat.id}`} className="ml-2 bg-blue-700 hover:bg-blue-800 text-white py-1 px-3 rounded-full text-xs">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Devices Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Monitored Devices</h2>
            <Link href="/admin/devices" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <div key={device.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className={`h-2 ${getStatusColor(device.status)}`}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{device.name}</h3>
                      <p className="text-gray-400 text-sm">{device.type} • {device.os}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(device.status)}`}>
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Last Seen:</span>
                      <span>{device.lastSeen ? formatDate(device.lastSeen) : 'Never'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Threats:</span>
                      <span className={device.threats && device.threats > 0 ? 'text-red-500 font-semibold' : ''}>
                        {device.threats || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Link href={`/admin/devices/${device.id}`} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 text-sm rounded">
                      Details
                    </Link>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 text-sm rounded">
                      Scan Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}