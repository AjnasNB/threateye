import { NextRequest, NextResponse } from 'next/server';
import { devices, deviceThreats } from '../../data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deviceId = params.id;
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Check if device exists
  if (!devices[deviceId]) {
    return NextResponse.json(
      { error: 'Device not found' },
      { status: 404 }
    );
  }
  
  // Return threats for device
  const threats = deviceThreats[deviceId] || [];
  return NextResponse.json({ threats });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deviceId = params.id;
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Check if device exists
  if (!devices[deviceId]) {
    return NextResponse.json(
      { error: 'Device not found' },
      { status: 404 }
    );
  }
  
  try {
    const data = await request.json();
    
    if (!data.type || !data.severity || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate threat ID
    const threatId = `threat-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    const threat = {
      id: threatId,
      deviceId,
      name: data.name || `${data.type} Threat`,
      type: data.type,
      severity: data.severity,
      description: data.description,
      detectedAt: new Date().toISOString(),
      status: 'active',
      metadata: data.metadata || {}
    };
    
    // Initialize threats array if it doesn't exist
    if (!deviceThreats[deviceId]) {
      deviceThreats[deviceId] = [];
    }
    
    // Add the threat
    deviceThreats[deviceId].push(threat);
    
    return NextResponse.json({ threat }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 