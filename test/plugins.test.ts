import { describe, expect, it, vi } from 'vitest'
import { definePlugin, registerPlugins } from '../src/plugins'

describe('plugins', () => {
  describe('definePlugin', () => {
    it('should be a function', () => {
      expect(typeof definePlugin).toBe('function')
    })
  })

  describe('registerPlugins', () => {
    it('should not fail with undefined plugins', () => {
      const app = { register: vi.fn() }
      expect(() => registerPlugins(app as any, undefined)).not.toThrow()
    })

    it('should not fail with empty array', () => {
      const app = { register: vi.fn() }
      expect(() => registerPlugins(app as any, [])).not.toThrow()
    })

    it('should register plugins to app', () => {
      const app = { register: vi.fn() }
      const plugin = { name: 'test-plugin', setup: vi.fn() }

      registerPlugins(app as any, [plugin as any])

      expect(app.register).toHaveBeenCalledWith(plugin)
    })
  })
})
