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

    // Dynamic imports to avoid build issues
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      const response = NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const response = NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Verify password
    if (!bcrypt.compareSync(password, user.password)) {
      const response = NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const token = jwt.sign({
      id: user._id.toString(),
      email: user.email,
      officialName: user.officialName
    }, JWT_SECRET, { expiresIn: '7d' });

    // Return user data (excluding password)
    const userData = {
      id: user._id.toString(),
      officialName: user.officialName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      securityQuestion: user.securityQuestion,
      phoneNumber: user.phoneNumber,
      profileComplete: user.profileComplete
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Login successful'
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
