"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistance } from "date-fns";

// Mock data for demonstration
const mockAlerts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - 1000 * 60 * (i * 15 + Math.random() * 10)).toISOString(),
  level: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
  type: ["image", "text", "audio"][Math.floor(Math.random() * 3)],
  content: [
    "Detected weapon in screen capture",
    "Detected suspicious keywords: 'bomb', 'attack'", 
    "Detected hate speech in audio transcript",
    "Extremist symbols detected in image",
    "Suspicious URL detected: darkweb.onion"
  ][Math.floor(Math.random() * 5)],
  screenshot: Math.random() > 0.3 ? `/mock/screenshot${Math.floor(Math.random() * 5) + 1}.jpg` : null,
  resolved: Math.random() > 0.7
}));

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState({
    level: "all",
    type: "all",
    resolved: "all"
  });

  const filteredAlerts = alerts.filter(alert => {
    if (filter.level !== "all" && alert.level !== filter.level) return false;
    if (filter.type !== "all" && alert.type !== filter.type) return false;
    if (filter.resolved === "resolved" && !alert.resolved) return false;
    if (filter.resolved === "active" && alert.resolved) return false;
    return true;
  });

  const handleResolve = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
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
                <Link href="/alerts" className="text-blue-400">
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
        <h1 className="text-3xl font-bold mb-8">Security Alerts</h1>
        
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1">Priority Level</label>
              <select 
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
                value={filter.level}
                onChange={(e) => setFilter({...filter, level: e.target.value})}
              >
                <option value="all">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Alert Type</label>
              <select 
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="image">Image</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select 
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2"
                value={filter.resolved}
                onChange={(e) => setFilter({...filter, resolved: e.target.value})}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Level</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Content</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(alert => (
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
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      alert.resolved ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {alert.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link href={`/alerts/${alert.id}`} className="text-blue-400 hover:underline">
                      Details
                    </Link>
                    {!alert.resolved && (
                      <button 
                        onClick={() => handleResolve(alert.id)}
                        className="text-green-400 hover:underline"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No alerts match your filter criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 