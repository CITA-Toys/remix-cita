# javascript-serialize
stringify all kinds of js values


## example
```js
var javascriptserialize = require('javascript-serialize')
var Buffer = require('buffer').Buffer

var x = { leaf: 'leaf' }
x['aCircle'] = x

console.log(javascriptserialize(x))
console.log(javascriptserialize(new Buffer(5)))
console.log(javascriptserialize({a:'x', fn:function(x){return 5}}))
console.log(javascriptserialize(new Date))
console.log(javascriptserialize({a:'b',c:[1,2,3],x:{y:{z:['a',{b:'c'}]}}}))
console.log(javascriptserialize(null))
console.log(javascriptserialize(undefined))
console.log(javascriptserialize("hey"))
console.log(javascriptserialize(false))
console.log(javascriptserialize(true))
console.log(javascriptserialize(function asdf () {}))
console.log(javascriptserialize(12))
console.log(javascriptserialize(/asdf/))
console.log(javascriptserialize((function(){ return arguments })(1,true)))
console.log(javascriptserialize([]))
console.log(javascriptserialize(document.createElement('div')))
console.log(javascriptserialize(NaN))
console.log(javascriptserialize(new Error('Ups! Something wrong...')))
```
