import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔍 Test save verification endpoint called');
    
    // Get the user ID from request body
    const body = await request.json();
    const { userId, verificationCode } = body;
    
    if (!userId || !verificationCode) {
      return NextResponse.json(
        { success: false, message: 'User ID and verification code are required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification saved successfully',
      data: {
        digilockerVerified: updatedUser.digilockerVerified,
        digilockerVerificationCode: updatedUser.digilockerVerificationCode,
        digilockerVerifiedAt: updatedUser.digilockerVerifiedAt
      }
    });

  } catch (error) {
    console.error('❌ Error saving verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
