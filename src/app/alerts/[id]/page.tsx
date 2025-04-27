"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistance } from "date-fns";

// Mock data for an alert detail
const getMockAlert = (id: number) => ({
  id,
  timestamp: new Date(Date.now() - 1000 * 60 * (id * 5)).toISOString(),
  level: ["high", "medium", "low"][id % 3],
  type: ["image", "text", "audio"][id % 3],
  content: [
    "Detected weapon in screen capture",
    "Detected suspicious keywords: 'bomb', 'attack'", 
    "Detected hate speech in audio transcript",
    "Extremist symbols detected in image",
    "Suspicious URL detected: darkweb.onion"
  ][id % 5],
  screenshot: `/mock/screenshot${(id % 5) + 1}.jpg`,
  resolved: false,
  device: `Device-${100 + id}`,
  ipAddress: `192.168.1.${id % 255}`,
  user: `user${id}@organization.com`,
  location: "Office Building A",
  additionalContext: "User was browsing web content when the alert was triggered.",
  relatedAlerts: [id + 1, id + 2, id + 3].filter(n => n <= 20)
});

export default function AlertDetailPage({ params }: { params: { id: string } }) {
  const alertId = parseInt(params.id);
  const [alert, setAlert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the alert data from an API
    setAlert(getMockAlert(alertId));
    setIsLoading(false);
  }, [alertId]);

  const handleResolve = () => {
    setIsResolved(true);
    // In a real app, we would update the alert status via API
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-4">
          <div className="card p-8">
            <p className="text-center">Loading alert details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!alert) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-4">
          <div className="card p-8">
            <h1 className="text-xl font-bold mb-4">Alert Not Found</h1>
            <p>The alert you are looking for does not exist.</p>
            <Link href="/alerts" className="text-blue-400 hover:underline mt-4 inline-block">
              Back to Alerts
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
        <div className="flex mb-6 items-center">
          <Link href="/alerts" className="text-blue-400 hover:underline mr-3">
            ← Back to Alerts
          </Link>
          <h1 className="text-3xl font-bold">Alert #{alert.id} Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Alert Information</h2>
                  <p className="text-gray-400">
                    Detected {formatDistance(new Date(alert.timestamp), new Date(), { addSuffix: true })}
                  </p>
                </div>
                <span className={`inline-block px-3 py-1 rounded text-sm ${
                  alert.level === 'high' ? 'bg-red-600' : 
                  alert.level === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  {alert.level.toUpperCase()} PRIORITY
                </span>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <h3 className="font-semibold mb-2">Alert Content</h3>
                <p className="mb-4">{alert.content}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 mb-1">Alert Type</p>
                    <p>{alert.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Status</p>
                    <p>{isResolved ? 'Resolved' : 'Active'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Device</p>
                    <p>{alert.device}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">IP Address</p>
                    <p>{alert.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">User</p>
                    <p>{alert.user}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Location</p>
                    <p>{alert.location}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-2">Additional Context</h3>
                <p>{alert.additionalContext}</p>
              </div>
            </div>

            {alert.type === 'image' && (
              <div className="card">
                <h3 className="font-semibold mb-4">Screenshot Evidence</h3>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Screenshot captured at the time of detection
                  </p>
                  <div className="bg-black h-64 flex items-center justify-center">
                    <p className="text-gray-500">
                      [Image would be displayed here in a real implementation]
                    </p>
                  </div>
                </div>
              </div>
            )}

            {alert.type === 'audio' && (
              <div className="card">
                <h3 className="font-semibold mb-4">Audio Transcript</h3>
                <div className="bg-gray-700 rounded p-4">
                  <p className="italic">
                    "...and then we'll use the explosive materials to create a distraction while the main team enters through the back entrance..."
                  </p>
                  <div className="h-8 w-full bg-gray-800 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card mb-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {!isResolved ? (
                  <button 
                    onClick={handleResolve}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                  >
                    Mark as Resolved
                  </button>
                ) : (
                  <button className="w-full bg-gray-700 py-2 rounded cursor-not-allowed">
                    Already Resolved
                  </button>
                )}
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
                  Export Report
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded">
                  Escalate
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Related Alerts</h3>
              {alert.relatedAlerts.length > 0 ? (
                <ul className="space-y-2">
                  {alert.relatedAlerts.map((relId: number) => (
                    <li key={relId} className="border-b border-gray-700 pb-2 last:border-0">
                      <Link href={`/alerts/${relId}`} className="text-blue-400 hover:underline">
                        Alert #{relId}
                      </Link>
                      <p className="text-sm text-gray-400">Similar detection pattern</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No related alerts found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 