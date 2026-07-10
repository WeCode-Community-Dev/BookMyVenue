import { useState, useCallback } from 'react';

export function useAsyncFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();
      setData(result);

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong!';

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
  };
}
