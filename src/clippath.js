/* global define */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory)
  } else if (typeof exports === 'object') {
    factory(exports)
  } else {
    factory(root)
  }
})(window || global, function (global) {
  /**
   * Generate an unique identifier
   * @return {String}
   */
  const getUniqueID = () => 'clip-path-' + Math.random().toString(36).substring(7)

  /**
   * Checks if css property clip-path supports 'polygon()' attribute
   * @return {Boolean} Return TRUE if browser has support
   */
  const hasSupportToPolygon = (function () {
    const testEl = document.createElement('div')
    const propValue = 'polygon(0 0, 0 0, 0 0, 0 0)'

    testEl.style.clipPath = propValue

    return testEl.style.clipPath === propValue
  })()

  /**
   * Remove units from path points
   * @param {string} pathPoints
   */
  const removeUnits = (pathPoints) => {
    let finishedPathPoints = ''
    let arrayPathPoints = pathPoints.split(', ')

    for (let i = 0; i < arrayPathPoints.length; i++) {
      const item = arrayPathPoints[i]
      const arrayPathPoint = item.split(' ')
      let lN = Number(arrayPathPoint[0])
      let rN = Number(arrayPathPoint[1])

      if (lN !== 0) {
        lN = lN / 100
      }
      if (rN !== 0) {
        rN = rN / 100
      }

      finishedPathPoints += lN + ' ' + rN

      if (i < arrayPathPoints.length - 1) {
        finishedPathPoints += ', '
      }
    }

    pathPoints = finishedPathPoints
  }

  /**
   * Use SVG polygon
   */
  function SVGPolyfill(element, pathPoints, edge) {
    const svgNamespace = 'http://www.w3.org/2000/svg'

    let clipPath
    let units = 'px'
    let svgUnits = 'userSpaceOnUse'

    if (pathPoints.indexOf('%') !== -1) {
      units = '%'
      svgUnits = 'objectBoundingBox'
    }

    pathPoints = pathPoints.replace(/px|em|%/g, '')

    // Remove units from path
    if (units !== 'px') {
      pathPoints = removeUnits(pathPoints)
    }

    const elClipPathId = element.getAttribute('data-clip-path-id')

    if (elClipPathId) {
      const actualClipPath = document.getElementById(elClipPathId)
      actualClipPath.setAttribute('clipPathUnits', svgUnits)
      const actualPolygon = document.querySelector(`#${elClipPathId} > polygon`)
      actualPolygon.setAttribute('points', pathPoints)
    } else {
      const clipPathID = getUniqueID()

      const svg = document.createElementNS(svgNamespace, 'svg')
      svg.setAttribute('width', '0')
      svg.setAttribute('height', '0')
      svg.setAttribute('data-clip-path-id', clipPathID)
      svg.setAttributeNS(
        'http://www.w3.org/2000/xmlns/',
        'xmlns:xlink',
        'http://www.w3.org/1999/xlink'
      )

      if (edge) {
        console.log('EDGE>>>')
        if (element.getAttribute('class')) {
          svg.setAttribute('class', element.getAttribute('class'))
        }
        element.setAttribute('class', '')
        element.style.width = '100%'
        element.style.height = '100%'
        svg.style.width = '100%'
        svg.style.height = '100%'

        const defs = document.createElementNS(svgNamespace, 'defs')

        clipPath = document.createElementNS(
          svgNamespace,
          'clipPath'
        )
        clipPath.setAttribute('id', clipPathID)
        clipPath.setAttribute('clipPathUnits', svgUnits)

        const polygon = document.createElementNS(
          svgNamespace,
          'polygon'
        )
        polygon.setAttribute('points', pathPoints)

        const foreignObject = document.createElementNS(
          svgNamespace,
          'foreignObject'
        )
        foreignObject.setAttribute('clip-path', 'url(#' + clipPathID + ')')
        foreignObject.setAttribute('width', '100%')
        foreignObject.setAttribute('height', '100%')

        foreignObject.appendChild(element.cloneNode(true))
        svg.appendChild(foreignObject)

        clipPath.appendChild(polygon)
        defs.appendChild(clipPath)
        svg.appendChild(defs)

        element.parentNode.replaceChild(svg, element)
      } else {
        clipPath = document.createElementNS(
          svgNamespace,
          'clipPath'
        )
        clipPath.setAttribute('id', clipPathID)
        clipPath.setAttribute('clipPathUnits', svgUnits)

        const polygon = document.createElementNS(
          svgNamespace,
          'polygon'
        )
        polygon.setAttribute('points', pathPoints)

        clipPath.appendChild(polygon)
        svg.appendChild(clipPath)
        document.body.appendChild(svg)
        element.setAttribute('data-clip-path-id', clipPathID)

        setTimeout(function () {
          element.style.clipPath = 'url(#' + clipPathID + ')'
        }, 0)
      }
    }
  }

  /**
   * Apply clip path
   */
  function applyClipPath(element, pathPoints, supportPolygon, userAgent) {
    // Chrome / Safari
    if (typeof element.style.webkitClipPath !== 'undefined') {
      element.style.webkitClipPath = 'polygon(' + pathPoints + ')'

      // Unprefixed support
    } else if (supportPolygon) {
      element.style.clipPath = 'polygon(' + pathPoints + ')'

      // SVG
    } else {
      const isEdge = userAgent.indexOf('Edge') > -1
      console.log('is edfe', isEdge, userAgent)
      SVGPolyfill(element, pathPoints, isEdge)
    }
  }

  /**
   * Vanilla API
   */
  function ClipPath(selector, pathPoints, {
    _supportPolygon = hasSupportToPolygon,
    _applyClipPath = applyClipPath,
    _userAgent = window.navigator.userAgent
  } = {}) {
    document.querySelectorAll(selector).forEach((element) => {
      const elementPathPoints = element.getAttribute('data-clip') || pathPoints
      if (elementPathPoints) {
        _applyClipPath(element, elementPathPoints, _supportPolygon, _userAgent)
      }
    })
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
          pathStr = pathStr.path
        }

        return this.each(function () {
          _applyClipPath(this, $(this).attr('data-clip') || pathStr)
        })
      }
    })(global.jQuery, applyClipPath)
  }

  global.ClipPath = ClipPath
})
