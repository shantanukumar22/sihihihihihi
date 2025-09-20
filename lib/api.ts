const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  user?: T;
  data?: unknown;
  verificationCode?: string;
  message?: string;
  error?: string;
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    console.log('🔍 API Request:', { url, method: config.method, body: config.body });

    try {
      const response = await fetch(url, config);
      console.log('🔍 API Response status:', response.status);
      const data = await response.json();
      console.log('🔍 API Response data:', data);

      if (!response.ok) {
        console.error('❌ API Request failed:', data);
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  static async signup(userData: {
    officialName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ id: string; email: string; officialName: string; profileComplete: boolean }>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ id: string; email: string; officialName: string; profileComplete: boolean }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async getCurrentUser(): Promise<ApiResponse<{ id: string; email: string; officialName: string; profileComplete: boolean; phoneNumber?: string; digilockerVerified?: boolean; digilockerVerificationCode?: string; digilockerVerifiedAt?: Date }>> {
    return this.request('/auth/me');
  }

  static async updateProfile(profileData: {
    dateOfBirth: string;
    securityQuestion: string;
    securityAnswer: string;
    phoneNumber: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/profile-setup', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  static async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  static async requestAadharOTP(aadharNumber: string): Promise<ApiResponse> {
    return this.request('/aadhaar-req-otp', {
      method: 'POST',
      body: JSON.stringify({ aadharNumber }),
    });
  }

  static async submitAadharOTP(clientId: string, otp: string): Promise<ApiResponse> {
    return this.request('/aadhaar-submit-otp', {
      method: 'POST',
      body: JSON.stringify({ clientId, otp }),
    });
  }

  static async saveDigiLockerVerification(verificationCode: string): Promise<ApiResponse> {
    console.log('🔍 API Client: Saving verification code:', verificationCode);
    try {
      const result = await this.request('/auth/save-digilocker-verification', {
        method: 'POST',
        body: JSON.stringify({ verificationCode }),
      });
      console.log('🔍 API Client: Save result:', result);
      return result;
    } catch (error) {
      console.error('❌ API Client: Save error:', error);
      throw error;
    }
  }


  static async initializeDigiLocker(userData: {
    fullName: string;
    email: string;
    mobileNumber: string;
  }): Promise<ApiResponse> {
    return this.request('/digilocker/initialize', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async getDigiLockerDocuments(): Promise<ApiResponse> {
    return this.request('/digilocker/get-documents');
  }

  static async downloadDigiLockerDocuments(fileIds: {
    aadhaarFileId: string;
    panFileId: string;
  }): Promise<ApiResponse> {
    return this.request('/digilocker/get-download', {
      method: 'POST',
      body: JSON.stringify(fileIds),
    });
  }
}
