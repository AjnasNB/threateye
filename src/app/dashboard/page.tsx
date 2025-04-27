"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistance } from "date-fns";

// Mock data for demonstration
const mockAlerts = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    level: "high",
    type: "image",
    content: "Detected weapon in screen capture",
    screenshot: "/mock/screenshot1.jpg"
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    level: "medium",
    type: "text",
    content: "Detected suspicious keywords: 'bomb', 'attack'",
    screenshot: "/mock/screenshot2.jpg"
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    level: "low",
    type: "audio",
    content: "Detected hate speech in audio transcript",
    screenshot: null
  }
];

export default function Dashboard() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [stats, setStats] = useState({
    totalAlerts: 32,
    highPriority: 5,
    mediumPriority: 12,
    lowPriority: 15,
    lastChecked: new Date().toISOString()
  });

  useEffect(() => {
    // In a real app, you'd fetch actual data here
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        lastChecked: new Date().toISOString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">ThreatEye</Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-blue-400">
                  Alerts
                </Link>
              </li>
              <li>
                <Link href="/devices" className="hover:text-blue-400">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <div className="flex items-center gap-3">
            <span>Monitoring Status:</span>
            <button 
              onClick={() => setMonitoringActive(!monitoringActive)}
              className={`px-4 py-2 rounded-full ${monitoringActive ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {monitoringActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Total Alerts</h3>
            <p className="text-3xl">{stats.totalAlerts}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">High Priority</h3>
            <p className="text-3xl text-red-500">{stats.highPriority}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Medium Priority</h3>
            <p className="text-3xl text-yellow-500">{stats.mediumPriority}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Low Priority</h3>
            <p className="text-3xl text-blue-500">{stats.lowPriority}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Alerts</h2>
          <div className="card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Level</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Content</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-b border-gray-700">
                    <td className="p-3">{formatDistance(new Date(alert.timestamp), new Date(), { addSuffix: true })}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        alert.level === 'high' ? 'bg-red-600' : 
                        alert.level === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                      }`}>
                        {alert.level}
                      </span>
                    </td>
                    <td className="p-3">{alert.type}</td>
                    <td className="p-3">{alert.content}</td>
                    <td className="p-3">
                      <Link href={`/alerts/${alert.id}`} className="text-blue-400 hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="card">
            <div className="flex justify-between mb-4">
              <p>Last data check:</p>
              <p>{formatDistance(new Date(stats.lastChecked), new Date(), { addSuffix: true })}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p>ScreenPipe Status:</p>
              <p className="text-green-400">Connected</p>
            </div>
            <div className="flex justify-between mb-4">
              <p>Groq API Status:</p>
              <p className="text-green-400">Connected</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 