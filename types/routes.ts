import type { EventHandler, RouteOptions } from 'h3'

/**
 * Standard HTTP methods supported by the server.
 * These methods correspond to the common RESTful API operations.
 */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Special HTTP method constant that matches all HTTP methods.
 * When used, the route handler will respond to any HTTP method.
 */
type AllHTTPMethod = 'ALL'

/**
 * Configuration object for a route handler with additional options.
 * Allows you to specify route-specific behaviors like lazy loading.
 */
interface RouteHandlerConfig {
  options?: RouteOptions
  handler: EventHandler
}

/**
 * A route handler can be either a simple H3 event handler function
 * or a configuration object with handler and options.
 */
type RouteHandler = EventHandler | RouteHandlerConfig

/**
 * Configuration object for defining routes with specific HTTP methods.
 * Supports all standard HTTP methods and nested child routes.
 */
interface RouteConfig {
  GET?: RouteHandler
  POST?: RouteHandler
  PUT?: RouteHandler
  PATCH?: RouteHandler
  DELETE?: RouteHandler
  children?: Routes
}

/**
 * Routes definition object mapping URL paths to handlers or configurations.
 *
 * - Keys are URL paths (can include parameters like `/:id`)
 * - Values can be:
 *   - A simple handler function (handles all HTTP methods)
 *   - A RouteConfig object (defines method-specific handlers)
 */
interface Routes {
  [route: string]: RouteHandler | RouteConfig
}

/**
 * Internal representation of a parsed route after processing.
 * Used by the route registration system to apply routes to the H3 app.
 */
interface ParsedRoute {
  route: string
  method: HTTPMethod | AllHTTPMethod
  handler: EventHandler
  options?: RouteOptions
}

export type {
  AllHTTPMethod,
  HTTPMethod,
  ParsedRoute,
  RouteConfig,
  RouteHandler,
  RouteHandlerConfig,
  Routes
}
