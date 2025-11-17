/* eslint-disable no-console */
import { createAppServer, defineRoutes } from '../src'

const routes = defineRoutes({
  '/': {
    GET: () => {
      return 'home'
    }
  },
  '/all': (event: any) => {
    console.log(`🚀 ~ event:`, event)
    return 'all'
  },
  '/hello': {
    GET: () => {
      return 'hello world'
    },
    POST: {
      handler: () => {
        return 'aaa'
      },
      options: {
        meta: { name: '333' }
      }
    }
  }
})

const appServer = createAppServer({
  routes,
  port: 3060
})
console.log(`🚀 ~ appServer:`, appServer)
