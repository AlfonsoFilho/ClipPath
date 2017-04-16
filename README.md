# ClipPath

Cross-browser clip-path polyfill.

> NOTE: currently only supports polygon values.

## Usage
Vanilla javascript:
```javascript
ClipPath('.target', '5% 5%, 100% 0%, 100% 75%');
```

Or with jQuery
```javascript
$('.target').ClipPath('5% 5%, 100% 0%, 100% 75%');
```

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


## To Do
- Add support for circle, ellipse and inset;