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
  autoListen?: boolean
  hostname?: string
  protocol?: 'http' | 'https'
}

/**
 * Application server instance with server information and control methods.
 *
 * The server is created in a dormant state and must be explicitly started
 * by calling the `listen()` method. This allows for flexible server lifecycle
 * management and testing scenarios.
 */
interface AppServer {
  /**
   * The raw H3 server instance returned by serve().
   * Provides access to low-level server operations and configuration.
   * Undefined until `listen()` is called.
   */
  raw: Server | undefined

  /**
   * The H3 application instance.
   * Provides access to the configured H3 app with all routes, middlewares, and plugins.
   */
  app: App

  /**
   * The port number the server is listening on.
   * Undefined until `listen()` is called successfully.
   * Can be a number or string depending on configuration.
   */
  port: number | string | undefined

  /**
   * The full URL where the server can be accessed.
   * Undefined until `listen()` is called successfully.
   * Format: 'http://localhost:{port}'
   */
  url: string | undefined

  /**
   * Starts the mock server on the specified port.
   * Uses H3's serve() method internally to start the HTTP server.
   *
   * @param {number} [listenPort] - Optional port to override the default
   */
  listen: (listenPort?: number) => void

  /**
   * Async function to gracefully close the server.
   * Waits for pending requests to complete before shutting down.
   * Resets port, url, and raw to undefined after closing.
   */
  close: () => Promise<void>
}

export { App, AppOptions, AppServer, AppServerOptions, Server }
