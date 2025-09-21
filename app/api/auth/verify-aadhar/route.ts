import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { addCorsHeaders, handleCors } from '@/lib/cors';

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      const response = NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
      return addCorsHeaders(response);
    }

    const user = verifyToken(token);
    if (!user) {
      const response = NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
      return addCorsHeaders(response);
    }

    const { aadharNumber, otp } = await request.json();

    if (!aadharNumber || !otp) {
      const response = NextResponse.json({ success: false, error: 'Aadhar number and OTP are required' }, { status: 400 });
      return addCorsHeaders(response);
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
        verificationCode: `SW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    };

    // Generate a unique verification code
    const verificationCode = `SW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const response = NextResponse.json({
      success: true,
      data: mockVerification.data,
      verificationCode: verificationCode
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Aadhar verification error:', error);
    const response = NextResponse.json(
      { success: false, error: 'Aadhar verification failed' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
