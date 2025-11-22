/* eslint-disable no-console */
import { redirect } from 'h3'

import { createAppServer, defineRoutes } from '../src'

const routes = defineRoutes({
  '/': {
    GET: () => {
      return redirect(`http://localhost:${3060}/api/hello`)
    }
  },
  '/api': {
    children: {
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
    }
  },
  '/all': (event: any) => {
    console.log(`🚀 ~ event:`, event)
    return 'all'
  }
})

const server = createAppServer({
  routes,
  // autoListen: true
  port: 3060
})
await server.listen()

console.log(`🚀 ~ server:`, server)
