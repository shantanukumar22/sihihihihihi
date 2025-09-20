import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { addCorsHeaders, handleCors } from '@/lib/cors';

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    const { email, verificationCode } = await request.json();

    // Validate required fields
    if (!email || !verificationCode) {
      const response = NextResponse.json(
        { status: 'error', message: 'Email and verification code are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const response = NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    // Check if the verification code matches
    if (user.digilockerVerificationCode !== verificationCode) {
      const response = NextResponse.json(
        { status: 'error', message: 'Invalid verification code' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Update user as verified if not already verified
    if (!user.digilockerVerified) {
      await User.findByIdAndUpdate(user._id, {
        digilockerVerified: true,
        digilockerVerifiedAt: new Date()
      });
    }

    const response = NextResponse.json({
      status: 'success',
      message: 'DigiLocker verification successful'
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('DigiLocker verification error:', error);
    const response = NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
