import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { SupabaseDbError } from '../errors.js';
import { SupabaseDbService } from '../supabaseDbService.js';

// Mock the Supabase client and its methods
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockMatch = jest.fn();
const mockSingle = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockSupabaseClient: any = {
  from: mockFrom.mockImplementation(() => ({
    select: mockSelect.mockImplementation(() => ({
      match: mockMatch.mockImplementation(() => ({
        single: mockSingle,
      })),
      single: mockSingle,
    })),
    insert: mockInsert.mockImplementation(() => ({
      select: mockSelect.mockImplementation(() => ({
        single: mockSingle,
      })),
    })),
    update: mockUpdate.mockImplementation(() => ({
      match: mockMatch.mockImplementation(() => ({
        select: mockSelect.mockImplementation(() => ({
          single: mockSingle,
        })),
      })),
    })),
    delete: mockDelete.mockImplementation(() => ({
      match: mockMatch,
    })),
  })),
} as any; // Cast to any to allow partial mocking

describe('SupabaseDbService', () => {
  let service: SupabaseDbService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseDbService(mockSupabaseClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the client instance', () => {
    expect(service.getClient()).toBe(mockSupabaseClient);
  });

  describe('findMany', () => {
    it('should call client.from and select with correct arguments and return data', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      (mockSelect as jest.Mock<any>).mockResolvedValueOnce({ data: mockData, error: null });

      const result = await service.findMany<{ id: number; name: string }>('test_table', 'id,name');

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockSelect).toHaveBeenCalledWith('id,name');
      expect(result).toEqual(mockData);
    });

    it('should call client.select with "*" if select is not provided', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      (mockSelect as jest.Mock<any>).mockResolvedValueOnce({ data: mockData, error: null });

      await service.findMany<{ id: number; name: string }>('test_table');

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should throw SupabaseDbError on findMany error', async () => {
      const mockError = { message: 'Fetch failed', code: '123' };
      (mockSelect as jest.Mock<any>).mockImplementation(() => ({ data: null, error: mockError }));

      await expect(service.findMany('test_table')).rejects.toThrow(SupabaseDbError);
      await expect(service.findMany('test_table')).rejects.toThrow('Failed to fetch from test_table');
    });

    // New test for unexpected response format
    it('should throw SupabaseDbError on unexpected response format', async () => {
      (mockSelect as jest.Mock<any>).mockResolvedValueOnce('invalid response');

      await expect(service.findMany('test_table')).rejects.toThrow(SupabaseDbError);
      await expect(service.findMany('test_table')).rejects.toThrow('Failed to fetch from test_table');
    });

    // New test for unexpected error
    it('should handle unexpected errors during findMany', async () => {
      const unexpectedError = new Error('Network error');
      (mockSelect as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.findMany('test_table')).rejects.toThrow(SupabaseDbError);
      await expect(service.findMany('test_table')).rejects.toThrow('Failed to fetch from test_table');
    });

    // New test for empty result
    it('should return empty array when no data is found', async () => {
      (mockSelect as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: null });

      const result = await service.findMany('test_table');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should call client.from, select, match, and single with correct arguments and return data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const match = { id: 1 };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: mockData, error: null });

      const result = await service.findOne<{ id: number; name: string }>('test_table', match);

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockMatch).toHaveBeenCalledWith(match);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return null if no row is found (PGRST116 error)', async () => {
      const mockError = { message: 'No rows found', code: 'PGRST116' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      const result = await service.findOne<{ id: number; name: string }>('test_table', { id: 1 });

      expect(result).toBeNull();
    });

    it('should throw SupabaseDbError on findOne error (other than PGRST116)', async () => {
      const mockError = { message: 'Fetch failed', code: '123' };
      // Make sure the mock returns the same value for both calls
      (mockSingle as jest.Mock<any>).mockImplementation(() => ({ data: null, error: mockError }));

      await expect(service.findOne('test_table', { id: 1 })).rejects.toThrow(SupabaseDbError);
      await expect(service.findOne('test_table', { id: 1 })).rejects.toThrow('Failed to fetch from test_table with match');
    });

    // New test for unexpected error
    it('should handle unexpected errors during findOne', async () => {
      const unexpectedError = new Error('Network error');
      (mockSingle as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.findOne('test_table', { id: 1 })).rejects.toThrow(SupabaseDbError);
      await expect(service.findOne('test_table', { id: 1 })).rejects.toThrow('Failed to fetch from test_table with match');
    });

    // New test for null result with no error
    it('should return null when data is null but no error is present', async () => {
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: null });

      const result = await service.findOne('test_table', { id: 1 });

      expect(result).toBeNull();
    });
  });

  describe('insert', () => {
    it('should call client.from, insert, select, and single with correct arguments and return data', async () => {
      const values = { name: 'New Item' };
      const mockData = { id: 2, name: 'New Item' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: mockData, error: null });

      const result = await service.insert<{ id: number; name: string }>('test_table', values);

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockInsert).toHaveBeenCalledWith(values);
      expect(mockSelect).toHaveBeenCalledWith(); // select() with no arguments
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
    
    it('should throw SupabaseDbError on insert error', async () => {
      const values = { name: 'New Item' };
      const mockError = { message: 'Insert failed', code: '123' };
      // Make sure the mock returns the same value for both calls
      (mockSingle as jest.Mock<any>).mockImplementation(() => ({ data: null, error: mockError }));

      await expect(service.insert('test_table', values)).rejects.toThrow(SupabaseDbError);
      await expect(service.insert('test_table', values)).rejects.toThrow('Failed to insert into test_table');
    });

    // New test for unexpected response format
    it('should throw SupabaseDbError on unexpected response format', async () => {
      const values = { name: 'New Item' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce('invalid response');

      await expect(service.insert('test_table', values)).rejects.toThrow(SupabaseDbError);
      await expect(service.insert('test_table', values)).rejects.toThrow('Failed to insert into test_table');
    });

    // New test for unexpected error
    it('should handle unexpected errors during insert', async () => {
      const values = { name: 'New Item' };
      const unexpectedError = new Error('Network error');
      (mockSingle as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.insert('test_table', values)).rejects.toThrow(SupabaseDbError);
      await expect(service.insert('test_table', values)).rejects.toThrow('Failed to insert into test_table');
    });
  });

  describe('update', () => {
    it('should call client.from, update, match, select, and single with correct arguments and return data', async () => {
      const match = { id: 1 };
      const values = { name: 'Updated Item' };
      const mockData = { id: 1, name: 'Updated Item' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: mockData, error: null });

      const result = await service.update<{ id: number; name: string }>('test_table', match, values);

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockUpdate).toHaveBeenCalledWith(values);
      expect(mockMatch).toHaveBeenCalledWith(match);
      expect(mockSelect).toHaveBeenCalledWith(); // select() with no arguments
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return null if no row is found for update (PGRST116 error)', async () => {
      const match = { id: 1 };
      const values = { name: 'Updated Item' };
      const mockError = { message: 'No rows found', code: 'PGRST116' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce({ data: null, error: mockError });

      const result = await service.update<{ id: number; name: string }>('test_table', match, values);

      expect(result).toBeNull();
    });

    it('should throw SupabaseDbError on update error (other than PGRST116)', async () => {
      const match = { id: 1 };
      const values = { name: 'Updated Item' };
      const mockError = { message: 'Update failed', code: '123' };
      // Make sure the mock returns the same value for both calls
      (mockSingle as jest.Mock<any>).mockImplementation(() => ({ data: null, error: mockError }));

      await expect(service.update('test_table', match, values)).rejects.toThrow(SupabaseDbError);
      await expect(service.update('test_table', match, values)).rejects.toThrow('Failed to update test_table with match');
    });

    // New test for unexpected response format
    it('should throw SupabaseDbError on unexpected response format', async () => {
      const match = { id: 1 };
      const values = { name: 'Updated Item' };
      (mockSingle as jest.Mock<any>).mockResolvedValueOnce('invalid response');

      await expect(service.update('test_table', match, values)).rejects.toThrow(SupabaseDbError);
      await expect(service.update('test_table', match, values)).rejects.toThrow('Failed to update test_table with match');
    });

    // New test for unexpected error
    it('should handle unexpected errors during update', async () => {
      const match = { id: 1 };
      const values = { name: 'Updated Item' };
      const unexpectedError = new Error('Network error');
      (mockSingle as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.update('test_table', match, values)).rejects.toThrow(SupabaseDbError);
      await expect(service.update('test_table', match, values)).rejects.toThrow('Failed to update test_table with match');
    });
  });

  describe('delete', () => {
    it('should call client.from, delete, and match with correct arguments', async () => {
      const match = { id: 1 };
      (mockMatch as jest.Mock<any>).mockResolvedValueOnce({ error: null });

      await service.delete('test_table', match);

      expect(mockFrom).toHaveBeenCalledWith('test_table');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockMatch).toHaveBeenCalledWith(match);
    });

    it('should throw SupabaseDbError on delete error', async () => {
      const match = { id: 1 };
      const mockError = { message: 'Delete failed', code: '123' };
      // Make sure the mock returns the same value for both calls
      (mockMatch as jest.Mock<any>).mockImplementation(() => ({ error: mockError }));

      await expect(service.delete('test_table', match)).rejects.toThrow(SupabaseDbError);
      await expect(service.delete('test_table', match)).rejects.toThrow('Failed to delete from test_table with match');
    });

    // New test for unexpected response format
    it('should throw SupabaseDbError on unexpected response format', async () => {
      const match = { id: 1 };
      (mockMatch as jest.Mock<any>).mockResolvedValueOnce('invalid response');

      await expect(service.delete('test_table', match)).rejects.toThrow(SupabaseDbError);
      await expect(service.delete('test_table', match)).rejects.toThrow('Failed to delete from test_table with match');
    });

    // New test for unexpected error
    it('should handle unexpected errors during delete', async () => {
      const match = { id: 1 };
      const unexpectedError = new Error('Network error');
      (mockMatch as jest.Mock<any>).mockRejectedValueOnce(unexpectedError);

      await expect(service.delete('test_table', match)).rejects.toThrow(SupabaseDbError);
      await expect(service.delete('test_table', match)).rejects.toThrow('Failed to delete from test_table with match');
    });
  });
});