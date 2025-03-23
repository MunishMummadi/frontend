import { useState, useCallback } from 'react';
import * as api from '../lib/api';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiMethod - API method to call (get, post, put, del)
 * @returns {Object} - { data, loading, error, execute }
 */
export function useApi(apiMethod) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiMethod(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || 'An error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiMethod]
  );

  return { data, loading, error, execute };
}

/**
 * Custom hook for making GET requests
 * @param {string} endpoint - API endpoint
 * @param {boolean} immediate - Whether to fetch immediately
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useGet(endpoint, immediate = false) {
  const { data, loading, error, execute } = useApi(api.get);
  
  const refetch = useCallback(() => execute(endpoint), [execute, endpoint]);
  
  // Fetch on mount if immediate is true
  useState(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);
  
  return { data, loading, error, refetch };
}

/**
 * Custom hook for making POST requests
 * @returns {Object} - { data, loading, error, post }
 */
export function usePost() {
  const { data, loading, error, execute } = useApi(api.post);
  return { data, loading, error, post: execute };
}

/**
 * Custom hook for making PUT requests
 * @returns {Object} - { data, loading, error, put }
 */
export function usePut() {
  const { data, loading, error, execute } = useApi(api.put);
  return { data, loading, error, put: execute };
}

/**
 * Custom hook for making DELETE requests
 * @returns {Object} - { data, loading, error, del }
 */
export function useDel() {
  const { data, loading, error, execute } = useApi(api.del);
  return { data, loading, error, del: execute };
}
