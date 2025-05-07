/**
 * API-related types
 */
import { ApiResponse, PaginatedResult, PaginationParams } from './common';
import { User } from './user';

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * API error codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

/**
 * API error
 */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
}

/**
 * Request options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * API client interface
 */
export interface ApiClient {
  get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

/**
 * User API endpoints
 */
export interface UserApi {
  getCurrentUser(): Promise<ApiResponse<User>>;
  getUsers(params: PaginationParams): Promise<ApiResponse<PaginatedResult<User>>>;
  getUserById(id: string): Promise<ApiResponse<User>>;
  createUser(data: any): Promise<ApiResponse<User>>;
  updateUser(id: string, data: any): Promise<ApiResponse<User>>;
  deleteUser(id: string): Promise<ApiResponse<void>>;
}

/**
 * Authentication API endpoints
 */
export interface AuthApi {
  login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>>;
  register(email: string, password: string, data?: any): Promise<ApiResponse<{ token: string; user: User }>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(token: string): Promise<ApiResponse<{ token: string }>>;
  forgotPassword(email: string): Promise<ApiResponse<void>>;
  resetPassword(token: string, password: string): Promise<ApiResponse<void>>;
}