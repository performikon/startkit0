// packages/supabase/src/supabaseDbService.ts

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
  async findMany<T>(table: string, select?: string): Promise<T[] | null> {
    try {
      const { data, error } = await this.client
        .from(table)
        .select(select || '*');
      if (error) {
        console.error(`Error fetching from ${table}:`, error);
        return null;
      }
      return data as T[];
    } catch (error) {
      console.error(`Exception fetching from ${table}:`, error);
      return null;
    }
  }

  async findOne<T>(table: string, match: object): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(table)
        .select('*')
        .match(match)
        .single();

      if (error) {
        console.error(`Error fetching from ${table} with match:`, match, error);
        return null;
      }
      return data as T;
    } catch (error) {
      console.error(
        `Exception fetching from ${table} with match:`,
        match,
        error
      );
      return null;
    }
  }

  async insert<T>(table: string, values: object): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(table)
        .insert(values)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting into ${table}:`, values, error);
        return null;
      }
      return data as T;
    } catch (error) {
      console.error(`Exception inserting into ${table}:`, values, error);
      return null;
    }
  }

  async update<T>(
    table: string,
    match: object,
    values: object
  ): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(table)
        .update(values)
        .match(match)
        .select()
        .single();

      if (error) {
        console.error(
          `Error updating ${table} with match:`,
          match,
          values,
          error
        );
        return null;
      }
      return data as T;
    } catch (error) {
      console.error(
        `Exception updating ${table} with match:`,
        match,
        values,
        error
      );
      return null;
    }
  }

  async delete(table: string, match: object): Promise<void> {
    try {
      const { error } = await this.client.from(table).delete().match(match);

      if (error) {
        console.error(`Error deleting from ${table} with match:`, match, error);
      }
    } catch (error) {
      console.error(
        `Exception deleting from ${table} with match:`,
        match,
        error
      );
    }
  }
}
