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

const server = createAppServer({
  routes
  // autoListen: true
  // port: 0
})
await server.listen()

console.log(`🚀 ~ server:`, server)
