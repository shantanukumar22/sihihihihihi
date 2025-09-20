import { useState, useCallback } from 'react';
import { ApiClient, ApiResponse } from '@/lib/api';

export interface UseApiState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T = unknown, TArgs extends unknown[] = unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApi<T = unknown, TArgs extends unknown[] = unknown[]>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<T>>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: TArgs): Promise<ApiResponse<T>> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success) {
        setState({
          data: (response.data as T) || null,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || response.message || 'An error occurred',
        });
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common API operations
export function useAadharOTPRequest() {
  return useApi(ApiClient.requestAadharOTP);
}

export function useAadharOTPSubmit() {
  return useApi(ApiClient.submitAadharOTP);
}

export function useDigiLockerInitialize() {
  return useApi(ApiClient.initializeDigiLocker);
}

export function useDigiLockerDocuments() {
  return useApi(ApiClient.getDigiLockerDocuments);
}

export function useDigiLockerDownload() {
  return useApi(ApiClient.downloadDigiLockerDocuments);
}

export function useLogin() {
  return useApi(ApiClient.login);
}

export function useSignup() {
  return useApi(ApiClient.signup);
}

export function useLogout() {
  return useApi(ApiClient.logout);
}

export function useGetCurrentUser() {
  return useApi(ApiClient.getCurrentUser);
}

export function useUpdateProfile() {
  return useApi(ApiClient.updateProfile);
}
