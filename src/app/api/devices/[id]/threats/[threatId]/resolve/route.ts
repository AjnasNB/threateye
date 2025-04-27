import { NextRequest, NextResponse } from 'next/server';
import { devices, deviceThreats } from '../../../../data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; threatId: string } }
) {
  const { id: deviceId, threatId } = params;
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
  
  // Check if device has threats
  if (!deviceThreats[deviceId]) {
    return NextResponse.json(
      { error: 'No threats found for this device' },
      { status: 404 }
    );
  }
  
  // Find the specific threat
  const threatIndex = deviceThreats[deviceId].findIndex(t => t.id === threatId);
  if (threatIndex === -1) {
    return NextResponse.json(
      { error: 'Threat not found' },
      { status: 404 }
    );
  }
  
  try {
    // Get resolution data if provided
    const data = await request.json().catch(() => ({}));
    
    // Update the threat
    const threat = deviceThreats[deviceId][threatIndex];
    const updatedThreat = {
      ...threat,
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolution: data.resolution || 'Manually resolved by user',
      notes: data.notes
    };
    
    // Update in the collection
    deviceThreats[deviceId][threatIndex] = updatedThreat;
    
    return NextResponse.json({ threat: updatedThreat });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to resolve threat' },
      { status: 500 }
    );
  }
} 