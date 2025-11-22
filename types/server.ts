import type { H3 as H3Instance, serve } from 'h3'
import type { ServerOptions } from 'srvx'

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
 * srvx server options without fetch, middleware, and plugins.
 * These are handled internally by the application.
 */
type srvxServerOptions = Omit<ServerOptions, 'fetch' | 'middleware' | 'plugins'>

/**
 * Configuration options for creating and starting an HTTP server.
 * Extends AppOptions with srvx server-specific settings.
 */
interface AppServerOptions extends AppOptions, srvxServerOptions {
  routes: Routes

  /**
   * Whether to automatically start listening for connections when the server is created.
   * If true, the server will call listen() immediately upon creation.
   * If false (default), you need to manually call server.listen() to start the server.
   */
  autoListen?: boolean
}

/**
 * Application server instance with server information and control methods.
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
  listen: (listenPort?: number) => Promise<void>

  /**
   * Async function to gracefully close the server.
   * Waits for pending requests to complete before shutting down.
   * Resets port, url, and raw to undefined after closing.
   */
  close: () => Promise<void>
}

export {
  App,
  AppOptions,
  AppServer,
  AppServerOptions,
  Server,
  srvxServerOptions
}
