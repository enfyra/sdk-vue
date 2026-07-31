import { describe, expect, it, vi } from 'vitest';

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>();
  return { ...actual, onMounted: vi.fn(), onUnmounted: vi.fn() };
});

const mockClient = {
  from: () => ({
    select: function() { return this; },
    filter: function() { return this; },
    sort: function() { return this; },
    limit: function() { return this; },
    page: function() { return this; },
    meta: function() { return this; },
    deep: function() { return this; },
    execute: () => Promise.resolve({ data: [{ id: 1, title: 'Test' }], meta: { totalCount: 1 } }),
    insert: () => Promise.resolve({ data: { id: 2, title: 'New' } }),
    byId: () => ({
      update: () => Promise.resolve({ data: { id: 1, title: 'Updated' } }),
      delete: () => Promise.resolve(undefined),
    }),
  }),
  auth: {
    getMe: () => Promise.resolve(null),
    login: () => Promise.resolve({ strategy: 'token', tokens: {} }),
    logout: () => Promise.resolve(),
    getToken: () => Promise.resolve(null),
  },
  storage: {
    upload: () => Promise.resolve({ id: 1, name: 'f.txt' }),
    download: () => Promise.resolve(new Blob()),
    getDownloadUrl: () => '/assets/1',
    getFolderTree: () => Promise.resolve([]),
  },
  getHttpClient: () => ({ baseUrl: 'http://localhost:3000/api' }),
};

vi.mock('../src/composables/useEnfyra', () => ({
  useEnfyra: () => mockClient,
}));

import { useQuery, useMutation } from '../src/composables/useApi';
import { useStorage } from '../src/composables/useStorage';

describe('useQuery', () => {
  it('returns reactive refs with correct initial state', () => {
    const result = useQuery('articles', { immediate: false });
    expect(result.data.value).toBeNull();
    expect(result.pending.value).toBe(false);
    expect(result.status.value).toBeNull();
    expect(result.error.value).toBeNull();
    expect(typeof result.refresh).toBe('function');
  });

  it('executes query and populates data', async () => {
    const result = useQuery('articles', { immediate: false });
    const data = await result.refresh();
    expect(data).toEqual([{ id: 1, title: 'Test' }]);
    expect(result.status.value).toBe('success');
    expect(result.pending.value).toBe(false);
    expect(result.meta.value).toEqual({ totalCount: 1 });
  });
});

describe('useMutation', () => {
  it('returns reactive refs with correct initial state', () => {
    const result = useMutation('articles');
    expect(result.data.value).toBeNull();
    expect(result.pending.value).toBe(false);
    expect(result.status.value).toBeNull();
    expect(typeof result.execute).toBe('function');
  });

  it('executes insert mutation', async () => {
    const result = useMutation('articles', { operation: 'insert' });
    const data = await result.execute({ data: { title: 'Hello' } });
    expect(data).toEqual({ id: 2, title: 'New' });
    expect(result.status.value).toBe('success');
  });

  it('executes update mutation', async () => {
    const result = useMutation('articles', { operation: 'update' });
    const data = await result.execute({ id: 1, data: { title: 'Updated' } });
    expect(data).toEqual({ id: 1, title: 'Updated' });
    expect(result.status.value).toBe('success');
  });

  it('executes delete mutation', async () => {
    const result = useMutation('articles', { operation: 'delete' });
    const data = await result.execute({ id: 1 });
    expect(data).toBeNull();
    expect(result.status.value).toBe('success');
  });
});

describe('useStorage', () => {
  it('returns storage methods', () => {
    const storage = useStorage();
    expect(storage.uploading.value).toBe(false);
    expect(typeof storage.upload).toBe('function');
    expect(typeof storage.download).toBe('function');
    expect(typeof storage.getDownloadUrl).toBe('function');
    expect(typeof storage.getFolderTree).toBe('function');
    expect(storage.getDownloadUrl(1)).toBe('/assets/1');
  });
});
