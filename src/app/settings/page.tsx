"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GroqService from "../../lib/services/groq-service";
import ScreenPipeService from "../../lib/services/screenpipe-service";

export default function SettingsPage() {
  const [isGroqConnected, setIsGroqConnected] = useState(false);
  const [isScreenPipeConnected, setIsScreenPipeConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [graqApiKey, setGroqApiKey] = useState<string>("");
  const [settings, setSettings] = useState({
    captureInterval: 5,
    audioMonitoring: true,
    screenMonitoring: true,
    detectionThreshold: 0.7,
    storageDays: 30,
    notificationEmail: "",
    autoReportHigh: true
  });

  useEffect(() => {
    const checkConnections = async () => {
      try {
        await GroqService.testConnection();
        setIsGroqConnected(true);
      } catch (error) {
        setIsGroqConnected(false);
      }

      try {
        await ScreenPipeService.testConnection();
        setIsScreenPipeConnected(true);
      } catch (error) {
        setIsScreenPipeConnected(false);
      }

      setIsLoading(false);
    };

    checkConnections();
  }, []);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings({
      ...settings,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? Number(value) 
          : value
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save settings to backend
    alert("Settings saved successfully!");
  };

  const handleTestGroq = async () => {
    try {
      setIsLoading(true);
      await GroqService.analyzeContent("Test content for security analysis");
      alert("Groq API test successful!");
      setIsGroqConnected(true);
    } catch (error) {
      alert("Groq API test failed. Check console for details.");
      setIsGroqConnected(false);
    } finally {
      setIsLoading(false);
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
                <Link href="/devices" className="hover:text-blue-400">
                  Devices
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-blue-400">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">System Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">API Connections</h2>
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">Groq AI Integration</h3>
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${isGroqConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isGroqConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">API Key</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mb-2"
                  value={graqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="Enter your Groq API key"
                />
                <p className="text-xs text-gray-400">Default: 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</p>
              </div>
              
              <button 
                className="btn-primary"
                onClick={handleTestGroq}
                disabled={isLoading}
              >
                {isLoading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">ScreenPipe Integration</h3>
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${isScreenPipeConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isScreenPipeConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <p className="mb-4">ScreenPipe is configured to capture screen content and audio for security analysis.</p>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Install ScreenPipe</button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
                  Configure Endpoints
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Monitoring Settings</h2>
            <form onSubmit={handleSaveSettings} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2">Capture Interval (seconds)</label>
                  <input 
                    type="number" 
                    name="captureInterval"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={settings.captureInterval}
                    onChange={handleSettingChange}
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Storage Period (days)</label>
                  <input 
                    type="number" 
                    name="storageDays"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={settings.storageDays}
                    onChange={handleSettingChange}
                    min="1"
                    max="365"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Detection Threshold</label>
                  <input 
                    type="number" 
                    name="detectionThreshold"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={settings.detectionThreshold}
                    onChange={handleSettingChange}
                    min="0"
                    max="1"
                    step="0.05"
                  />
                </div>
                
                <div>
                  <label className="block mb-2">Notification Email</label>
                  <input 
                    type="email" 
                    name="notificationEmail"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={settings.notificationEmail}
                    onChange={handleSettingChange}
                    placeholder="alerts@organization.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Monitoring Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="screenMonitoring"
                      name="screenMonitoring"
                      checked={settings.screenMonitoring}
                      onChange={handleSettingChange}
                      className="mr-2"
                    />
                    <label htmlFor="screenMonitoring">Enable Screen Monitoring</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="audioMonitoring"
                      name="audioMonitoring"
                      checked={settings.audioMonitoring}
                      onChange={handleSettingChange}
                      className="mr-2"
                    />
                    <label htmlFor="audioMonitoring">Enable Audio Monitoring</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="autoReportHigh"
                      name="autoReportHigh"
                      checked={settings.autoReportHigh}
                      onChange={handleSettingChange}
                      className="mr-2"
                    />
                    <label htmlFor="autoReportHigh">Auto-Report High Priority Threats</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 