import type { AllHTTPMethod, HTTPMethod } from '#types/routes'

/**
 * Array of standard HTTP methods supported by the server.
 */
export const HTTP_METHODS: HTTPMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
]

/**
 * Special HTTP method constant that matches all HTTP methods.
 * Used for registering handlers that respond to any HTTP method.
 */
export const ALL_HTTP_METHOD: AllHTTPMethod = 'ALL'
