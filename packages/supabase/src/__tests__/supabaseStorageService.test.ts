import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SupabaseStorageError } from '../errors.js';
import { SupabaseStorageService } from '../supabaseStorageService.js';

// Mock the Supabase client and its storage methods
const mockFrom = jest.fn();
const mockUpload = jest.fn();
const mockDownload = jest.fn();
const mockList = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();

const mockSupabaseClient: any = {
  storage: {
    from: mockFrom.mockImplementation(() => ({
      upload: mockUpload,
      download: mockDownload,
      list: mockList,
      update: mockUpdate,
      remove: mockRemove,
    })),
  } as any, // Cast to any to allow partial mocking
  // Add other client properties (auth, from, rpc, etc.) as needed
} as any; // Cast to any to allow partial mocking

describe('SupabaseStorageService', () => {
  let service: SupabaseStorageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseStorageService(mockSupabaseClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the storage client instance', () => {
    expect(service.getClient()).toBe(mockSupabaseClient.storage);
  });

  describe('upload', () => {
    it('should call client.storage.from and upload with correct arguments and return data', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['test content'], { type: 'text/plain' });
      const options = { cacheControl: '3600' };
      const mockResponse = { data: { path: 'test_folder/test_file.txt' }, error: null };
      (mockUpload as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      const result = await service.upload(bucketName, path, file, options);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockUpload).toHaveBeenCalledWith(path, file, options);
      expect(result).toEqual(mockResponse);
    });

    it('should throw SupabaseStorageError on upload error', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['test content'], { type: 'text/plain' });
      const mockError = { message: 'Upload failed', statusCode: '400' };
      (mockUpload as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(service.upload(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.upload(bucketName, path, file)).rejects.toThrow('Failed to upload file');
    });

    // New test for undefined result
    it('should throw SupabaseStorageError when upload returns undefined result', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['test content'], { type: 'text/plain' });
      (mockUpload as jest.Mock<any>).mockResolvedValueOnce(undefined);

      await expect(service.upload(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.upload(bucketName, path, file)).rejects.toThrow('Failed to upload file');
    });

    // New test for unexpected error
    it('should handle unexpected errors during upload', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['test content'], { type: 'text/plain' });
      const unexpectedError = new Error('Unexpected network error');
      (mockUpload as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.upload(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.upload(bucketName, path, file)).rejects.toThrow('Failed to upload file');
    });
  });

  describe('download', () => {
    it('should call client.storage.from and download with correct arguments and return data', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const mockResponse = { data: mockBlob, error: null };
      (mockDownload as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      const result = await service.download(bucketName, path);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockDownload).toHaveBeenCalledWith(path, undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should call client.storage.download with options if provided', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const options = { transform: { width: 100 } };
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });
      const mockResponse = { data: mockBlob, error: null };
      (mockDownload as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      await service.download(bucketName, path, options);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockDownload).toHaveBeenCalledWith(path, options);
    });

    it('should throw SupabaseStorageError on download error', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const mockError = { message: 'Download failed', statusCode: '404' };
      (mockDownload as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(service.download(bucketName, path)).rejects.toThrow(SupabaseStorageError);
      await expect(service.download(bucketName, path)).rejects.toThrow('Failed to download file');
    });

    // New test for undefined result
    it('should throw SupabaseStorageError when download returns undefined result', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      (mockDownload as jest.Mock<any>).mockResolvedValueOnce(undefined);

      await expect(service.download(bucketName, path)).rejects.toThrow(SupabaseStorageError);
      await expect(service.download(bucketName, path)).rejects.toThrow('Failed to download file');
    });

    // New test for unexpected error
    it('should handle unexpected errors during download', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const unexpectedError = new Error('Unexpected network error');
      (mockDownload as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.download(bucketName, path)).rejects.toThrow(SupabaseStorageError);
      await expect(service.download(bucketName, path)).rejects.toThrow('Failed to download file');
    });
  });

  describe('list', () => {
    it('should call client.storage.from and list with correct arguments and return data', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder';
      const options = { limit: 10 };
      const mockData = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
      const mockResponse = { data: mockData, error: null };
      (mockList as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      const result = await service.list(bucketName, path, options);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockList).toHaveBeenCalledWith(path, options);
      expect(result).toEqual(mockResponse);
    });

    it('should call client.storage.list with empty path if path is not provided', async () => {
      const bucketName = 'test_bucket';
      const mockData = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
      const mockResponse = { data: mockData, error: null };
      (mockList as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      await service.list(bucketName);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockList).toHaveBeenCalledWith('', undefined);
    });

    it('should throw SupabaseStorageError on list error', async () => {
      const bucketName = 'test_bucket';
      const mockError = { message: 'List failed', statusCode: '500' };
      (mockList as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(service.list(bucketName)).rejects.toThrow(SupabaseStorageError);
      await expect(service.list(bucketName)).rejects.toThrow('Failed to list files');
    });

    // New test for undefined result
    it('should throw SupabaseStorageError when list returns undefined result', async () => {
      const bucketName = 'test_bucket';
      (mockList as jest.Mock<any>).mockResolvedValueOnce(undefined);

      await expect(service.list(bucketName)).rejects.toThrow(SupabaseStorageError);
      await expect(service.list(bucketName)).rejects.toThrow('Failed to list files');
    });

    // New test for unexpected error
    it('should handle unexpected errors during list', async () => {
      const bucketName = 'test_bucket';
      const unexpectedError = new Error('Unexpected network error');
      (mockList as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.list(bucketName)).rejects.toThrow(SupabaseStorageError);
      await expect(service.list(bucketName)).rejects.toThrow('Failed to list files');
    });
  });

  describe('update', () => {
    it('should call client.storage.from and update with correct arguments and return data', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['updated content'], { type: 'text/plain' });
      const options = { cacheControl: '3600' };
      const mockResponse = { data: { path: 'test_folder/test_file.txt' }, error: null };
      (mockUpdate as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      const result = await service.update(bucketName, path, file, options);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockUpdate).toHaveBeenCalledWith(path, file, options);
      expect(result).toEqual(mockResponse);
    });

    it('should throw SupabaseStorageError on update error', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['updated content'], { type: 'text/plain' });
      const mockError = { message: 'Update failed', statusCode: '400' };
      (mockUpdate as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(service.update(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.update(bucketName, path, file)).rejects.toThrow('Failed to update file');
    });

    // New test for undefined result
    it('should throw SupabaseStorageError when update returns undefined result', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['updated content'], { type: 'text/plain' });
      (mockUpdate as jest.Mock<any>).mockResolvedValueOnce(undefined);

      await expect(service.update(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.update(bucketName, path, file)).rejects.toThrow('Failed to update file');
    });

    // New test for unexpected error
    it('should handle unexpected errors during update', async () => {
      const bucketName = 'test_bucket';
      const path = 'test_folder/test_file.txt';
      const file = new Blob(['updated content'], { type: 'text/plain' });
      const unexpectedError = new Error('Unexpected network error');
      (mockUpdate as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.update(bucketName, path, file)).rejects.toThrow(SupabaseStorageError);
      await expect(service.update(bucketName, path, file)).rejects.toThrow('Failed to update file');
    });
  });

  describe('remove', () => {
    it('should call client.storage.from and remove with correct arguments and return data', async () => {
      const bucketName = 'test_bucket';
      const paths = ['test_folder/file1.txt', 'test_folder/file2.txt'];
      const mockData = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
      const mockResponse = { data: mockData, error: null };
      (mockRemove as jest.Mock<any>).mockResolvedValueOnce(mockResponse);

      const result = await service.remove(bucketName, paths);

      expect(mockFrom).toHaveBeenCalledWith(bucketName);
      expect(mockRemove).toHaveBeenCalledWith(paths);
      expect(result).toEqual(mockResponse);
    });

    it('should throw SupabaseStorageError on remove error', async () => {
      const bucketName = 'test_bucket';
      const paths = ['test_folder/file1.txt'];
      const mockError = { message: 'Remove failed', statusCode: '500' };
      (mockRemove as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      await expect(service.remove(bucketName, paths)).rejects.toThrow(SupabaseStorageError);
      await expect(service.remove(bucketName, paths)).rejects.toThrow('Failed to remove files');
    });

    // New test for undefined result
    it('should throw SupabaseStorageError when remove returns undefined result', async () => {
      const bucketName = 'test_bucket';
      const paths = ['test_folder/file1.txt'];
      (mockRemove as jest.Mock<any>).mockResolvedValueOnce(undefined);

      await expect(service.remove(bucketName, paths)).rejects.toThrow(SupabaseStorageError);
      await expect(service.remove(bucketName, paths)).rejects.toThrow('Failed to remove files');
    });

    // New test for unexpected error handling in remove
    it('should handle unexpected errors during remove operation', async () => {
      const bucketName = 'test_bucket';
      const paths = ['test_folder/file1.txt'];
      const unexpectedError = new Error('Network disconnected');
      (mockRemove as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.remove(bucketName, paths)).rejects.toThrow(SupabaseStorageError);
      await expect(service.remove(bucketName, paths)).rejects.toThrow('Failed to remove files');
    });
  });
});