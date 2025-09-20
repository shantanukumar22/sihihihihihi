import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Dynamic imports to avoid build issues
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const { officialName, email, password } = await request.json();

    // Validate required fields
    if (!officialName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 12);
    const user = new User({
      officialName,
      email,
      password: hashedPassword,
      profileComplete: false
    });

    await user.save();

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
      profileComplete: user.profileComplete
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      message: 'Account created successfully'
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
