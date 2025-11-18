/**
 * Checks if a value is a plain object.
 * Returns false for arrays, null, and non-object types.
 */
export const isObject = (value: unknown): value is object => {
  return !!value && value.constructor === Object
}

/**
 * Checks if a value is an array.
 * This is a re-export of the native Array.isArray for consistency.
 */
export const isArray = Array.isArray

/**
 * Checks if a value is undefined, null, or an empty array.
 * Useful for validating optional array parameters.
 */
export const isEmptyArray = (value: unknown): value is undefined | null | [] =>
  value === undefined ||
  value === null ||
  !Array.isArray(value) ||
  value.length === 0

/**
 * Joins multiple path segments into a single normalized path.
 * Removes duplicate slashes, trailing slashes, and handles empty segments.
 * Returns '/' for empty or all-falsy inputs.
 */
export function joinPaths(...paths: string[]): string {
  return (
    paths.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/\/$/, '') ||
    '/'
  )
}

/**
 * Type guard to check if a configuration object contains a handler function.
 * Used internally to distinguish between handler configs and plain handlers.
 */
// eslint-disable-next-line typescript/no-unsafe-function-type
export const isHandlerConfig = <T extends { handler: Function }>(
  config: unknown
): config is T => {
  return (
    isObject(config) &&
    'handler' in config &&
    typeof (config as T).handler === 'function'
  )
}

/**
 * Builds a server URL using the WHATWG URL API.
 */
export const buildServerUrl = (
  protocol: string,
  hostname: string,
  port?: number | string
) => {
  const url = new URL(`${protocol}://${hostname}`)
  if (port != null) url.port = String(port)
  return url.toString()
}
