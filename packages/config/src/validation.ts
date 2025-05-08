import { z } from 'zod';
import { SupabaseEnvVars } from './interfaces.js';

/**
 * Zod schema for validating Supabase environment variables
 */
export const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string({
    required_error: "SUPABASE_URL is required",
    invalid_type_error: "SUPABASE_URL must be a string"
  }).url("SUPABASE_URL must be a valid URL"),
  
  SUPABASE_API_KEY: z.string({
    required_error: "SUPABASE_API_KEY is required",
    invalid_type_error: "SUPABASE_API_KEY must be a string"
  }).min(1, "SUPABASE_API_KEY cannot be empty"),
  
  SUPABASE_JWT_SECRET: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  SUPABASE_DB_CONNECTION_STRING: z.string().optional()
});

/**
 * Validate Supabase environment variables
 * @param env - Environment variables to validate
 * @returns Validated environment variables
 * @throws Error if validation fails
 */
export function validateSupabaseEnv(env: Record<string, string | undefined>): SupabaseEnvVars {
  try {
    return supabaseEnvSchema.parse({
      SUPABASE_URL: env.SUPABASE_URL,
      SUPABASE_API_KEY: env.SUPABASE_API_KEY,
      SUPABASE_JWT_SECRET: env.SUPABASE_JWT_SECRET,
      SUPABASE_STORAGE_BUCKET: env.SUPABASE_STORAGE_BUCKET,
      SUPABASE_DB_CONNECTION_STRING: env.SUPABASE_DB_CONNECTION_STRING
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Supabase configuration validation failed: ${errorMessages}`);
    }
    throw error;
  }
}