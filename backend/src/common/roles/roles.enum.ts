/**
 * User roles in the system
 * These match the role values in the users table
 */
export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    TUTOR = 'tutor',
  }
  
  /**
   * Array of all roles for validation/iteration
   */
  export const ROLES = Object.values(Role) as string[];