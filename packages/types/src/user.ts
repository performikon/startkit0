/**
 * User-related types
 */
import { BaseEntity } from './common';

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

/**
 * User profile information
 */
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

/**
 * User entity
 */
export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  lastLoginAt?: string;
}

/**
 * User creation payload
 */
export interface CreateUserPayload {
  email: string;
  password: string;
  role?: UserRole;
  profile?: Partial<UserProfile>;
}

/**
 * User update payload
 */
export interface UpdateUserPayload {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  profile?: Partial<UserProfile>;
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}