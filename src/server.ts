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

const genLocalUrl = (port: number | string) => `http://localhost:${port}`

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

function createAppServer(options: AppServerOptions) {
  const { routes, middlewares, port = 0, plugins } = options

  const app = createApp({
    routes,
    middlewares,
    plugins
  })

  const server = serve(app, { port })

  const appServer: AppServer = {
    raw: server,
    port: server.options.port || port,
    url: server.url || genLocalUrl(server.options.port || port),
    close: server.close
  }

  return appServer
}

export { createApp, createAppServer }
