'use strict'

var debug = require('debug')('electrolyte-assembly-mapper')
var existsSync = require('fs').existsSync
var path = require('path')
var scripts = require('scripts')

module.exports = factory
module.exports.dirLoader = dirLoader
module.exports.mapperLoader = mapperLoader
module.exports.loadAll = loadAll
module.exports.loadOne = loadOne
module.exports.destructureArgs = destructureArgs
module.exports.map = map

function factory (mapperFile) {
  var mapperFilePath = path.resolve(mapperFile)
  if (existsSync(mapperFilePath)) {
    debug('Loading mapper file:', mapperFilePath)
    var mapping = require(mapperFilePath)
    return mapperLoader(mapping)
  }
  debug('Not using supplied mapper file: ' + mapperFile)
  return dirLoader
}

function dirLoader (/* [dirs, ...] */) {
  var dirs = destructureArgs(arguments)
  return function (id) {
    return loadAll(dirs, id)
  }
}

function mapperLoader (mapping) {
  return function mapperLoader (/* [dirs, ...] */) {
    var dirs = destructureArgs(arguments)
    return function (id) {
      return loadAll(dirs, map(mapping, id))
    }
  }
}

function loadAll (dirs, id) {
  for (var i = 0, len = dirs.length; i < len; i++) {
    if (!dirs.hasOwnProperty(i)) {
      continue
    }
    var dir = dirs[i]

    var mod = loadOne(dir, id)
    if (mod) {
      return mod
    }
  }
}

function loadOne (dir, id) {
  var file = path.join(path.resolve(dir), id)
  var filepath = scripts.resolve(file)

  if (existsSync(filepath)) {
    debug('Loading dependency:', id, 'from disk:', filepath)
    return require(filepath)
  }
  debug('Could not find dependency:', id, 'on disk:', filepath)
}

function destructureArgs (args) {
  var dirs = [].slice.call(args)
  if (dirs.length < 1) {
    throw new Error('electrolyte-assembly-mapper: No directories supplied!')
  }
  return dirs
}

function map (mapping, id) {
  if (mapping[id]) {
    debug('Mapping dependency:', id, 'to:', mapping[id])
    return mapping[id]
  }
  return id
}
