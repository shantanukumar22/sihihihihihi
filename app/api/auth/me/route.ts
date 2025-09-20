import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { addCorsHeaders, handleCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    // Dynamic imports to avoid build issues
    const jwt = await import('jsonwebtoken');

    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const response = NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    let payload: { id: string };
    try {
      payload = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      const response = NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Find user
    const user = await User.findById(payload.id);
    if (!user) {
      const response = NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    // Return user data (excluding password and security answer)
    const userData = {
      id: user._id.toString(),
      officialName: user.officialName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      securityQuestion: user.securityQuestion,
      phoneNumber: user.phoneNumber,
      profileComplete: user.profileComplete,
      digilockerVerified: user.digilockerVerified,
      digilockerVerificationCode: user.digilockerVerificationCode,
      digilockerVerifiedAt: user.digilockerVerifiedAt
    };

    const response = NextResponse.json({
      success: true,
      user: userData
    });
    return addCorsHeaders(response);
    } catch {
      console.error('Get user error:');
      const response = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
}
