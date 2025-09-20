import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormValidationReturn {
  errors: FormErrors;
  validateField: (name: string, value: unknown) => string | null;
  validateForm: (data: Record<string, unknown>) => boolean;
  clearErrors: () => void;
  setError: (name: string, error: string) => void;
  clearError: (name: string) => void;
}

export function useFormValidation(rules: ValidationRules): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((name: string, value: unknown): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${name} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters long`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `${name} must be no more than ${rule.maxLength} characters long`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${name} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: Record<string, unknown>): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    for (const [name, value] of Object.entries(data)) {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    setError,
    clearError
  };
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/\d/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  aadharNumber: {
    required: true,
    pattern: /^\d{12}$/,
    custom: (value: string) => {
      if (value.length !== 12) return 'Aadhar number must be exactly 12 digits';
      if (!/^\d+$/.test(value)) return 'Aadhar number must contain only digits';
      return null;
    }
  },
  otp: {
    required: true,
    pattern: /^\d{6}$/,
    custom: (value: string) => {
      if (value.length !== 6) return 'OTP must be exactly 6 digits';
      if (!/^\d+$/.test(value)) return 'OTP must contain only digits';
      return null;
    }
  },
  phoneNumber: {
    required: true,
    pattern: /^\+?[\d\s\-\(\)]+$/,
    custom: (value: string) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) return 'Phone number must be at least 10 digits';
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  }
};
