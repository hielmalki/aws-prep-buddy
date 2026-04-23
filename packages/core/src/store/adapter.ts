export interface StorageAdapter {
  get<T>(table: string, key: string): Promise<T | undefined>;
  put<T>(table: string, key: string, value: T): Promise<void>;
  delete(table: string, key: string): Promise<void>;
  list<T>(table: string, filter?: { userId?: string }): Promise<T[]>;
  clear(table: string): Promise<void>;
}

const noopAdapter: StorageAdapter = {
  get: async () => undefined,
  put: async () => { console.warn('[aws-prep] StorageAdapter not set — call setStorageAdapter() before use'); },
  delete: async () => {},
  list: async () => [],
  clear: async () => {},
};

let current: StorageAdapter = noopAdapter;

export function setStorageAdapter(adapter: StorageAdapter): void {
  current = adapter;
}

export function getStorageAdapter(): StorageAdapter {
  return current;
}
