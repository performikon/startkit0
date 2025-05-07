/**
 * Common types used across the application
 */

/**
 * Generic ID type
 */
export type ID = string;

/**
 * Generic response structure for API calls
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}