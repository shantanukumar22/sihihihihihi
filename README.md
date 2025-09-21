# SecureWipe API Documentation

This is a Next.js application with a comprehensive API for user authentication, document verification, and DigiLocker integration.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Environment variables configured

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
```

### Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:3000/api`
- **Production:** `https://sih-bu.vercel.app/api`

### Response Format
All API responses follow this format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... },
  "token": "jwt-token" // (for login endpoints)
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 🔐 Authentication APIs

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "officialName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "officialName": "John Doe",
    "profileComplete": false
  }
}
```

### 2. User Login (Web App)
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "shantanuk436@gmail.com",
  "password": "admin212345"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "officialName": "John Doe",
    "profileComplete": true
  },
  "message": "Login successful"
}
```

### 3. User Login (Electron App)
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "shantanuk436@gmail.com",
  "password": "admin212345"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:** Requires authentication cookie

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "officialName": "John Doe",
    "profileComplete": true,
    "digilockerVerified": true,
    "digilockerVerificationCode": "CW-1758341804753-OUWDBPTSV"
  }
}
```

### 5. User Logout
**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 Profile Management APIs

### 1. Profile Setup
**Endpoint:** `POST /api/auth/profile-setup`

**Request Body:**
```json
{
  "dateOfBirth": "1990-01-01",
  "securityQuestion": "What is your mother's maiden name?",
  "securityAnswer": "Smith",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 📄 Document Verification APIs

### 1. Aadhaar OTP Request
**Endpoint:** `POST /api/aadhaar-req-otp`

**Request Body:**
```json
{
  "aadharNumber": "123456789012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "clientId": "client_id_for_verification"
}
```

### 2. Aadhaar OTP Submit
**Endpoint:** `POST /api/aadhaar-submit-otp`

**Request Body:**
```json
{
  "clientId": "client_id_from_previous_request",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aadhaar verified successfully"
}
```

### 3. Aadhaar Verification (Alternative)
**Endpoint:** `POST /api/auth/verify-aadhar`

**Request Body:**
```json
{
  "aadharNumber": "123456789012",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aadhaar verification successful"
}
```

### 4. PAN Verification
**Endpoint:** `POST /api/pan-verification`

**Request Body:**
```json
{
  "panNumber": "ABCDE1234F",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PAN verification successful"
}
```

---

## 🔒 DigiLocker APIs

### 1. Initialize DigiLocker
**Endpoint:** `POST /api/digilocker/initialize`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "verificationCode": "CW-1758341804753-OUWDBPTSV",
  "message": "DigiLocker initialized successfully"
}
```

### 2. Save DigiLocker Verification
**Endpoint:** `POST /api/auth/save-digilocker-verification`

**Request Body:**
```json
{
  "verificationCode": "CW-1758341804753-OUWDBPTSV"
}
```

**Response:**
```json
{
  "success": true,
  "message": "DigiLocker verification saved successfully",
  "data": {
    "digilockerVerified": true,
    "digilockerVerificationCode": "CW-1758341804753-OUWDBPTSV",
    "digilockerVerifiedAt": "2025-01-20T10:30:00.000Z"
  }
}
```

### 3. Verify DigiLocker (Electron App)
**Endpoint:** `POST /api/verify-digilocker`

**Request Body:**
```json
{

"email":"shantanuk436@gmail.com",
  "verificationCode": "CW-1758341804753-OUWDBPTSV"
}
```

**Response:** 
```json
{
  "status": "success",
  "message": "DigiLocker verification successful"
}
```

### 4. Get DigiLocker Documents
**Endpoint:** `GET /api/digilocker/get-documents`

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "type": "aadhaar",
      "fileId": "file_id_1",
      "name": "Aadhaar Card"
    },
    {
      "type": "pan",
      "fileId": "file_id_2", 
      "name": "PAN Card"
    }
  ]
}
```

### 5. Download DigiLocker Documents
**Endpoint:** `POST /api/digilocker/get-download`

**Request Body:**
```json
{
  "aadhaarFileId": "file_id_1",
  "panFileId": "file_id_2"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Documents downloaded successfully",
  "files": {
    "aadhaar": "base64_encoded_file_data",
    "pan": "base64_encoded_file_data"
  }
}
```

---

## 🧪 Testing APIs

### 1. Save Test Verification
**Endpoint:** `POST /api/test/save-verification`

**Request Body:**
```json
{
  "verificationCode": "TEST-CODE-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test verification saved"
}
```

---

## 📱 Usage Examples

### Using the API Client (JavaScript/TypeScript)

```typescript
import { ApiClient } from '@/lib/api';

// Web App Authentication
const loginResponse = await ApiClient.login({
  email: "john@example.com",
  password: "password123"
});

// Electron App Authentication
const electronLoginResponse = await ApiClient.electronLogin({
  email: "john@example.com", 
  password: "password123"
});

// DigiLocker Verification
const verifyResponse = await ApiClient.electronVerifyDigiLocker({
  email: "john@example.com",
  verificationCode: "CW-1758341804753-OUWDBPTSV"
});

// Get current user
const userResponse = await ApiClient.getCurrentUser();
```

### Using Fetch API (Electron App)

```javascript
// Login
const loginResponse = await fetch('https://your-api-domain.com/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// Verify DigiLocker
const verifyResponse = await fetch('https://your-api-domain.com/api/verify-digilocker', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    verificationCode: 'CW-1758341804753-OUWDBPTSV'
  })
});

const verifyData = await verifyResponse.json();
```

---

## 🔧 Error Handling

### Common Error Codes

- **400 Bad Request:** Missing or invalid request parameters
- **401 Unauthorized:** Invalid credentials or expired token
- **404 Not Found:** User or resource not found
- **500 Internal Server Error:** Server-side error

### Error Response Format

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "error": "Detailed technical error information"
}
```

---

## 🔒 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Tokens:** Secure authentication with 7-day expiration
- **CORS Protection:** Configured for cross-origin requests
- **Input Validation:** All inputs are validated and sanitized
- **Session Management:** HTTP-only cookies for web sessions

---

## 📝 Notes

- All endpoints support CORS for cross-origin requests
- Authentication is required for most endpoints (except signup and login)
- Passwords must be at least 8 characters long
- Email addresses are validated using regex patterns
- All timestamps are in ISO 8601 format
- The API automatically handles MongoDB connections

---

## 🚀 Deployment

The application is deployed on Vercel and can be accessed at:
- **Production API:** `https://sih-bu.vercel.app/api`

For deployment, ensure all environment variables are properly configured in your hosting platform.

---

## 📞 Support

For API support or questions, please refer to the codebase or contact the development team.