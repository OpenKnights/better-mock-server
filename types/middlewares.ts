import type { Middleware, MiddlewareOptions } from 'h3'

/**
 * Configuration object for defining middleware with optional route and options.
 * Provides fine-grained control over where and how middleware is applied.
 */
interface MiddlewareConfig {
  route?: string
  handler: Middleware
  options?: MiddlewareOptions
}

/**
 * Array of middleware that can be either plain functions or configuration objects.
 * Middlewares are executed in the order they appear in the array.
 */
type Middlewares = Array<Middleware | MiddlewareConfig>

/**
 * Internal representation of a parsed middleware in tuple format.
 * This format can be directly spread into H3's `app.use()` method.
 *
 * The tuple can have one of four formats:
 * - `[Middleware]` - Simple global middleware
 * - `[string, Middleware]` - Middleware for a specific route
 * - `[Middleware, MiddlewareOptions]` - Middleware with options
 * - `[string, Middleware, MiddlewareOptions]` - Middleware with route and options
 */
type ParsedMiddleware =
  | [Middleware]
  | [string, Middleware]
  | [Middleware, MiddlewareOptions]
  | [string, Middleware, MiddlewareOptions]

export type { MiddlewareConfig, Middlewares, ParsedMiddleware }
