"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { formatDistance } from "date-fns";

interface Device {
  deviceId: string;
  userId: string;
  status: 'online' | 'offline';
  lastActive: string;
  systemInfo: {
    osVersion: string;
    browser: string;
    screenResolution: string;
    ipAddress: string;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
}

const mockDevices: Device[] = [
  {
    deviceId: 'device-001',
    userId: 'user1@example.com',
    status: 'online',
    lastActive: new Date().toISOString(),
    systemInfo: {
      osVersion: 'Windows 10',
      browser: 'Chrome 115',
      screenResolution: '1920x1080',
      ipAddress: '192.168.1.101',
      memoryUsage: 65.3,
      cpuUsage: 32.1,
      diskUsage: 78.4
    }
  },
  {
    deviceId: 'device-002',
    userId: 'user2@example.com',
    status: 'online',
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    systemInfo: {
      osVersion: 'macOS 13.4',
      browser: 'Safari 16',
      screenResolution: '2560x1440',
      ipAddress: '192.168.1.102',
      memoryUsage: 42.8,
      cpuUsage: 18.5,
      diskUsage: 62.1
    }
  },
  {
    deviceId: 'device-003',
    userId: 'user3@example.com',
    status: 'offline',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    systemInfo: {
      osVersion: 'Ubuntu 22.04',
      browser: 'Firefox 112',
      screenResolution: '1680x1050',
      ipAddress: '192.168.1.103',
      memoryUsage: 54.2,
      cpuUsage: 28.7,
      diskUsage: 45.9
    }
  }
];

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [commandResult, setCommandResult] = useState<string | null>(null);
  const [isCommandRunning, setIsCommandRunning] = useState(false);

  useEffect(() => {
    fetchDevices();
    
    // Poll for updates
    const interval = setInterval(fetchDevices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the actual API
      // const response = await axios.get('/api/devices');
      // setDevices(response.data.devices);
      
      // For the demo, use mock data
      setDevices(mockDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCommand = async (action: string) => {
    if (!selectedDevice) return;
    
    setIsCommandRunning(true);
    setCommandResult(null);
    
    try {
      // In a real implementation, this would send to the actual API
      // const response = await axios.post('/api/devices', {
      //   deviceId: selectedDevice.deviceId,
      //   command: { action }
      // });
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let result;
      if (selectedDevice.status === 'offline') {
        result = {
          success: false,
          message: 'Device is offline'
        };
      } else {
        result = {
          success: true,
          message: `Command "${action}" sent successfully to ${selectedDevice.deviceId}`
        };
        
        // If requesting a screenshot, simulate a response
        if (action === 'captureScreenshot') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setCommandResult('Screenshot captured successfully. View in Alerts section.');
        } else if (action === 'getSystemInfo') {
          await new Promise(resolve => setTimeout(resolve, 800));
          setCommandResult(JSON.stringify(selectedDevice.systemInfo, null, 2));
        } else {
          setCommandResult(`Command "${action}" executed successfully on ${selectedDevice.deviceId}`);
        }
      }
    } catch (error) {
      console.error('Error sending command:', error);
      setCommandResult('Error sending command to device');
    } finally {
      setIsCommandRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">ThreatEye</Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-blue-400">
                  Alerts
                </Link>
              </li>
              <li>
                <Link href="/devices" className="text-blue-400">
                  Devices
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-blue-400">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Device Management</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Connected Devices</h2>
                <button 
                  onClick={fetchDevices}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Refresh
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading devices...</div>
              ) : devices.length === 0 ? (
                <div className="text-center py-4">No devices connected</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-3">Device ID</th>
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Last Active</th>
                        <th className="text-left p-3">OS</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map(device => (
                        <tr 
                          key={device.deviceId} 
                          className={`border-b border-gray-700 ${selectedDevice?.deviceId === device.deviceId ? 'bg-gray-700' : ''}`}
                        >
                          <td className="p-3">{device.deviceId}</td>
                          <td className="p-3">{device.userId}</td>
                          <td className="p-3">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {device.status}
                          </td>
                          <td className="p-3">{formatDistance(new Date(device.lastActive), new Date(), { addSuffix: true })}</td>
                          <td className="p-3">{device.systemInfo?.osVersion || 'Unknown'}</td>
                          <td className="p-3">
                            <button 
                              onClick={() => setSelectedDevice(device)}
                              className="text-blue-400 hover:underline"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            {selectedDevice ? (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Device Control Panel</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold">{selectedDevice.deviceId}</h3>
                    <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs ${selectedDevice.status === 'online' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{selectedDevice.userId}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">System Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">OS:</p>
                      <p>{selectedDevice.systemInfo?.osVersion || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Browser:</p>
                      <p>{selectedDevice.systemInfo?.browser || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Resolution:</p>
                      <p>{selectedDevice.systemInfo?.screenResolution || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">IP Address:</p>
                      <p>{selectedDevice.systemInfo?.ipAddress || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Resource Usage</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm">{selectedDevice.systemInfo?.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${selectedDevice.systemInfo?.cpuUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm">{selectedDevice.systemInfo?.memoryUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${selectedDevice.systemInfo?.memoryUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Disk Usage</span>
                        <span className="text-sm">{selectedDevice.systemInfo?.diskUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-600 h-2.5 rounded-full" 
                          style={{ width: `${selectedDevice.systemInfo?.diskUsage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Remote Commands</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleSendCommand('captureScreenshot')}
                      disabled={isCommandRunning || selectedDevice.status !== 'online'}
                      className={`p-2 rounded text-sm ${
                        selectedDevice.status === 'online' 
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      Capture Screenshot
                    </button>
                    <button 
                      onClick={() => handleSendCommand('getSystemInfo')}
                      disabled={isCommandRunning || selectedDevice.status !== 'online'}
                      className={`p-2 rounded text-sm ${
                        selectedDevice.status === 'online' 
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      Get System Info
                    </button>
                    <button 
                      onClick={() => handleSendCommand('startMonitoring')}
                      disabled={isCommandRunning || selectedDevice.status !== 'online'}
                      className={`p-2 rounded text-sm ${
                        selectedDevice.status === 'online' 
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      Start Monitoring
                    </button>
                    <button 
                      onClick={() => handleSendCommand('stopMonitoring')}
                      disabled={isCommandRunning || selectedDevice.status !== 'online'}
                      className={`p-2 rounded text-sm ${
                        selectedDevice.status === 'online' 
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      Stop Monitoring
                    </button>
                  </div>
                </div>
                
                {isCommandRunning && (
                  <div className="text-center py-2">
                    <p>Sending command...</p>
                  </div>
                )}
                
                {commandResult && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Command Result</h4>
                    <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                      {commandResult}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center p-6">
                <p className="text-gray-400 mb-4">Select a device to manage</p>
                <p className="text-sm">Click on "Manage" next to any device to view details and send commands</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 