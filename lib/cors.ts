import { NextRequest, NextResponse } from 'next/server';

export function addCorsHeaders(response: NextResponse): NextResponse;
export function addCorsHeaders(response: Response): Response;
export function addCorsHeaders(response: NextResponse | Response): NextResponse | Response {
  // Add CORS headers to allow all origins
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

export function handleCors(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response);
  }
  
  return null;
}
