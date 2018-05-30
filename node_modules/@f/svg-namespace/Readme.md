
# svg-namespace

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

SVG element namespace string

## Installation

    $ npm install @f/svg-namespace

## Usage

```js
var svgNs = require('@f/svg-namespace')

function createSvgElement (tag) {
  return document.createElementNS(tag, svgNs)
}
```

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/svg-namespace.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/svg-namespace
[git-image]: https://img.shields.io/github/tag/micro-js/svg-namespace.svg
[git-url]: https://github.com/micro-js/svg-namespace
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/svg-namespace.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/svg-namespace
