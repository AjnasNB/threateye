import { NextRequest, NextResponse } from 'next/server';
import { devices } from './data';

// Get active devices
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get('deviceId');
  
  if (deviceId) {
    // Return specific device
    const device = devices[deviceId];
    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ device });
  }
  
  // Return all devices
  return NextResponse.json({ 
    devices: Object.values(devices) 
  });
}

// Send command to a device
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    
    if (!data.name || !data.type || !data.os) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a device ID
    const deviceId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    const device = {
      id: deviceId,
      name: data.name,
      type: data.type,
      os: data.os,
      ip: data.ip || null,
      mac: data.mac || null,
      status: 'active',
      registered: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      organizationId: data.organizationId || 'default-org',
      userId: data.userId || 'anonymous',
      metadata: data.metadata || {}
    };
    
    // Store the device
    devices[deviceId] = device;
    
    return NextResponse.json({ device }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 