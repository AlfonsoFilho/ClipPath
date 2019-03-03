
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
function SVGPolyfill(element, pathPoints, edge) {

	var units = 'px';
	var svgUnits = 'userSpaceOnUse';
	if(pathPoints.indexOf('%') !== -1){
		units = '%';
		svgUnits = 'objectBoundingBox';
	}
	pathPoints = pathPoints.replace(/px|em|%/g, '');

	// Remove units from path
	if(units !== 'px'){
		var finishedPathPoints = '';
		var arrayPathPoints = pathPoints.split(', ');
		for (var i = 0; i < arrayPathPoints.length; i++)
		{
			var item = arrayPathPoints[i];
			var arrayPathPoint = item.split(' ');
			var lN = Number(arrayPathPoint[0]), rN = Number(arrayPathPoint[1]);
			if(lN !== 0){
				lN = (lN/100);
			}
			if(rN !== 0){
				rN = (rN/100);
			}
			finishedPathPoints += lN+' '+rN;
			if(i < (arrayPathPoints.length - 1)){
				finishedPathPoints += ', ';
			}
		}
		pathPoints = finishedPathPoints;
	}



	var elClipPathId = element.getAttribute('data-clip-path-id');
	if(elClipPathId) {
		var actualClipPath = document.getElementById(elClipPathId);
		actualClipPath.setAttribute('clipPathUnits', svgUnits);
		var actualPolygon = document.querySelector('#' + elClipPathId + ' > polygon');
		actualPolygon.setAttribute('points', pathPoints);
	} else {
		var clipPathID = getUniqueID();

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '0');
		svg.setAttribute('height', '0');
		svg.setAttribute('data-clip-path-id', clipPathID);
		svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

		if(edge){
			if(element.getAttribute('class')){
				svg.setAttribute('class', element.getAttribute('class'));
			}
			element.setAttribute('class', '');
			element.style.width = "100%";
			element.style.height = "100%";
			svg.style.width = "100%";
			svg.style.height = "100%";

			var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

			var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
			clipPath.setAttribute('id', clipPathID);
			clipPath.setAttribute('clipPathUnits', svgUnits);

			var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
			polygon.setAttribute('points', pathPoints);

			var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
			foreignObject.setAttribute('clip-path', 'url(#'+clipPathID+')');
			foreignObject.setAttribute('width', '100%');
			foreignObject.setAttribute('height', '100%');

			foreignObject.appendChild(element.cloneNode(true));
			svg.appendChild(foreignObject);

			clipPath.appendChild(polygon);
			defs.appendChild(clipPath);
			svg.appendChild(defs);

			element.parentNode.replaceChild(svg, element);
		}else{
			var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
			clipPath.setAttribute('id', clipPathID);

			clipPath.setAttribute('clipPathUnits', svgUnits);

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
		//Edge
		if(window.navigator.userAgent.indexOf("Edge") > -1){

			SVGPolyfill(element, pathPoints, true);

			//Other
		}else{
			SVGPolyfill(element, pathPoints);
		}
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

		var elementPathPoints = element.getAttribute('data-clip') || pathPoints;

		if(elementPathPoints) {
			applyClipPath(element, elementPathPoints, supportPolygon);
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
