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
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const response = NextResponse.json(
        { status: 'error', message: 'Invalid credentials' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Verify password
    if (!bcrypt.compareSync(password, user.password)) {
      const response = NextResponse.json(
        { status: 'error', message: 'Invalid credentials' },
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

    const response = NextResponse.json({
      status: 'success',
      message: 'Login successful',
      token: token
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    const response = NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
