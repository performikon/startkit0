/**
 * Interfaces for Supabase configuration
 */

/**
 * Base configuration interface for all environments
 */
export interface BaseConfig {
  /**
   * The environment name (development, staging, production)
   */
  environment: string;
}

/**
 * Supabase configuration interface
 */
export interface SupabaseConfig extends BaseConfig {
  /**
   * Supabase URL
   */
  url: string;
  
  /**
   * Supabase API key
   */
  apiKey: string;
  
  /**
   * Optional JWT secret for auth service
   */
  jwtSecret?: string;
  
  /**
   * Optional storage bucket name
   */
  storageBucket?: string;
  
  /**
   * Optional database connection string
   */
  dbConnectionString?: string;
}

/**
 * Environment variables interface for Supabase
 */
export interface SupabaseEnvVars {
  SUPABASE_URL: string;
  SUPABASE_API_KEY: string;
  SUPABASE_JWT_SECRET?: string;
  SUPABASE_STORAGE_BUCKET?: string;
  SUPABASE_DB_CONNECTION_STRING?: string;
}

/**
 * Configuration provider interface
 */
export interface ConfigProvider {
  /**
   * Get the Supabase configuration for the current environment
   */
  getSupabaseConfig(): SupabaseConfig;
}