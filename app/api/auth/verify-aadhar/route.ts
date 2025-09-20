import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { aadharNumber, otp } = await request.json();

    if (!aadharNumber || !otp) {
      return NextResponse.json({ success: false, error: 'Aadhar number and OTP are required' }, { status: 400 });
    }

    // Simulate DigiLocker API call
    // In a real implementation, you would call the actual DigiLocker API
    const mockVerification = {
      success: true,
      data: {
        aadharNumber: aadharNumber,
        name: 'John Doe',
        dob: '1990-01-01',
        gender: 'Male',
        address: '123 Main Street, City, State, 12345',
        photo: 'base64_encoded_photo_data',
        verificationCode: `CW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    };

    // Generate a unique verification code
    const verificationCode = `CW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      data: mockVerification.data,
      verificationCode: verificationCode
    });

  } catch (error) {
    console.error('Aadhar verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Aadhar verification failed' },
      { status: 500 }
    );
  }
}
