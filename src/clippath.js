
/**
 * Generate an unique identifier
 * @return {String}
 */
function getUniqueID() {
  return 'clip-path-' + Math.random().toString(36).substring(7);
}

/**
* Checks if css property clip-path supports 'polygon()' attribute
* @return {Boolean} Return TRUE if browser has support
*/
var hasSupportToPolygon = (function () {
  
  var testEl    = document.createElement('div');
  var propValue = 'polygon(0 0, 0 0, 0 0, 0 0)';

  testEl.style.clipPath = propValue;

  return testEl.style.clipPath === propValue;

})();

/**
* Use SVG polygon
*/
function SVGPolyfill(element, pathPoints) {

  // Remove units from path
  pathPoints = pathPoints.replace(/px|%|em/g, '');
  var elClipPathId = element.getAttribute('data-clip-path-id');

  if(elClipPathId) {
    var actualPolygon = document.querySelector('#' + elClipPathId + ' > polygon');
    actualPolygon.setAttribute('points', pathPoints);
  } else {
    var clipPathID = getUniqueID();

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

    var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', clipPathID);

    var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', pathPoints);

    clipPath.appendChild(polygon);
    svg.appendChild(clipPath);
    document.body.appendChild(svg);

    element.setAttribute('data-clip-path-id', clipPathID);

    setTimeout(function () {
      element.style.clipPath = 'url(#' + clipPathID + ')';
    }, 0);
  }
}

/**
* Apply clip path
*/
function applyClipPath(element, pathPoints, _supportPolygon) {

  _supportPolygon = typeof _supportPolygon !== 'undefined' ? _supportPolygon : hasSupportToPolygon;

  // Chrome / Safari
  if(typeof(element.style.webkitClipPath) !== 'undefined'){

    element.style.webkitClipPath = 'polygon(' + pathPoints + ')';
  
  // Unprefixed support
  } else if(_supportPolygon){

    element.style.clipPath = 'polygon(' + pathPoints + ')';
  
  // SVG
  } else {
    SVGPolyfill(element, pathPoints);
  }
}

/**
* Main function
*/
function ClipPath(selector, pathPoints, supportPolygon) {

  if(!selector) {
    console.error('Missing selector');
    return false;
  }

  var nodeList = document.querySelectorAll(selector || '');
  
  Array.prototype.forEach.call(nodeList, function(element) {

    pathPoints = pathPoints || element.getAttribute('data-clip');

    if(pathPoints) {
      applyClipPath(element, pathPoints, supportPolygon);
    } else {
      console.error('Missing clip-path parameters. Please check ClipPath() arguments or data-clip attribute.', element);
    }

  });

}

ClipPath.applyClipPath = applyClipPath;

if(typeof jQuery !== 'undefined') {
  (function($, _ClipPath){
    $.fn.ClipPath = function(pathStr) {

      // pathStr can be an object due backward compatibility
      // but pathStr must be a string
      if(pathStr === Object(pathStr) && pathStr.path) {
        pathStr = pathStr.path;
      }

      return this.each(function() {
        _ClipPath.applyClipPath(this, $(this).attr('data-clip') || pathStr);
      });

    };
  })(jQuery, ClipPath);
}

exports.ClipPath = ClipPath;