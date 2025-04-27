import { NextRequest, NextResponse } from 'next/server';

// Shared storage - in a real app, this would be a database connection
import { devices } from '../data';

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
  
  const device = devices[deviceId];
  if (!device) {
    return NextResponse.json(
      { error: 'Device not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ device });
}

export async function PATCH(
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
  
  try {
    const updates = await request.json();
    
    const device = devices[deviceId];
    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Apply updates
    Object.assign(device, {
      ...updates,
      id: deviceId, // Prevent ID from being changed
      lastUpdated: new Date().toISOString()
    });
    
    return NextResponse.json({ device });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function DELETE(
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
  
  const device = devices[deviceId];
  if (!device) {
    return NextResponse.json(
      { error: 'Device not found' },
      { status: 404 }
    );
  }
  
  // Delete the device
  delete devices[deviceId];
  
  return NextResponse.json(
    { success: true, message: 'Device deleted' },
    { status: 200 }
  );
} 