/**
 * Modules
 */

var svgElements = require('@f/svg-elements')
var has = require('@f/has')

/**
 * Expose isSvg
 */

module.exports = isSvg['default'] = isSvg

/**
 * Vars
 */

var svgMap = svgElements
  .reduce(function (acc, name) {
    acc[name] = true
    return acc
  }, {})

/**
 * isSvg
 */

function isSvg (name) {
  return has(name, svgMap)
}
