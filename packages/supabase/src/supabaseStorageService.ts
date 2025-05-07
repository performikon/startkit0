// packages/supabase/src/supabaseStorageService.ts

import { SupabaseStorageError } from './errors.js';
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
    options?: import('@supabase/storage-js').FileOptions
  ): Promise<{ data: { path: string } | null; error: import('@supabase/storage-js').StorageError | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .upload(path, file, options);

      // Handle case where result might be undefined or null
      if (!result) {
        console.error('Error uploading file: Received undefined result');
        throw new SupabaseStorageError('Failed to upload file');
      }

      if (result.error) {
        console.error('Error uploading file:', result.error);
        throw new SupabaseStorageError('Failed to upload file', result.error);
      }

      return result;
    } catch (error: any) {
      if (error instanceof SupabaseStorageError) {
        throw error;
      }
      console.error('Unexpected error uploading file:', error);
      throw new SupabaseStorageError('Failed to upload file', error);
    }
  }

  async download(
    bucketName: string,
    path: string,
    options?: { transform?: import('@supabase/storage-js').TransformOptions }
  ): Promise<{ data: Blob | null; error: import('@supabase/storage-js').StorageError | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .download(path, options);

      // Handle case where result might be undefined or null
      if (!result) {
        console.error('Error downloading file: Received undefined result');
        throw new SupabaseStorageError('Failed to download file');
      }

      if (result.error) {
        console.error('Error downloading file:', result.error);
        throw new SupabaseStorageError('Failed to download file', result.error);
      }

      return result;
    } catch (error: any) {
      if (error instanceof SupabaseStorageError) {
        throw error;
      }
      console.error('Unexpected error downloading file:', error);
      throw new SupabaseStorageError('Failed to download file', error);
    }
  }

  async list(
    bucketName: string,
    path?: string,
    options?: import('@supabase/storage-js').SearchOptions
  ): Promise<{ data: import('@supabase/storage-js').FileObject[] | null; error: import('@supabase/storage-js').StorageError | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .list(path || '', options);

      // Handle case where result might be undefined or null
      if (!result) {
        console.error('Error listing files: Received undefined result');
        throw new SupabaseStorageError('Failed to list files');
      }

      if (result.error) {
        console.error('Error listing files:', result.error);
        throw new SupabaseStorageError('Failed to list files', result.error);
      }

      return result;
    } catch (error: any) {
      if (error instanceof SupabaseStorageError) {
        throw error;
      }
      console.error('Unexpected error listing files:', error);
      throw new SupabaseStorageError('Failed to list files', error);
    }
  }

  async update(
    bucketName: string,
    path: string,
    file: File | Blob | ArrayBuffer | ArrayBufferView,
    options?: import('@supabase/storage-js').FileOptions
  ): Promise<{ data: { path: string } | null; error: import('@supabase/storage-js').StorageError | null }> {
    try {
      const result = await this.client.storage
        .from(bucketName)
        .update(path, file, options);

      // Handle case where result might be undefined or null
      if (!result) {
        console.error('Error updating file: Received undefined result');
        throw new SupabaseStorageError('Failed to update file');
      }

      if (result.error) {
        console.error('Error updating file:', result.error);
        throw new SupabaseStorageError('Failed to update file', result.error);
      }

      return result;
    } catch (error: any) {
      if (error instanceof SupabaseStorageError) {
        throw error;
      }
      console.error('Unexpected error updating file:', error);
      throw new SupabaseStorageError('Failed to update file', error);
    }
  }

  async remove(
    bucketName: string,
    paths: string[]
  ): Promise<{ data: import('@supabase/storage-js').FileObject[] | null; error: import('@supabase/storage-js').StorageError | null }> {
    const result = await this.client.storage.from(bucketName).remove(paths);

    // Handle case where result might be undefined or null
    if (!result) {
      console.error('Error removing files: Received undefined result');
      throw new SupabaseStorageError('Failed to remove files');
    }

    if (result.error) {
      console.error('Error removing files:', result.error);
      throw new SupabaseStorageError('Failed to remove files', result.error);
    }

    return result;
  }
}
