import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifySession } from '@/lib/auth-utils';

interface SaveVerificationRequest {
  verificationCode: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔍 Save DigiLocker verification endpoint called');
    
    // Verify the user session
    const sessionResult = await verifySession(request);
    console.log('🔍 Session verification result:', sessionResult);
    
    if (!sessionResult.success || !sessionResult.user) {
      console.log('❌ Session verification failed');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body: SaveVerificationRequest = await request.json();
    const { verificationCode } = body;
    console.log('🔍 Verification code received:', verificationCode);

    if (!verificationCode) {
      console.log('❌ No verification code provided');
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔍 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Update the user with DigiLocker verification details
    console.log('🔍 Updating user with ID:', sessionResult.user._id);
    const updateData = {
      digilockerVerified: true,
      digilockerVerificationCode: verificationCode,
      digilockerVerifiedAt: new Date()
    };
    console.log('🔍 Update data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      sessionResult.user._id,
      updateData,
      { new: true }
    );

    console.log('🔍 Updated user result:', updatedUser);

    if (!updatedUser) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Verification saved successfully');

    return NextResponse.json({
      success: true,
      message: 'DigiLocker verification saved successfully',
      data: {
        digilockerVerified: updatedUser.digilockerVerified,
        digilockerVerificationCode: updatedUser.digilockerVerificationCode,
        digilockerVerifiedAt: updatedUser.digilockerVerifiedAt
      }
    });

  } catch (error) {
    console.error('❌ Error saving DigiLocker verification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
