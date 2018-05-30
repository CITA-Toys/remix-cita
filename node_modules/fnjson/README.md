# fnjson
stringify objects containing functions

## example
```js
var fnjson = require('fnjson')
var stringify = fnjson.stringify
var parse = fnjson.parse
var clone = fnjson.clone

console.log(JSON.parse(stringify({
  a: function () { return 5 }
})))

//// or to e.g. minimize browserify bundle size

var parse = require('fnjson/source/node_modules/_parse')
var clone = require('fnjson/source/node_modules/_clone')
var stringify = require('fnjson/source/node_modules/_stringify')

```
