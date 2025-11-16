import type {
  App,
  AppOptions,
  AppServer,
  AppServerOptions
} from '#types/server'

import { H3, serve } from 'h3'
import { registerMiddlewares } from './middlewares'
import { registerPlugins } from './plugins'
import { registerRoutes } from './routes'

/**
 * Generates a localhost URL for the given port.
 */
const genLocalUrl = (port: number | string) => `http://localhost:${port}`

/**
 * Creates an H3 application instance with the provided configuration.
 * Registers plugins, middlewares, and routes in the correct order.
 */
function createApp(options: AppOptions): App {
  const { routes, middlewares, plugins } = options

  // Create H3 App
  const app = new H3()

  // Register all plugins
  registerPlugins(app, plugins)

  // Register all middlewares
  registerMiddlewares(app, middlewares)

  // Register all routes
  registerRoutes(app, routes)

  return app
}

/**
 * Creates and starts an HTTP server with the configured application.
 * This is the main entry point for creating a mock server.
 */
function createAppServer(options: AppServerOptions) {
  const { routes, middlewares, port = 0, plugins } = options

  const app = createApp({
    routes,
    middlewares,
    plugins
  })

  const server = serve(app, { port })

  const actualPort = server.options.port || port

  const appServer: AppServer = {
    raw: server,
    port: actualPort,
    url: genLocalUrl(actualPort),
    close: server.close
  }

  return appServer
}

export { createApp, createAppServer }
