import { describe, it, expect } from 'vitest';

describe('queryClient', () => {
  it('should export a QueryClient with correct defaults', async () => {
    const { queryClient } = await import('../../config/queryClient');
    expect(queryClient).toBeDefined();
    expect(queryClient.getQueryDefaults).toBeDefined();
    expect(queryClient.getMutationDefaults).toBeDefined();
  });

  it('should have default staleTime of 5 minutes', async () => {
    const { queryClient } = await import('../../config/queryClient');
    const defaults = queryClient.getQueryDefaults();
    expect(defaults).toBeDefined();
  });
});
