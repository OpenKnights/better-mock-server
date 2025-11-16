import { describe, expect, it } from 'vitest'
import {
  isArray,
  isEmptyArray,
  isHandlerConfig,
  isObject,
  joinPaths
} from '../src/util'

describe('util', () => {
  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject([])).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isEmptyArray', () => {
    it('should return true for empty values', () => {
      expect(isEmptyArray(undefined)).toBe(true)
      expect(isEmptyArray(null)).toBe(true)
      expect(isEmptyArray([])).toBe(true)
    })

    it('should return false for non-empty arrays', () => {
      expect(isEmptyArray([1])).toBe(false)
      expect(isEmptyArray([1, 2, 3])).toBe(false)
    })

    it('should return true for non-array values', () => {
      expect(isEmptyArray({})).toBe(true)
      expect(isEmptyArray('string')).toBe(true)
      expect(isEmptyArray(0)).toBe(true)
    })
  })

  describe('joinPaths', () => {
    it('should join simple paths', () => {
      expect(joinPaths('/api', 'users')).toBe('/api/users')
      expect(joinPaths('api', 'users')).toBe('api/users')
    })

    it('should handle leading and trailing slashes', () => {
      expect(joinPaths('/api/', '/users/')).toBe('/api/users')
      expect(joinPaths('/api/', 'users')).toBe('/api/users')
    })

    it('should remove duplicate slashes', () => {
      expect(joinPaths('/api//', 'users')).toBe('/api/users')
      expect(joinPaths('/api', '//users')).toBe('/api/users')
    })

    it('should handle empty segments', () => {
      expect(joinPaths('/api', '', 'users')).toBe('/api/users')
      expect(joinPaths('', 'api', '')).toBe('api')
    })

    it('should return "/" for all empty inputs', () => {
      expect(joinPaths('', '', '')).toBe('/')
      expect(joinPaths()).toBe('/')
    })

    it('should join multiple path segments', () => {
      expect(joinPaths('/api', 'v1', 'users', 'list')).toBe(
        '/api/v1/users/list'
      )
    })
  })

  describe('isHandlerConfig', () => {
    it('should return true for objects with handler function', () => {
      const config = { handler: () => {} }
      expect(isHandlerConfig(config)).toBe(true)
    })

    it('should return true for objects with handler and other properties', () => {
      const config = { handler: () => {}, route: '/api' }
      expect(isHandlerConfig(config)).toBe(true)
    })

    it('should return false for objects without handler', () => {
      expect(isHandlerConfig({ route: '/api' })).toBe(false)
      expect(isHandlerConfig({})).toBe(false)
    })

    it('should return false for non-objects', () => {
      expect(isHandlerConfig(null)).toBe(false)
      expect(isHandlerConfig(undefined)).toBe(false)
      expect(isHandlerConfig(() => {})).toBe(false)
    })

    it('should return false when handler is not a function', () => {
      expect(isHandlerConfig({ handler: 'not a function' })).toBe(false)
      expect(isHandlerConfig({ handler: null })).toBe(false)
    })
  })
})
