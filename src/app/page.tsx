"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ThreatEye</h1>
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

      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6">AI-Powered Threat Detection</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            ThreatEye monitors computer screens and audio in real time to detect
            extremist content and suspicious activities, providing instant alerts
            to security personnel.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Open Dashboard
            </Link>
            <Link href="/install" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
              Install Monitor
            </Link>
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              onClick={() => window.open("/api/docs", "_blank")}
            >
              API Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Continuous Monitoring</h3>
              <p>Uses ScreenPipe to capture screen content and audio for continuous analysis</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">AI Threat Detection</h3>
              <p>Groq-accelerated models identify weapons, extremist logos, and detect hate speech</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
              <p>Instant notifications with screenshots or transcripts when suspicious content is detected</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Investigation Console</h3>
              <p>Web dashboard for reviewing alerts, viewing flagged content, and searching history</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">1. Install & Monitor</h3>
              <p>Deploy the ThreatEye monitoring component on endpoint devices to capture screen content and audio</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">2. AI Analysis</h3>
              <p>Powerful AI models analyze the captured data in real-time to detect potential threats</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-3">3. Instant Alerts</h3>
              <p>Receive immediate notifications when suspicious content is detected, with context and evidence</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 ThreatEye - AI Threat Monitor. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
