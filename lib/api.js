/**
 * API utility for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Wrapper for fetch API with common options
 * @param {string} endpoint - API endpoint without the base URL
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Includes cookies in requests
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    // Parse response
    const data = isJson ? await response.json() : await response.text();
    
    // Handle API errors
    if (!response.ok) {
      throw new Error(
        isJson && data.message ? data.message : `API Error: ${response.status}`
      );
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export function get(endpoint, options = {}) {
  return fetchAPI(endpoint, { method: 'GET', ...options });
}

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export function post(endpoint, data, options = {}) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request payload
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export function put(endpoint, data, options = {}) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - Response data
 */
export function del(endpoint, options = {}) {
  return fetchAPI(endpoint, { method: 'DELETE', ...options });
}
