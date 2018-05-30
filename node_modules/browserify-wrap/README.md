[browserify-wrap](https://github.com/131/browserify-wrap) is a  _very simple_ browserify plugin to wrap your output bundle with a prefix and/or a suffix


[![Build Status](https://travis-ci.org/131/browserify-wrap.svg?branch=master)](https://travis-ci.org/131/browserify-wrap)
[![Coverage Status](https://coveralls.io/repos/github/131/browserify-wrap/badge.svg?branch=master)](https://coveralls.io/github/131/browserify-wrap?branch=master)
[![Version](https://img.shields.io/npm/v/browserify-wrap.svg)](https://www.npmjs.com/package/browserify-wrap)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)


# API
```
const wrap = require('browserify-wrap');

var b = browserify();

b.plugin(wrap, {
  prefix : "[cool javascript prefix code here];"
});


b.plugin(wrap, {
  suffix : "[cool javascript suffix code here];"
});


b.bundle().pipe(somewhere);
```

## wrap.concat(files [,sep])
As a common suffix might be to add some "raw" files, [browserify-wrap](https://github.com/131/browserify-wrap) provide a tiny helper for this (simple wrapper for map fs.readFileSync)

```
const wrap = require('browserify-wrap');
var suffix = wrap.concat(['file1.js', 'file2.js'], ';');
//suffix is now a concatenation of file1 & file2 (using ';' as separator)
```




# Credits
* [131](https://github.com/131)


# Keywords / shout box
browserify, prefix, suffix, wrapper, plugin, browserify-plugin


