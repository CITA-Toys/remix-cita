
# is-svg

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Check whether or not a tag name is an SVG element

## Installation

    $ npm install @f/is-svg

## Usage

```js
var isSvg = require('@f/is-svg')

function createElement (tag) {
  return isSvg(tag)
    ? document.createElementNS(tag, svgNs)
    : document.createElement(tag)
}

```

## API

### isSvg(arg)

- `arg` -

**Returns:**

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/is-svg.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/is-svg
[git-image]: https://img.shields.io/github/tag/micro-js/is-svg.svg
[git-url]: https://github.com/micro-js/is-svg
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/is-svg.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/is-svg
