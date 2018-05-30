module.exports = stringify
function stringify (obj) {
  return JSON.stringify(obj, function (key, value) {
    if (value instanceof Function || typeof value == 'function') {
      return value.toString()
    }
    if (value instanceof RegExp) {
      return '_PxEgEr_' + value
    }
    return value
  })
}
