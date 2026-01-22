import { MessageCode } from './message-codes.enum';

/**
 * Centralized message mapping
 * Maps MessageCode enum to actual user-facing messages
 */
export const Messages: Record<MessageCode, string> = {
  // ========== Validation Messages ==========
  // Email validation
  [MessageCode.EMAIL_INVALID]: 'Please provide a valid email address',
  [MessageCode.EMAIL_REQUIRED]: 'Email is required',
  
  // Password validation
  [MessageCode.PASSWORD_REQUIRED]: 'Password is required',
  [MessageCode.PASSWORD_MUST_BE_STRING]: 'Password must be a string',
  [MessageCode.PASSWORD_MIN_LENGTH]: 'Password must be at least 8 characters',
  [MessageCode.PASSWORD_MAX_LENGTH]: 'Password must be 32 characters or less',
  
  // Name validation
  [MessageCode.FIRST_NAME_REQUIRED]: 'First name is required',
  [MessageCode.FIRST_NAME_MUST_BE_STRING]: 'First name must be a string',
  [MessageCode.FIRST_NAME_MAX_LENGTH]: 'First name must be 100 characters or less',
  [MessageCode.LAST_NAME_REQUIRED]: 'Last name is required',
  [MessageCode.LAST_NAME_MUST_BE_STRING]: 'Last name must be a string',
  [MessageCode.LAST_NAME_MAX_LENGTH]: 'Last name must be 100 characters or less',
  
  // ========== Error Messages ==========
  // Authentication errors
  [MessageCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [MessageCode.USER_NOT_FOUND]: 'User not found',
  [MessageCode.USER_ALREADY_EXISTS]: 'User with this email already exists',

  // Authorization errors
  [MessageCode.ACCESS_DENIED]: 'Access denied',
  [MessageCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',

  // Student errors
  [MessageCode.STUDENT_NOT_FOUND]: 'Student not found',
  [MessageCode.STUDENT_ALREADY_EXISTS]: 'Student already exists',
  [MessageCode.STUDENT_CREATION_FAILED]: 'Failed to create student',

  // Site errors
  [MessageCode.SITE_NOT_FOUND]: 'Site not found',
  [MessageCode.SITE_CANNOT_BE_DELETED]: 'Cannot delete site that has associated students or sessions',

  // Tutor errors
  [MessageCode.TUTOR_NOT_FOUND]: 'Tutor not found',
  [MessageCode.TUTOR_ALREADY_EXISTS]: 'Tutor already exists',
  [MessageCode.TUTOR_CREATION_FAILED]: 'Failed to create tutor',
  [MessageCode.USER_NOT_TUTOR]: 'User is not a tutor',
  [MessageCode.USER_ALREADY_TUTOR]: 'User is already assigned as a tutor',
};

/**
 * Helper function to get message by code
 * Provides type safety and fallback
 */
export function getMessage(code: MessageCode): string {
  return Messages[code] || code;
}

