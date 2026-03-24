// Mock for cloudflare:workers module used in tests.
// Provides stub env bindings so server files can be imported without the Workers runtime.

const kvStore = new Map<string, string>();

export const env = {
  APP_URL: "http://localhost:5173",
  BETTER_AUTH_SECRET: "test-secret-for-testing-only",
  GITHUB_CLIENT_ID: "test-github-id",
  GITHUB_CLIENT_SECRET: "test-github-secret",
  RESEND_API_KEY: "re_test_key",
  RESEND_FROM: "test@test.com",
  DB: {
    prepare: () => ({
      bind: () => ({
        all: async () => ({ results: [] }),
        first: async () => null,
        run: async () => ({ success: true }),
      }),
      all: async () => ({ results: [] }),
      first: async () => null,
      run: async () => ({ success: true }),
    }),
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 }),
  },
  KV: {
    get: async (key: string) => kvStore.get(key) ?? null,
    put: async (key: string, value: string) => { kvStore.set(key, value); },
    delete: async (key: string) => { kvStore.delete(key); },
    list: async () => ({ keys: [], list_complete: true, caches: [] }),
  },
};
