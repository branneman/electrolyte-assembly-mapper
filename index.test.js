'use strict'

var factory = require('./index.js')

describe('electrolyte-assembly-mapper', function () {
  describe('factory', function () {
    it('exports a function ', function () {
      expect(typeof factory).toBe('function')
    })
  })

  describe('destructureArgs', function () {
    var destructureArgs = factory.destructureArgs

    it('can destruct an array', function () {
      var args = ['foo', 'bar']

      var result = destructureArgs(args)

      expect(result).toEqual(['foo', 'bar'])
    })

    it('can destruct an array-like object', function () {
      var args = {
        '0': 'foo',
        '1': 'bar',
        'length': 2
      }

      var result = destructureArgs(args)

      expect(result).toEqual(['foo', 'bar'])
    })

    it('will throw when given an empty array or object', function () {
      var argsArr = []
      var argsObj = {}

      expect(function () {
        destructureArgs(argsArr)
      }).toThrow()

      expect(function () {
        destructureArgs(argsObj)
      }).toThrow()
    })
  })

  describe('map', function () {
    var map = factory.map

    it('returns when mapping exists', function () {
      var mapping = { 'foo': 'bar' }
      var id = 'foo'

      var result = map(mapping, id)

      expect(result).toBe('bar')
    })

    it('returns when mapping exists', function () {
      var mapping = { 'foo': 'bar' }
      var id = 'baz'

      var result = map(mapping, id)

      expect(result).toBe('baz')
    })
  })
})
