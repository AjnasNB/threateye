"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";

export default function InstallPage() {
  const [step, setStep] = useState(1);
  const [organization, setOrganization] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [installationResult, setInstallationResult] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  
  const startInstallation = async () => {
    if (!organization || !apiKey || !email) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsInstalling(true);
    
    try {
      // In a real implementation, this would call the actual installer
      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = {
        success: true,
        deviceId: 'device-' + Math.random().toString(36).substring(2, 10),
        userId: email,
        organizationId: organization
      };
      
      setInstallationResult(result);
      setStep(4);
    } catch (error) {
      console.error('Installation error:', error);
      setInstallationResult({
        success: false,
        error: 'Installation failed due to an error. Please try again.'
      });
    } finally {
      setIsInstalling(false);
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
                <Link href="/settings" className="hover:text-blue-400">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Install ThreatEye Monitor</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map(stepNum => (
              <div 
                key={stepNum}
                className={`flex items-center ${stepNum < step ? 'text-green-500' : stepNum === step ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${
                  stepNum < step ? 'border-green-500 bg-green-900' : 
                  stepNum === step ? 'border-blue-500' : 'border-gray-500'
                }`}>
                  {stepNum < step ? '✓' : stepNum}
                </div>
                <span className="hidden sm:inline">
                  {stepNum === 1 && "Requirements"}
                  {stepNum === 2 && "Configuration"}
                  {stepNum === 3 && "Installation"}
                  {stepNum === 4 && "Complete"}
                </span>
              </div>
            ))}
          </div>
          
          <div className="h-1 bg-gray-700 relative">
            <div 
              className="h-full bg-blue-600 absolute left-0 top-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="card">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">System Requirements</h2>
              <p className="mb-4">Before installing ThreatEye, please ensure your system meets the following requirements:</p>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Minimum Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Windows 10+ / macOS 12+ / Ubuntu 20.04+</li>
                  <li>4 GB RAM</li>
                  <li>500 MB free disk space</li>
                  <li>Administrator privileges</li>
                  <li>Internet connection</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Permissions Required:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Screen recording access</li>
                  <li>Microphone access</li>
                  <li>Auto-start capability</li>
                  <li>Network access</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Configuration</h2>
              <p className="mb-4">Please provide the following information to configure your ThreatEye installation:</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-1">Organization ID</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Your organization ID"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">API Key</label>
                  <input 
                    type="password"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Your ThreatEye API key"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Email</label>
                  <input 
                    type="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  disabled={!organization || !apiKey || !email}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Installation</h2>
              <p className="mb-4">Review your configuration and click "Install" to begin the installation process:</p>
              
              <div className="bg-gray-800 p-4 rounded mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 mb-1">Organization ID</p>
                    <p>{organization}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Email</p>
                    <p>{email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">During installation:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You may be prompted to grant necessary permissions</li>
                  <li>A system service will be installed to enable background monitoring</li>
                  <li>The installation will register this device with your ThreatEye account</li>
                </ul>
              </div>
              
              {isInstalling && (
                <div className="mb-6 text-center">
                  <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 h-full bg-blue-600 animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  <p>Installing... Please wait</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  disabled={isInstalling}
                >
                  Back
                </button>
                <button 
                  onClick={startInstallation}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  disabled={isInstalling}
                >
                  {isInstalling ? 'Installing...' : 'Install'}
                </button>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {installationResult?.success ? 'Installation Complete' : 'Installation Failed'}
              </h2>
              
              {installationResult?.success ? (
                <div>
                  <div className="bg-green-900 border border-green-700 rounded p-4 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-2">
                        <span className="text-lg">✓</span>
                      </div>
                      <p className="font-semibold">ThreatEye Monitor has been successfully installed!</p>
                    </div>
                    
                    <p className="mb-2">Your device has been registered with the following details:</p>
                    <div className="bg-gray-800 p-3 rounded text-sm font-mono">
                      <p>Device ID: {installationResult.deviceId}</p>
                      <p>User: {installationResult.userId}</p>
                      <p>Organization: {installationResult.organizationId}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Next Steps:</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>The monitoring service is now running in the background</li>
                      <li>You can view the status of this device in the Devices dashboard</li>
                      <li>Alerts will be automatically generated when suspicious activity is detected</li>
                    </ul>
                    
                    <h3 className="font-semibold mb-2">Integration Code:</h3>
                    <p className="mb-2">For custom applications, add this component to monitor in real-time:</p>
                    <div className="bg-gray-800 p-3 rounded text-sm font-mono mb-2 overflow-x-auto">
                      <pre>{`import { SystemMonitor } from 'threateye-client';

// Add this to your React application
<SystemMonitor 
  userId="${installationResult.userId}"
  deviceId="${installationResult.deviceId}"
  organizationId="${installationResult.organizationId}"
  apiKey="${apiKey}"
  baseUrl="https://api.threateye.io"
  monitoringInterval={30000}
  captureScreenshots={true}
  captureAudio={true}
  captureSystemInfo={true}
  onThreatDetected={(threat) => console.log('Threat detected:', threat)}
  onError={(error) => console.error('Monitor error:', error)}
/>`}</pre>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`import { SystemMonitor } from 'threateye-client';

// Add this to your React application
<SystemMonitor 
  userId="${installationResult.userId}"
  deviceId="${installationResult.deviceId}"
  organizationId="${installationResult.organizationId}"
  apiKey="${apiKey}"
  baseUrl="https://api.threateye.io"
  monitoringInterval={30000}
  captureScreenshots={true}
  captureAudio={true}
  captureSystemInfo={true}
  onThreatDetected={(threat) => console.log('Threat detected:', threat)}
  onError={(error) => console.error('Monitor error:', error)}
/>`);
                        alert("Code copied to clipboard!");
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link 
                      href="/"
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    >
                      Return to Home
                    </Link>
                    <Link 
                      href="/devices"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      View Devices
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-red-900 border border-red-700 rounded p-4 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center mr-2">
                        <span className="text-lg">✗</span>
                      </div>
                      <p className="font-semibold">Installation failed</p>
                    </div>
                    
                    <p>{installationResult?.error || 'An unknown error occurred during installation.'}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setStep(3)}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => {
                        setStep(3);
                        setInstallationResult(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Load the installer script */}
      <Script src="/install-script.js" strategy="lazyOnload" />
    </main>
  );
} 