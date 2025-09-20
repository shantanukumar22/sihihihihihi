import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  officialName: string;
  profileComplete?: boolean;
  digilockerVerified?: boolean;
  digilockerVerificationCode?: string;
  digilockerVerifiedAt?: Date;
}

export interface AuthResult {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  error?: string;
}

/**
 * Verify JWT token from request cookies
 */
export function verifyAuthToken(request: NextRequest): AuthResult {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'No token provided'
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    
    return {
      isAuthenticated: true,
      user: decoded
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Invalid token'
    };
  }
}

/**
 * Verify session and return user ID for database operations
 */
export async function verifySession(request: NextRequest): Promise<{ success: boolean; user: { _id: string } | null; error?: string }> {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return {
        success: false,
        user: null,
        error: 'No token provided'
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    return {
      success: true,
      user: { _id: decoded.id }
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : 'Invalid token'
    };
  }
}

/**
 * Check if user has required permissions
 */
export function hasPermission(user: AuthenticatedUser | null, permission: string): boolean {
  if (!user) return false;
  
  // Add permission logic here based on your requirements
  switch (permission) {
    case 'access_dashboard':
      return user.profileComplete === true;
    case 'access_profile_setup':
      return user.profileComplete === false;
    default:
      return false;
  }
}

/**
 * Get redirect URL based on user authentication status and profile completion
 */
export function getRedirectUrl(user: AuthenticatedUser | null, currentPath: string): string | null {
  if (!user) {
    // Not authenticated - redirect to login
    return '/login';
  }
  
  if (!user.profileComplete && currentPath !== '/profile-setup') {
    // Profile not complete - redirect to profile setup
    return '/profile-setup';
  }
  
  if (user.profileComplete && currentPath === '/profile-setup') {
    // Profile complete but on profile setup - redirect to dashboard
    return '/dashboard';
  }
  
  // No redirect needed
  return null;
}

/**
 * Validate Aadhar number format
 */
export function validateAadharNumber(aadharNumber: string): { isValid: boolean; error?: string } {
  if (!aadharNumber) {
    return { isValid: false, error: 'Aadhar number is required' };
  }
  
  if (aadharNumber.length !== 12) {
    return { isValid: false, error: 'Aadhar number must be 12 digits' };
  }
  
  if (!/^\d+$/.test(aadharNumber)) {
    return { isValid: false, error: 'Aadhar number must contain only digits' };
  }
  
  return { isValid: true };
}

/**
 * Validate OTP format
 */
export function validateOTP(otp: string): { isValid: boolean; error?: string } {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }
  
  if (otp.length !== 6) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }
  
  if (!/^\d+$/.test(otp)) {
    return { isValid: false, error: 'OTP must contain only digits' };
  }
  
  return { isValid: true };
}

/**
 * Generate verification code
 */
export function generateVerificationCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `CW-${timestamp}-${random}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  return phoneNumber;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if password meets requirements
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
