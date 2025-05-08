import { describe, expect, it, jest } from '@jest/globals';
import { supabaseEnvSchema, validateSupabaseEnv } from '../validation.js';

describe('Supabase Environment Validation', () => {
  describe('supabaseEnvSchema', () => {
    it('should validate valid Supabase environment variables', () => {
      const validEnv = {
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_API_KEY: 'valid-api-key',
        SUPABASE_JWT_SECRET: 'jwt-secret',
        SUPABASE_STORAGE_BUCKET: 'storage-bucket',
        SUPABASE_DB_CONNECTION_STRING: 'postgresql://user:password@localhost:5432/db'
      };

      const result = supabaseEnvSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });

    it('should validate with only required fields', () => {
      const minimalEnv = {
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_API_KEY: 'valid-api-key'
      };

      const result = supabaseEnvSchema.safeParse(minimalEnv);
      expect(result.success).toBe(true);
    });

    it('should fail validation when SUPABASE_URL is missing', () => {
      const invalidEnv = {
        SUPABASE_API_KEY: 'valid-api-key'
      };

      const result = supabaseEnvSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should fail validation when SUPABASE_API_KEY is missing', () => {
      const invalidEnv = {
        SUPABASE_URL: 'https://example.supabase.co'
      };

      const result = supabaseEnvSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should fail validation when SUPABASE_URL is not a valid URL', () => {
      const invalidEnv = {
        SUPABASE_URL: 'not-a-url',
        SUPABASE_API_KEY: 'valid-api-key'
      };

      const result = supabaseEnvSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should fail validation when SUPABASE_API_KEY is empty', () => {
      const invalidEnv = {
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_API_KEY: ''
      };

      const result = supabaseEnvSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });
  });

  describe('validateSupabaseEnv', () => {
    it('should return validated environment variables', () => {
      const env = {
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_API_KEY: 'valid-api-key',
        SUPABASE_JWT_SECRET: 'jwt-secret'
      };

      const result = validateSupabaseEnv(env);
      expect(result).toEqual(env);
    });

    it('should throw an error with descriptive message when validation fails', () => {
      const env = {
        SUPABASE_URL: 'invalid-url',
        SUPABASE_API_KEY: 'valid-api-key'
      };

      expect(() => validateSupabaseEnv(env)).toThrow('Supabase configuration validation failed');
      expect(() => validateSupabaseEnv(env)).toThrow('SUPABASE_URL');
    });

    it('should handle missing required fields', () => {
      const env = {
        SUPABASE_URL: 'https://example.supabase.co'
      };

      expect(() => validateSupabaseEnv(env)).toThrow('Supabase configuration validation failed');
      expect(() => validateSupabaseEnv(env)).toThrow('SUPABASE_API_KEY');
    });

    it('should rethrow non-Zod errors', () => {
      // Mock the Zod schema parse method to throw a non-Zod error
      const mockError = new Error('Unexpected error');
      
      jest.spyOn(supabaseEnvSchema, 'parse').mockImplementation(() => {
        throw mockError;
      });

      try {
        expect(() => validateSupabaseEnv({})).toThrow(mockError);
      } finally {
        // Restore the original method
        jest.spyOn(supabaseEnvSchema, 'parse').mockRestore();
      }
    });
  });
});