import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { addCorsHeaders, handleCors } from '@/lib/cors';

export async function PUT(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    // Dynamic imports to avoid build issues
    const bcrypt = await import('bcryptjs');
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

    const { dateOfBirth, securityQuestion, securityAnswer, phoneNumber } = await request.json();

    // Validate required fields
    if (!dateOfBirth || !securityQuestion || !securityAnswer || !phoneNumber) {
      const response = NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Validate date of birth (18+ check)
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      const response = NextResponse.json(
        { error: 'You must be at least 18 years old to use this service' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    // Find and update user
    const user = await User.findById(payload.id);
    if (!user) {
      const response = NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    // Hash security answer
    const hashedSecurityAnswer = bcrypt.hashSync(securityAnswer.toLowerCase().trim(), 10);

    // Update user profile
    user.dateOfBirth = dob;
    user.securityQuestion = securityQuestion;
    user.securityAnswer = hashedSecurityAnswer;
    user.phoneNumber = phoneNumber;
    user.profileComplete = true;

    await user.save();

    // Return updated user data (excluding password and security answer)
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
      message: 'Profile setup completed successfully'
    });
    return addCorsHeaders(response);
    } catch {
      console.error('Profile setup error:');
      const response = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
}
