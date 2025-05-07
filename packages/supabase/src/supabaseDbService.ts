// packages/supabase/src/supabaseDbService.ts

import { SupabaseDbError } from './errors.js';
import { ISupabaseClient, ISupabaseDbService } from './interfaces.js';

export class SupabaseDbService implements ISupabaseDbService {
  private client: ISupabaseClient;

  constructor(supabaseClient: ISupabaseClient) {
    this.client = supabaseClient;
  }

  getClient(): ISupabaseClient {
    return this.client;
  }

  // Database interaction methods
  async findMany<T>(table: string, select?: string): Promise<T[]> {
    try {
      const result = await this.client
        .from(table)
        .select(select || '*');
      
      // For testing purposes, we need to handle the mock response format
      if (result && 'data' in result) {
        const { data, error } = result;
        
        if (error) {
          console.error(`Error fetching from ${table}:`, error);
          throw new SupabaseDbError(`Failed to fetch from ${table}`, error.code, error);
        }
        return (data || []) as T[];
      } else {
        // Handle unexpected response format
        console.error(`Unexpected response format from ${table}`);
        throw new SupabaseDbError(`Failed to fetch from ${table}`);
      }
    } catch (error: any) {
      if (error instanceof SupabaseDbError) {
        throw error;
      }
      console.error(`Unexpected error fetching from ${table}:`, error);
      throw new SupabaseDbError(`Failed to fetch from ${table}`, undefined, error);
    }
  }

  async findOne<T>(table: string, match: object): Promise<T | null> {
    try {
      const result = await this.client
        .from(table)
        .select('*')
        .match(match)
        .single();
      
      const { data, error } = result || { data: null, error: null };

      if (error) {
        // If no rows found, data is null and error is a PostgrestError with code 'PGRST116'
        // We should return null in this case, not throw an error.
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error(`Error fetching from ${table} with match:`, match, error);
        throw new SupabaseDbError(`Failed to fetch from ${table} with match`, error.code, error);
      }
      return data as T;
    } catch (error: any) {
      if (error instanceof SupabaseDbError) {
        throw error;
      }
      console.error(`Unexpected error fetching from ${table}:`, error);
      throw new SupabaseDbError(`Failed to fetch from ${table} with match`, undefined, error);
    }
  }

  async insert<T>(table: string, values: object): Promise<T> {
    try {
      const result = await this.client
        .from(table)
        .insert(values)
        .select()
        .single();
      
      // For testing purposes, we need to handle the mock response format
      if (result && 'data' in result) {
        const { data, error } = result;

        if (error) {
          console.error(`Error inserting into ${table}:`, values, error);
          throw new SupabaseDbError(`Failed to insert into ${table}`, error.code, error);
        }
        return data as T;
      } else {
        // Handle unexpected response format
        console.error(`Unexpected response format from ${table}`);
        throw new SupabaseDbError(`Failed to insert into ${table}`);
      }
    } catch (error: any) {
      if (error instanceof SupabaseDbError) {
        throw error;
      }
      console.error(`Unexpected error inserting into ${table}:`, error);
      throw new SupabaseDbError(`Failed to insert into ${table}`, undefined, error);
    }
  }

  async update<T>(
    table: string,
    match: object,
    values: object
  ): Promise<T | null> {
    try {
      const result = await this.client
        .from(table)
        .update(values)
        .match(match)
        .select()
        .single();
      
      // For testing purposes, we need to handle the mock response format
      if (result && 'data' in result) {
        const { data, error } = result;

        if (error) {
          // If no rows found for update, data is null and error is a PostgrestError with code 'PGRST116'
          // We should return null in this case, not throw an error.
          if (error.code === 'PGRST116') {
            return null;
          }
          console.error(
            `Error updating ${table} with match:`,
            match,
            values,
            error
          );
          throw new SupabaseDbError(`Failed to update ${table} with match`, error.code, error);
        }
        return data as T;
      } else {
        // Handle unexpected response format
        console.error(`Unexpected response format from ${table}`);
        throw new SupabaseDbError(`Failed to update ${table} with match`);
      }
    } catch (error: any) {
      if (error instanceof SupabaseDbError) {
        throw error;
      }
      console.error(`Unexpected error updating ${table}:`, error);
      throw new SupabaseDbError(`Failed to update ${table} with match`, undefined, error);
    }
  }

  async delete(table: string, match: object): Promise<void> {
    try {
      const result = await this.client.from(table).delete().match(match);
      
      // For testing purposes, we need to handle the mock response format
      if (result && typeof result === 'object') {
        if ('error' in result) {
          const { error } = result;
          if (error) {
            console.error(`Error deleting from ${table} with match:`, match, error);
            throw new SupabaseDbError(`Failed to delete from ${table} with match`, error.code, error);
          }
        }
        // If we get here, either there's no error property or error is null/undefined
        // In both cases, the delete was successful
      } else {
        // Handle unexpected response format (not an object or null/undefined)
        console.error(`Unexpected response format from ${table}`);
        throw new SupabaseDbError(`Failed to delete from ${table} with match`);
      }
    } catch (error: any) {
      if (error instanceof SupabaseDbError) {
        throw error;
      }
      console.error(`Unexpected error deleting from ${table}:`, error);
      throw new SupabaseDbError(`Failed to delete from ${table} with match`, undefined, error);
    }
  }
}
