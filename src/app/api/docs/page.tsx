"use client";

import Link from "next/link";

export default function ApiDocsPage() {
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
        <h1 className="text-3xl font-bold mb-8">ThreatEye API Documentation</h1>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="mb-4">
            The ThreatEye API allows you to integrate our AI threat detection capabilities into your own applications.
            All API endpoints require authentication using an API key.
          </p>
          
          <div className="bg-gray-700 p-4 rounded">
            <p className="font-mono mb-2">Base URL:</p>
            <p className="font-mono text-green-400">https://api.threateye.example.com/v1</p>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            All API requests must include your API key in the Authorization header:
          </p>
          
          <div className="bg-gray-700 p-4 rounded font-mono">
            <p className="mb-2 text-purple-400">Authorization: Bearer YOUR_API_KEY</p>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Screen Analysis</h3>
            <div className="bg-gray-700 p-4 rounded mb-2">
              <p className="font-mono text-blue-400">POST /analyze/screen</p>
            </div>
            <p className="mb-2">Analyze a screenshot for potential threats</p>
            <h4 className="font-semibold mt-4 mb-2">Request Body:</h4>
            <pre className="bg-gray-700 p-4 rounded mb-4">
{`{
  "image": "base64_encoded_image",
  "source": "device_id",
  "timestamp": "2024-07-01T12:00:00Z"
}`}
            </pre>
            
            <h4 className="font-semibold mb-2">Response:</h4>
            <pre className="bg-gray-700 p-4 rounded">
{`{
  "id": "analysis_id",
  "timestamp": "2024-07-01T12:00:10Z",
  "threats_detected": true,
  "detections": [
    {
      "type": "image",
      "level": "high",
      "content": "Weapon detected",
      "confidence": 0.92,
      "bounding_box": {
        "x": 100,
        "y": 200,
        "width": 150,
        "height": 100
      }
    }
  ]
}`}
            </pre>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Audio Analysis</h3>
            <div className="bg-gray-700 p-4 rounded mb-2">
              <p className="font-mono text-blue-400">POST /analyze/audio</p>
            </div>
            <p className="mb-2">Analyze audio transcript for potential threats</p>
            <h4 className="font-semibold mt-4 mb-2">Request Body:</h4>
            <pre className="bg-gray-700 p-4 rounded mb-4">
{`{
  "transcript": "text_content",
  "source": "device_id",
  "timestamp": "2024-07-01T12:00:00Z"
}`}
            </pre>
            
            <h4 className="font-semibold mb-2">Response:</h4>
            <pre className="bg-gray-700 p-4 rounded">
{`{
  "id": "analysis_id",
  "timestamp": "2024-07-01T12:00:10Z",
  "threats_detected": true,
  "detections": [
    {
      "type": "audio",
      "level": "medium",
      "content": "Suspicious keywords detected",
      "confidence": 0.78,
      "keywords": ["attack", "bomb"]
    }
  ]
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Alerts</h3>
            <div className="bg-gray-700 p-4 rounded mb-2">
              <p className="font-mono text-blue-400">GET /alerts</p>
            </div>
            <p className="mb-2">Get a list of all alerts</p>
            <h4 className="font-semibold mt-4 mb-2">Query Parameters:</h4>
            <ul className="list-disc ml-6 mb-4">
              <li><span className="font-mono">level</span> - Filter by alert level (high, medium, low)</li>
              <li><span className="font-mono">type</span> - Filter by alert type (image, audio, text)</li>
              <li><span className="font-mono">resolved</span> - Filter by resolution status (true, false)</li>
              <li><span className="font-mono">limit</span> - Maximum number of alerts to return</li>
              <li><span className="font-mono">offset</span> - Pagination offset</li>
            </ul>
            
            <h4 className="font-semibold mb-2">Response:</h4>
            <pre className="bg-gray-700 p-4 rounded">
{`{
  "total": 42,
  "offset": 0,
  "limit": 10,
  "alerts": [
    {
      "id": "alert_id",
      "timestamp": "2024-07-01T12:00:10Z",
      "level": "high",
      "type": "image",
      "content": "Weapon detected in screen capture",
      "resolved": false
    },
    // ... more alerts
  ]
}`}
            </pre>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <p className="mb-4">
            The API has the following rate limits:
          </p>
          
          <ul className="list-disc ml-6">
            <li>Screen Analysis: 10 requests per minute</li>
            <li>Audio Analysis: 10 requests per minute</li>
            <li>Alert Retrieval: 60 requests per minute</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 