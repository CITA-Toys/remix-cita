/**
 * Imports
 */

var isSvg = require('..')
var test = require('tape')

/**
 * Tests
 */

test('should work', function (t) {
  t.ok(isSvg('tspan'))
  t.ok(!isSvg('div'))
  t.end()
})
