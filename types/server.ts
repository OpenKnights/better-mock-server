import type { H3 as H3Instance, serve } from 'h3'
import type { Middlewares } from './middlewares'
import type { Plugins } from './plugins'
import type { Routes } from './routes'

type Server = ReturnType<typeof serve>

type App = H3Instance

interface AppOptions {
  routes?: Routes
  middlewares?: Middlewares
  plugins?: Plugins
}

interface AppServerOptions extends AppOptions {
  routes: Routes
  port?: number
}

interface AppServer {
  /** h3 raw server */
  raw: Server
  port: number | string
  url: string
  close: () => Promise<void>
}

export { App, AppOptions, AppServer, AppServerOptions, Server }
