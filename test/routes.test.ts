import type { Routes } from '#types/routes'
import type { RouteOptions } from 'h3'
import { describe, expect, it, vi } from 'vitest'
import { defineRoutes, parseRoutes, registerRoutes } from '../src/routes'

describe('routes', () => {
  describe('parseRoutes', () => {
    it('should parse simple route handler', () => {
      const handler = vi.fn()
      const routes = { '/api': handler }
      const result = parseRoutes(routes)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        route: '/api',
        method: 'ALL',
        handler
      })
    })

    it('should parse RouteConfig with GET method', () => {
      const handler = vi.fn()
      const routes = { '/api': { GET: handler } }
      const result = parseRoutes(routes)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        route: '/api',
        method: 'GET',
        handler
      })
    })

    it('should parse multiple HTTP methods', () => {
      const getHandler = vi.fn()
      const postHandler = vi.fn()
      const routes = {
        '/api': {
          GET: getHandler,
          POST: postHandler
        }
      }
      const result = parseRoutes(routes)

      expect(result).toHaveLength(2)
      expect(result[0].method).toBe('GET')
      expect(result[1].method).toBe('POST')
    })

    it('should parse handler with options', () => {
      const handler = vi.fn()
      const options: RouteOptions = { meta: { name: 'king3' } }
      const routes: Routes = {
        '/api': {
          GET: { handler, options }
        }
      }
      const result = parseRoutes(routes)

      expect(result[0].options).toEqual(options)
    })

    it('should handle nested children routes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const routes = {
        '/api': {
          GET: handler1,
          children: {
            '/users': {
              GET: handler2
            }
          }
        }
      }
      const result = parseRoutes(routes)

      expect(result).toHaveLength(2)
      expect(result[0].route).toBe('/api')
      expect(result[1].route).toBe('/api/users')
    })

    it('should join paths correctly with basePath', () => {
      const handler = vi.fn()
      const routes = { '/users': handler }
      const result = parseRoutes(routes, '/api')

      expect(result[0].route).toBe('/api/users')
    })
  })

  describe('defineRoutes', () => {
    it('should return routes object unchanged', () => {
      const routes = { '/api': vi.fn() }
      const result = defineRoutes(routes)

      expect(result).toBe(routes)
    })
  })

  describe('registerRoutes', () => {
    it('should not fail with undefined routes', () => {
      const app = { all: vi.fn(), on: vi.fn() }
      expect(() => registerRoutes(app as any, undefined)).not.toThrow()
    })

    it('should register ALL method with app.all', () => {
      const app = { all: vi.fn(), on: vi.fn() }
      const handler = vi.fn()

      registerRoutes(app as any, { '/api': handler })

      expect(app.all).toHaveBeenCalledWith('/api', handler, undefined)
    })

    it('should register specific method with app.on', () => {
      const app = { all: vi.fn(), on: vi.fn() }
      const handler = vi.fn()

      registerRoutes(app as any, { '/api': { GET: handler } })

      expect(app.on).toHaveBeenCalledWith('GET', '/api', handler, undefined)
    })
  })
})
