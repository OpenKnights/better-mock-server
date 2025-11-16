import type {
  MiddlewareConfig,
  Middlewares,
  ParsedMiddleware
} from '#types/middlewares'
import type { App } from '#types/server'
import type { Middleware } from 'h3'
import { isEmptyArray, isHandlerConfig } from './util'

/**
 * Checks if the given configuration object is a valid MiddlewareConfig.
 */
function isMiddlewareConfig(config: unknown): config is MiddlewareConfig {
  return isHandlerConfig<MiddlewareConfig>(config)
}

/**
 * Parses middleware configurations into a standardized tuple format.
 * Converts various middleware input formats into arrays that can be directly
 * spread into app.use() calls.
 */
function parseMiddlewares(middlewares: Middlewares): ParsedMiddleware[] {
  const parsedMiddlewares: ParsedMiddleware[] = []

  for (const middleware of middlewares) {
    if (isMiddlewareConfig(middleware)) {
      // MiddlewareConfig format
      const { route, handler, options } = middleware

      if (route && options) {
        parsedMiddlewares.push([route, handler, options])
      } else if (route) {
        parsedMiddlewares.push([route, handler])
      } else if (options) {
        parsedMiddlewares.push([handler, options])
      } else {
        parsedMiddlewares.push([handler])
      }
    } else {
      // Direct Middleware function format
      parsedMiddlewares.push([middleware])
    }
  }

  return parsedMiddlewares
}

/**
 * Defines a middleware configuration with type safety.
 * Accepts either a raw middleware function or a full configuration object.
 */
function defineMiddleware(middleware: Middleware): { handler: Middleware }
function defineMiddleware(config: MiddlewareConfig): MiddlewareConfig
function defineMiddleware(
  input: Middleware | MiddlewareConfig
): { handler: Middleware } | MiddlewareConfig {
  // If it's a function, wrap it in an object
  if (typeof input === 'function') {
    return { handler: input }
  }

  // If it's a config object, return directly
  return input
}

/**
 * Registers all middlewares to an H3 application instance.
 * Parses the middleware configurations and applies them to the app in order.
 */
function registerMiddlewares(app: App, middlewares?: Middlewares): void {
  if (isEmptyArray(middlewares)) return

  const parsedMiddlewares = parseMiddlewares(middlewares)

  // Spread the array directly to app.use()
  for (const middleware of parsedMiddlewares) {
    // @ts-expect-error - spreading tuple types
    app.use(...middleware)
  }
}

export {
  defineMiddleware,
  isMiddlewareConfig,
  parseMiddlewares,
  registerMiddlewares
}
