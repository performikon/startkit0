// packages/supabase/src/supabaseStorageService.ts

import { ISupabaseClient, ISupabaseStorageService } from './interfaces.js';

export class SupabaseStorageService implements ISupabaseStorageService {
  private client: ISupabaseClient;

  constructor(supabaseClient: ISupabaseClient) {
    this.client = supabaseClient;
  }

  getClient(): ISupabaseClient['storage'] {
    return this.client.storage;
  }

  async upload(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView,
    options?: any
  ): Promise<{ data: { path: string } | null; error: any | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .upload(path, file, options);

      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error: error as any };
    }
  }

  async download(
    bucketName: string,
    path: string,
    options?: any
  ): Promise<{ data: Blob | null; error: any | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .download(path, options);

      return result;
    } catch (error) {
      console.error('Error downloading file:', error);
      return { data: null, error: error as any };
    }
  }

  async list(
    bucketName: string,
    path?: string,
    options?: {
      search?: string;
      limit?: number;
      offset?: number;
      sortBy?: { column?: string; order?: string };
    }
  ): Promise<{ data: any[] | null; error: any | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .list(path || '', options);

      return result;
    } catch (error) {
      console.error('Error listing files:', error);
      return { data: null, error: error as any };
    }
  }

  async update(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView,
    options?: any
  ): Promise<{ data: { path: string } | null; error: any | null }> {
    try {
      // For update, we'll first remove the existing file then upload the new one
      await this.client.storage.from(bucketName).remove([path]);
      const result = await this.client.storage
        .from(bucketName)
        .upload(path, file, options);

      return result;
    } catch (error) {
      console.error('Error updating file:', error);
      return { data: null, error: error as any };
    }
  }

  async remove(
    bucketName: string,
    paths: string[]
  ): Promise<{ data: any[] | null; error: any | null }> {
    try {
      const result = await this.client.storage.from(bucketName).remove(paths);

      return result;
    } catch (error) {
      console.error('Error removing files:', error);
      return { data: null, error: error as any };
    }
  }
}
