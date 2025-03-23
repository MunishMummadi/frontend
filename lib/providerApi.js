import { get, post } from './api';

/**
 * Fetch providers based on search criteria
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search query string
 * @param {number} [params.lat] - Latitude for location-based search
 * @param {number} [params.lng] - Longitude for location-based search
 * @param {number} [params.radius] - Search radius in miles
 * @param {string} [params.type] - Provider type filter
 * @param {string[]} [params.insurance] - Insurance providers accepted
 * @returns {Promise<Array>} - List of healthcare providers
 */
export function searchProviders(params = {}) {
  // Convert the params object to query string parameters
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(`${key}[]`, item));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  const queryString = queryParams.toString();
  return get(`providers/search${queryString ? `?${queryString}` : ''}`);
}

/**
 * Fetch a provider by ID
 * @param {string|number} id - Provider ID
 * @returns {Promise<Object>} - Provider details
 */
export function getProviderById(id) {
  return get(`providers/${id}`);
}

/**
 * Fetch providers near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} [radius=5] - Radius in miles
 * @returns {Promise<Array>} - List of nearby providers
 */
export function getProvidersNearby(lat, lng, radius = 5) {
  return get(`providers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
}

/**
 * Save a provider to user's favorites
 * @param {Object} provider - Provider to save
 * @returns {Promise<Object>} - Response from the server
 */
export function saveProvider(provider) {
  return post('saved', { providerId: provider.id });
}

/**
 * Remove a provider from user's favorites
 * @param {string|number} providerId - Provider ID to remove
 * @returns {Promise<Object>} - Response from the server
 */
export function removeProvider(providerId) {
  return post('saved/remove', { providerId });
}
