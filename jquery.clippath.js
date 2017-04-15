(function ($) {

	/**
	 * Generate an unique identifier
	 * @return {String}
	 */
	var getUniqueID = function () {
		return Math.random().toString(36).substring(7);
	},

	/**
	* Checks if css property clip-path supports "polygon()" attribute
	* @return {Boolean} Return TRUE if browser has support
	*/
	var hasSupportToPolygon = (function () {
		var $testEl   = $('<div></div>'),
				testEl    = $testEl[0],
				propValue = "polygon(0 0, 0 0, 0 0, 0 0)";

		testEl.style.clipPath = propValue;

		var result = testEl.style.clipPath === propValue;

		$testEl.remove()

		return result
	})()

	$.fn.ClipPath = function (options) {

		var settings = $.extend({
				path: null
			}, options );

		return this.each(function () {

			var element  = this,
					path 		 = $element.data('clip') || settings.path;

			if(path){
				// Chrome / Safari
				if(typeof(element.style.webkitClipPath) !== "undefined"){

					element.style.webkitClipPath = "polygon(" + path + ")";

				// Unprefixed support
				} else if(hasSupportToPolygon){

					element.style.clipPath = "polygon(" + path + ")";

				// SVG
				} else {
					var $element = $(element),
							polygon  = $element.data('polygon');

					// Remove units from path
					path = path.replace(/px|%|em/g, '')

					if(polygon) {
						polygon.attr('points', path)
					} else {
						var clipPathID = getUniqueID();
						var svg = $('<svg width="0" height="0"><clipPath id="' + clipPathID + '"><polygon points="' + path + '"></polygon></clipPath></svg>')

						$("body").append(svg);

						$element.data('polygon', svg.find('polygon'))

						setTimeout(function () {
							element.style.clipPath = 'url(#' + clipPathID + ')';
						}, 0);
					}
				}

			} else {
				console.error("Clip path not defined.");
			}

		});

	};

})(jQuery);
