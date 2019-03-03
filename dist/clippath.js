"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global define */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    factory(exports);
  } else {
    factory(root);
  }
})(window || global, function (global) {
  /**
   * Generate an unique identifier
   * @return {String}
   */
  var getUniqueID = function getUniqueID() {
    return 'clip-path-' + Math.random().toString(36).substring(7);
  };
  /**
   * Checks if css property clip-path supports 'polygon()' attribute
   * @return {Boolean} Return TRUE if browser has support
   */


  var hasSupportToPolygon = function () {
    var testEl = document.createElement('div');
    var propValue = 'polygon(0 0, 0 0, 0 0, 0 0)';
    testEl.style.clipPath = propValue;
    return testEl.style.clipPath === propValue;
  }();
  /**
   * Remove units from path points
   * @param {string} pathPoints
   */


  var removeUnits = function removeUnits(pathPoints) {
    var finishedPathPoints = '';
    var arrayPathPoints = pathPoints.split(', ');

    for (var i = 0; i < arrayPathPoints.length; i++) {
      var item = arrayPathPoints[i];
      var arrayPathPoint = item.split(' ');
      var lN = Number(arrayPathPoint[0]);
      var rN = Number(arrayPathPoint[1]);

      if (lN !== 0) {
        lN = lN / 100;
      }

      if (rN !== 0) {
        rN = rN / 100;
      }

      finishedPathPoints += lN + ' ' + rN;

      if (i < arrayPathPoints.length - 1) {
        finishedPathPoints += ', ';
      }
    }

    pathPoints = finishedPathPoints;
  };
  /**
   * Use SVG polygon
   */


  function SVGPolyfill(element, pathPoints, edge) {
    var svgNamespace = 'http://www.w3.org/2000/svg';
    var clipPath;
    var units = 'px';
    var svgUnits = 'userSpaceOnUse';

    if (pathPoints.indexOf('%') !== -1) {
      units = '%';
      svgUnits = 'objectBoundingBox';
    }

    pathPoints = pathPoints.replace(/px|em|%/g, ''); // Remove units from path

    if (units !== 'px') {
      pathPoints = removeUnits(pathPoints);
    }

    var elClipPathId = element.getAttribute('data-clip-path-id');

    if (elClipPathId) {
      var actualClipPath = document.getElementById(elClipPathId);
      actualClipPath.setAttribute('clipPathUnits', svgUnits);
      var actualPolygon = document.querySelector("#".concat(elClipPathId, " > polygon"));
      actualPolygon.setAttribute('points', pathPoints);
    } else {
      var clipPathID = getUniqueID();
      var svg = document.createElementNS(svgNamespace, 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.setAttribute('data-clip-path-id', clipPathID);
      svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

      if (edge) {
        if (element.getAttribute('class')) {
          svg.setAttribute('class', element.getAttribute('class'));
        }

        element.setAttribute('class', '');
        element.style.width = '100%';
        element.style.height = '100%';
        svg.style.width = '100%';
        svg.style.height = '100%';
        var defs = document.createElementNS(svgNamespace, 'defs');
        clipPath = document.createElementNS(svgNamespace, 'clipPath');
        clipPath.setAttribute('id', clipPathID);
        clipPath.setAttribute('clipPathUnits', svgUnits);
        var polygon = document.createElementNS(svgNamespace, 'polygon');
        polygon.setAttribute('points', pathPoints);
        var foreignObject = document.createElementNS(svgNamespace, 'foreignObject');
        foreignObject.setAttribute('clip-path', 'url(#' + clipPathID + ')');
        foreignObject.setAttribute('width', '100%');
        foreignObject.setAttribute('height', '100%');
        foreignObject.appendChild(element.cloneNode(true));
        svg.appendChild(foreignObject);
        clipPath.appendChild(polygon);
        defs.appendChild(clipPath);
        svg.appendChild(defs);
        element.parentNode.replaceChild(svg, element);
      } else {
        clipPath = document.createElementNS(svgNamespace, 'clipPath');
        clipPath.setAttribute('id', clipPathID);
        clipPath.setAttribute('clipPathUnits', svgUnits);

        var _polygon = document.createElementNS(svgNamespace, 'polygon');

        _polygon.setAttribute('points', pathPoints);

        clipPath.appendChild(_polygon);
        svg.appendChild(clipPath);
        document.body.appendChild(svg);
        element.setAttribute('data-clip-path-id', clipPathID);
        setTimeout(function () {
          element.style.clipPath = 'url(#' + clipPathID + ')';
        }, 0);
      }
    }
  }
  /**
   * Apply clip path
   */


  function applyClipPath(element, pathPoints) {
    var supportPolygon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : hasSupportToPolygon;

    // Chrome / Safari
    if (typeof element.style.webkitClipPath !== 'undefined') {
      element.style.webkitClipPath = 'polygon(' + pathPoints + ')'; // Unprefixed support
    } else if (supportPolygon) {
      element.style.clipPath = 'polygon(' + pathPoints + ')'; // SVG
    } else {
      var isEdge = window.navigator.userAgent.indexOf('Edge') > -1;
      SVGPolyfill(element, pathPoints, isEdge);
    }
  }
  /**
   * Vanilla API
   */


  function ClipPath(selector, pathPoints, supportPolygon) {
    var _applyClipPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : applyClipPath;

    document.querySelectorAll(selector).forEach(function (element) {
      var elementPathPoints = element.getAttribute('data-clip') || pathPoints;

      if (elementPathPoints) {
        _applyClipPath(element, elementPathPoints, supportPolygon);
      }
    });
  }
  /**
   * jQuery API
   */


  if (typeof jQuery !== 'undefined') {
    (function ($, _applyClipPath) {
      $.fn.ClipPath = function (pathStr) {
        // pathStr can be an object due backward compatibility
        // but pathStr must be a string
        if (pathStr === Object(pathStr) && pathStr.path) {
          pathStr = pathStr.path;
        }

        return this.each(function () {
          _applyClipPath(this, $(this).attr('data-clip') || pathStr);
        });
      };
    })(global.jQuery, applyClipPath);
  }

  global.ClipPath = ClipPath;
});