import type {
  App,
  AppOptions,
  AppServer,
  AppServerOptions
} from '#types/server'

import { H3 } from 'h3'
import { serve } from 'srvx'
import { registerMiddlewares } from './middlewares'
import { registerPlugins } from './plugins'
import { registerRoutes } from './routes'

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
 * The server can be started immediately or manually via the listen() method.
 */
function createAppServer(options: AppServerOptions): AppServer {
  const {
    routes,
    middlewares,
    plugins,
    port = 0,
    autoListen = false,
    protocol = 'http',
    hostname = 'localhost'
  } = options

  const server = {} as AppServer

  server.app = createApp({
    routes,
    middlewares,
    plugins
  })

  /**
   * Starts the mock server on the specified port.
   * Uses H3's serve() method internally to start the HTTP server.
   */
  server.listen = (listenPort?: number): void => {
    const targetPort = listenPort ?? port

    server.raw = serve(server.app, { port: targetPort, hostname, protocol })

    // export function serve(app: H3, options?: Omit<ServerOptions, "fetch">): Server {
    //   freezeApp(app);
    //   return srvxServe({ fetch: app.fetch, ...options });
    // }

    const {
      raw,
      raw: { runtime }
    } = server
    // console.log('111', server.raw.url)
    // request.runtime?.name
    // console.log(`🚀 ~ request.runtime?.name:`, server.raw.runtime)
    // const {} = (raw as Record<string, any>)[runtime]

    // const underlyingServer = getUnderlyingServer(raw, runtime)
    // console.log(`🚀 ~ underlyingServer:`, underlyingServer)

    // raw.port
    console.log(`🚀 ~ raw:`, raw)
    console.log(`🚀 ~ raw-url:`, raw.url)

    // server.port = rawPort
    // server.url = buildServerUrl(rawProtocol, rawHostname, targetPort)
  }

  /**
   * Stops the mock server and cleans up resources.
   * Waits for pending requests to complete before shutting down.
   */
  server.close = async (): Promise<void> => {
    if (server.raw) {
      await server.raw.close()
    }
    server.port = undefined as unknown as number
    server.url = undefined as unknown as string
  }

  // Auto listen if requested
  if (autoListen) {
    server.listen()
  }

  return server
}

export { createApp, createAppServer }
