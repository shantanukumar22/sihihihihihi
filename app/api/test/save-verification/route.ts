import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { addCorsHeaders, handleCors } from '@/lib/cors';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    console.log('🔍 Test save verification endpoint called');
    
    // Get the user ID from request body
    const body = await request.json();
    const { userId, verificationCode } = body;
    
    if (!userId || !verificationCode) {
      const response = NextResponse.json(
        { success: false, message: 'User ID and verification code are required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    console.log('🔍 Updating user ID:', userId, 'with verification code:', verificationCode);

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Update the user with DigiLocker verification details
    const updateData = {
      digilockerVerified: true,
      digilockerVerificationCode: verificationCode,
      digilockerVerifiedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    console.log('🔍 Updated user result:', updatedUser);

    if (!updatedUser) {
      const response = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Verification saved successfully',
      data: {
        digilockerVerified: updatedUser.digilockerVerified,
        digilockerVerificationCode: updatedUser.digilockerVerificationCode,
        digilockerVerifiedAt: updatedUser.digilockerVerifiedAt
      }
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('❌ Error saving verification:', error);
    const response = NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
