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
import { buildServerUrl } from './util'
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
 * Creates an HTTP server instance with the configured application.
 */
function createAppServer<T extends AppServerOptions>(
  options: T
): T extends { autoListen: true } ? Promise<AppServer> : AppServer
function createAppServer(
  options: AppServerOptions
): AppServer | Promise<AppServer> {
  const {
    routes,
    middlewares,
    plugins,
    port = 0,
    autoListen = false,
    protocol = 'http',
    hostname = 'localhost',
    ...restOptions
  } = options

  const server = {} as AppServer

  server.app = createApp({
    routes,
    middlewares,
    plugins
  })

  /**
   * Starts the server on the specified port.
   * Uses H3's serve() method internally to start the HTTP server.
   */
  server.listen = async (listenPort?: number): Promise<void> => {
    const targetPort = listenPort ?? port

    server.raw = serve(server.app, {
      port: targetPort,
      hostname,
      protocol,
      ...restOptions
    })

    // Wait for the server to start
    await server.raw.ready()

    // Parse port and other information from URL
    const rawUrl = new URL(server.raw.url as string)
    const rawProtocol = rawUrl.protocol
    const rawHostname = rawUrl.hostname
    const rawPort = Number.parseInt(rawUrl.port, 10)

    server.port = rawPort
    server.url = buildServerUrl(rawProtocol, rawHostname, rawPort)
  }

  /**
   * Stops the server and cleans up resources.
   * Waits for pending requests to complete before shutting down.
   */
  server.close = async (): Promise<void> => {
    if (server.raw) {
      await server.raw.close()
    }
    server.port = undefined
    server.url = undefined
    server.raw = undefined
  }

  // Auto listen if requested
  if (autoListen) {
    return server.listen().then(() => server)
  }

  return server
}

/**
 * Helper function to define server options with proper type inference.
 * Preserves literal types for autoListen, enabling accurate return type inference.
 *
 */
function defineServerOptions<T extends AppServerOptions>(options: T): T {
  return options
}

export { createApp, createAppServer, defineServerOptions }
