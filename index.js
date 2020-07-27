'use strict'

var diskusagePath = ''
if (process.env.DISKUSAGE_BIN) {
  diskusagePath = process.env.DISKUSAGE_BIN
} else {
  var os = require('os')
  var path = require('path')

  var binaries = Object.assign(Object.create(null), {
    darwin: ['x64'],
    win32: ['x64', 'ia32']
  })

  var platform = process.env.npm_config_platform || os.platform()
  var arch = process.env.npm_config_arch || os.arch()

  diskusagePath = path.join(
    __dirname,
    'bin',
    platform,
    arch,
    'diskusage.node'
  )

  if (!binaries[platform] || binaries[platform].indexOf(arch) === -1) {
    diskusagePath = null
  }
}
exports.defaultPath = diskusagePath

var promise = typeof Promise !== "undefined" ? Promise : require("es6-promise").Promise
var native = {}
if (diskusagePath) {
  try {
    native = require(diskusagePath)
  } catch (error) {
    console.error(error)
  }
}

exports.setNative = function (bin) {
  try {
    native = require(bin)
  } catch (error) {
    console.error(error)
  }
}

exports.check = function(path, callback) {
  if (callback) {
    return check(path, callback)
  }

  return new promise(function (resolve, reject) {
    check(path, function (err, result) {
      err ? reject(err) : resolve(result)
    })
  })
}

exports.checkSync = native.getDiskUsage

function check(path, callback) {
  var result = undefined
  var error = undefined

  try {
    result = native.getDiskUsage(path);
  } catch (error_) {
    error = error_
  }

  callback(error, result)
}
