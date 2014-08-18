(function ($) {
	
	$.fn.ClipPath = function (options) {

		var settings = $.extend({
				path: null
			}, options ),			

			/**
			 * Generate an unique identifier
			 * @return {String}
			 */
			getUniqueID = function () {
				return  Math.random().toString(36).substring(7);
			},

			/**
			 * Checks if css property clip-path supports "polygon()" attribute
			 * @return {Boolean} Return TRUE if browser has support
			 */
			hasSupportToPolygon = (function () {
				var testEl = $('<div></div>')[0],
					propValue = "polygon(0 0, 0 0, 0 0, 0 0)";

				testEl.style.clipPath = propValue;

				return testEl.style.clipPath === propValue;
			})();

		
		return this.each(function () {
			
			var $this = $(this),
				path = $this.data('clip') || settings.path,
				element = $this[0],
				clipPathID = getUniqueID();

			if(path){
				
				// Chrome / Safari
				if(typeof(element.style.webkitClipPath) !== "undefined"){ 

					element.style.webkitClipPath = "polygon(" + path + ")";

				// Unprefixed support
				} else if(hasSupportToPolygon){

					element.style.clipPath = "polygon(" + path + ")";

				// SVG
				} else { 
					// Create SVG tag
					$("body").append('<svg width="0" height="0"><clipPath id="' + clipPathID + '"><polygon points="' + path + '"></polygon></clipPath></svg>');
					// 
					element.style.clipPath = 'url(#' + clipPathID + ')';

				}

			} else {
				console.error("Clip path not defined.");
			}

		});

	};

})(jQuery);