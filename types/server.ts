import type { H3 as H3Instance, serve } from 'h3'
import type { Middlewares } from './middlewares'
import type { Plugins } from './plugins'
import type { Routes } from './routes'

/**
 * The raw server instance returned by H3's serve function.
 * This is the underlying HTTP server that can be used for advanced configurations.
 */
type Server = ReturnType<typeof serve>

/**
 * H3 application instance.
 * This is the core application object that manages routes, middlewares, and plugins.
 */
type App = H3Instance

/**
 * Configuration options for creating an H3 application.
 * All options are optional, allowing for flexible application setup.
 */
interface AppOptions {
  routes?: Routes
  middlewares?: Middlewares
  plugins?: Plugins
}

/**
 * Configuration options for creating and starting an HTTP server.
 * Extends AppOptions with server-specific settings.
 */
interface AppServerOptions extends AppOptions {
  routes: Routes
  port?: number
}

/**
 * Application server instance with server information and control methods.
 */
interface AppServer {
  /**
   * The raw H3 server instance.
   * Provides access to low-level server operations and configuration.
   */
  raw: Server

  /**
   * The port number the server is listening on.
   * Can be a number or string depending on configuration.
   */
  port: number | string

  /**
   * The full URL where the server can be accessed.
   * Format: 'http://localhost:{port}'
   */
  url: string

  /**
   * Async function to gracefully close the server.
   * Waits for pending requests to complete before shutting down.
   */
  close: () => Promise<void>
}

export { App, AppOptions, AppServer, AppServerOptions, Server }
