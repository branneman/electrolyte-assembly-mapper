'use strict'

var debug = require('debug')('electrolyte-assembly-mapper')
var path = require('path')
var existsSync = require('fs').existsSync
var scripts = require('scripts')

/**
 * @param {String} mapperFile
 * @returns {ElectrolyteAssemblyMapper}
 */
module.exports = function ElectrolyteAssemblyMapperFactory (mapperFile) {
  var mapping

  try {
    var mapperFilePath = path.resolve(mapperFile)
    debug('Loading mapper file:', mapperFilePath)
    mapping = require(mapperFilePath)
  } catch (e) {
    throw new Error('electrolyte-assembly-mapper: Could not find supplied mapper file: ' + mapperFile)
  }

  return function ElectrolyteAssemblyMapper (/* [dir, ...] */) {
    var dirs = [].slice.call(arguments)
    if (dirs.length < 1) {
      throw new Error('electrolyte-assembly-mapper: No directories supplied!')
    }

    return function ElectrolyteAssemblyMapperLoader (id) {
      for (var dirIdx in dirs) {
        if (!dirs.hasOwnProperty(dirIdx)) {
          continue
        }
        var dir = dirs[dirIdx]

        if (mapping[id]) {
          debug('Mapping dependency:', id, 'to:', mapping[id])
          id = mapping[id]
        }

        const file = path.join(path.resolve(dir), id)
        const filepath = scripts.resolve(file)

        if (existsSync(filepath)) {
          debug('Loading dependency:', id, 'from disk:', filepath)
          return require(filepath)
        }
      }
    }
  }
}
