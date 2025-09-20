import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  message: string,
  error?: string,
  status: number = 400,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
      code
    },
    { status }
  );
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(
  errors: Record<string, string>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Validation failed',
      error: 'Please check the provided data',
      code: 'VALIDATION_ERROR',
      data: { errors }
    },
    { status: 422 }
  );
}

/**
 * Create an authentication error response
 */
export function createAuthErrorResponse(
  message: string = 'Authentication required'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    },
    { status: 401 }
  );
}

/**
 * Create a forbidden error response
 */
export function createForbiddenErrorResponse(
  message: string = 'Access forbidden'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Access forbidden',
      code: 'FORBIDDEN'
    },
    { status: 403 }
  );
}

/**
 * Create a not found error response
 */
export function createNotFoundErrorResponse(
  message: string = 'Resource not found'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Resource not found',
      code: 'NOT_FOUND'
    },
    { status: 404 }
  );
}

/**
 * Create a server error response
 */
export function createServerErrorResponse(
  message: string = 'Internal server error',
  error?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error || 'An unexpected error occurred',
      code: 'SERVER_ERROR'
    },
    { status: 500 }
  );
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  });
}

/**
 * Handle API errors with proper logging
 */
export function handleApiError(error: unknown, context: string): NextResponse<ApiResponse> {
  console.error(`API Error in ${context}:`, error);
  
  if (error instanceof Error) {
    return createServerErrorResponse(
      'An error occurred while processing your request',
      error.message
    );
  }
  
  return createServerErrorResponse();
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Sanitize API input data
 */
export function sanitizeApiInput(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
