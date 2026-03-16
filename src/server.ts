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
function createAppServer(options: AppServerOptions): AppServer {
  const {
    routes,
    middlewares,
    plugins,
    port = 0,
    protocol = 'http',
    hostname = '127.0.0.1',
    ...restOptions
  } = options

  const app = createApp({
    routes,
    middlewares,
    plugins
  })

  let lastListenPort: number | undefined

  const server: AppServer = {
    raw: undefined,
    app,
    port: undefined,
    url: undefined,

    /**
     * Starts the server on the specified port.
     * Uses H3's serve() method internally to start the HTTP server.
     */
    listen: async (listenPort?: number): Promise<void> => {
      if (server.raw) {
        await server.close()
      }

      const targetPort = listenPort ?? port
      lastListenPort = Number(targetPort)

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
    },

    /**
     * Stops the server and cleans up resources.
     * Waits for pending requests to complete before shutting down.
     */
    close: async (): Promise<void> => {
      if (server.raw) {
        await server.raw.close()
      }
      server.port = undefined
      server.url = undefined
      server.raw = undefined
    },

    /**
     * Restarts the server by closing and re-listening.
     * Optionally accepts a new port to listen on.
     */
    restart: async (listenPort?: number): Promise<void> => {
      await server.close()
      await server.listen(listenPort ?? lastListenPort)
    }
  }

  return server
}

export { createApp, createAppServer }
