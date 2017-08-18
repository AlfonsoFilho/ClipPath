# ClipPath
[![Build Status](https://travis-ci.org/AlfonsoFilho/ClipPath.svg?branch=master)](https://travis-ci.org/AlfonsoFilho/ClipPath)

Cross-browser clip-path polyfill.

> NOTE: currently only supports polygon values.

## Usage
Vanilla javascript:
```javascript
ClipPath('.target', '5% 5%, 100% 0%, 100% 75%');
```

With jQuery:
```javascript
$('.target').ClipPath('5% 5%, 100% 0%, 100% 75%');
```
> NOTE: for backward compatibility reasons, jquery implementation also accepts an object as an argument. In this case, a path property is expected. This alternative should be avoided since it is deprecated.

```javascript
// Using object instead string
// @deprecated 
$('.image').ClipPath({path: '5% 5%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%'}); 
```

Or can use html element's attribute to set clip points:
```html
<!-- In the html -->
<img id='clipped' data-clip="5% 5%, 100% 0%, 100% 75%" src="https://unsplash.it/100/100/?random" />
```
```javascript
// In the javascript
ClipPath('#clipped');
```

See [example folder](https://github.com/AlfonsoFilho/ClipPath/tree/master/example) to view more usage cases.

### API
<pre>
ClipPath(query_selector, polygon_value)
</pre>

**query_selector**: string with css query selector. e.g.:`#image img.test-class`

**polygon_value**: string with polygon points in the format `'x y, x y, xy ...'`. 
e.g.:
```javascript
ClipPath('.target', '10px 10px, 15px 10px, 15px 15px, 10px 15px');
```

## Test and Build

Clone the project and install dependencies:
```sh
$ git clone git@github.com:AlfonsoFilho/ClipPath.git
$ cd ClipPath && npm install
```

To test:
```sh
$ npm test
```

To test and watch file changes
```sh
$ npm run test:watch
```

To Build:
```sh
$ npm start
```
or
```sh
$ npm run build
```

## To Do
- Add support for circle, ellipse and inset;