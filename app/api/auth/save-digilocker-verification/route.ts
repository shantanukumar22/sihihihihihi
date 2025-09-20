import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifySession } from '@/lib/auth-utils';
import { addCorsHeaders, handleCors } from '@/lib/cors';

interface SaveVerificationRequest {
  verificationCode: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    console.log('🔍 Save DigiLocker verification endpoint called');
    
    // Verify the user session
    const sessionResult = await verifySession(request);
    console.log('🔍 Session verification result:', sessionResult);
    
    if (!sessionResult.success || !sessionResult.user) {
      console.log('❌ Session verification failed');
      const response = NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }

    // Parse the request body
    const body: SaveVerificationRequest = await request.json();
    const { verificationCode } = body;
    console.log('🔍 Verification code received:', verificationCode);

    if (!verificationCode) {
      console.log('❌ No verification code provided');
      const response = NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
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
      const response = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    console.log('✅ Verification saved successfully');

    const response = NextResponse.json({
      success: true,
      message: 'DigiLocker verification saved successfully',
      data: {
        digilockerVerified: updatedUser.digilockerVerified,
        digilockerVerificationCode: updatedUser.digilockerVerificationCode,
        digilockerVerifiedAt: updatedUser.digilockerVerifiedAt
      }
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('❌ Error saving DigiLocker verification:', error);
    const response = NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
