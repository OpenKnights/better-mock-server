import type {
  ParsedRoute,
  RouteConfig,
  RouteHandlerConfig,
  Routes
} from '#types/routes'
import type { App } from '#types/server'
import type { EventHandler } from 'h3'

import { ALL_HTTP_METHOD, HTTP_METHODS } from './constants'
import { isHandlerConfig, isObject, joinPaths } from './util'

/**
 * Checks if the given configuration object is a valid RouteHandlerConfig.
 */
function isRouteHandlerConfig(config: unknown): config is RouteHandlerConfig {
  return isHandlerConfig<RouteHandlerConfig>(config)
}

/**
 * Checks if the given object is a valid RouteConfig.
 * A RouteConfig must have at least one HTTP method property or a children property.
 */
function isRouteConfig(config: unknown): config is RouteConfig {
  if (!isObject(config)) return false

  const cfg = config as RouteConfig
  return (
    cfg.GET !== undefined ||
    cfg.POST !== undefined ||
    cfg.PUT !== undefined ||
    cfg.PATCH !== undefined ||
    cfg.DELETE !== undefined ||
    cfg.children !== undefined
  )
}

/**
 * Parses nested route structures into a flat array of route definitions.
 * Recursively processes route configurations and child routes, resolving
 * full paths and extracting handler configurations.
 */
function parseRoutes(routes: Routes, basePath = ''): ParsedRoute[] {
  const parsedRoutes: ParsedRoute[] = []

  for (const [path, config] of Object.entries(routes)) {
    const fullPath = joinPaths(basePath, path)

    if (isRouteConfig(config)) {
      // Process RouteConfig type

      for (const method of HTTP_METHODS) {
        const methodConfig = config[method]
        if (methodConfig) {
          // Handle HandlerConfig or direct RouteHandler
          if (isRouteHandlerConfig(methodConfig)) {
            parsedRoutes.push({
              route: fullPath,
              method,
              handler: methodConfig.handler,
              options: methodConfig.options
            })
          } else {
            parsedRoutes.push({
              route: fullPath,
              method,
              handler: methodConfig
            })
          }
        }
      }

      // Recursively process child routes
      if (config.children) {
        parsedRoutes.push(...parseRoutes(config.children, fullPath))
      }
    } else {
      // Process RouteHandler type (matches all methods)
      parsedRoutes.push({
        route: fullPath,
        method: ALL_HTTP_METHOD,
        handler: config as EventHandler
      })
    }
  }

  return parsedRoutes
}

/**
 * Defines routes with type safety and auto-completion.
 * This is a simple identity function that provides better TypeScript inference.
 */
const defineRoutes = (routes: Routes) => routes

/**
 * Registers all routes to an H3 application instance.
 * Parses the route configurations and registers them with the appropriate
 * HTTP methods and options.
 */
function registerRoutes(app: App, routes?: Routes): void {
  if (!isObject(routes)) return

  const parsedRoutes = parseRoutes(routes)

  for (const { route, method, handler, options } of parsedRoutes) {
    if (method === ALL_HTTP_METHOD) {
      app.all(route, handler, options)
    } else {
      app.on(method, route, handler, options)
    }
  }
}

export {
  defineRoutes,
  isRouteConfig,
  isRouteHandlerConfig,
  parseRoutes,
  registerRoutes
}
