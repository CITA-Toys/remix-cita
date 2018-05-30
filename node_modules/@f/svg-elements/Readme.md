
# svg-elements

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

A list of SVG elements

## Installation

    $ npm install @f/svg-elements

## Usage

Just exports an array of svg element names. Those element names are:

`animate circle clipPath defs ellipse g line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan use`

## Example

```js
var svgElements = require('@f/svg-elements')

function isSvg (tag) {
  return svgElements.indexOf(tag) !== -1
}
```

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/svg-elements.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/svg-elements
[git-image]: https://img.shields.io/github/tag/micro-js/svg-elements.svg
[git-url]: https://github.com/micro-js/svg-elements
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/svg-elements.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/svg-elements
