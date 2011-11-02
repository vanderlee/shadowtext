/* ShadowText v1.0
 *
 * Copyright (c) 2011 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Creates shadow text that follows the mouse pointer.
 *
 * Possible future directions
 *	colorFar/colorClose
 *	blurEasing,distanceEasing,colorEasing,opacityEasing
 *	Non-orthogonal axis restrictions.
 */

(function($) {
$.widget("vanderlee.shadowtext", {
	options: {
		color:			"#000",
		hideText:		false,
		distance: 		10,
		blurClose:		0,
		blurFar:		10,
		opacityClose:	1,
		opacityFar:		1,
		framerate:		13,
		mouseRange:		500,
		axis:			'',		// 'x', 'y'
		easing:			''
	},

	_create: function() {						
		var widget = this;						
		widget.option(widget.options);
		
		var html = this.element.html();
		var left = this.element.position().left;
		var top = this.element.position().top;
		
		this._span(this.element, this);
		this.element.wrapInner('<span class="ui-shadowtext-shadow" style="display: inline-block;"/>');
		if (!this.options.hideText) {
			this.element.append('<span class="ui-shadowtext-original" style="position:absolute;">'+html+'</span>');
		}
		
		$('html').mousemove( function(event) {
			widget._animate(event.pageX, event.pageY);
		});
		var p = $(this.element).offset();
		this._animate(p.left, p.top);
		
		return this;
	},	
								
	_hypot: function(x, y) {
		return Math.sqrt((x * x) + (y * y));
	},
	
	_span: function(element, widget) {
		if (element.nodeType === 3) {
			var chars = '';
			for (var x = 0; x < element.data.length; ++x) {
				chars += '<span class="ui-shadowtext-symbol" style="color:transparent;">'+element.data.charAt(x)+'</span>';
			}
			$(element).after(chars);
			element.data = '';
		} else {
			$(element).contents().each( function() { widget._span(this, widget); } );
		}
	},	
	
	_scale: function(n, from_min, from_max, to_min, to_max) {
		return ((n - from_min) * (to_max - to_min) / (from_max - from_min)) + to_min;
	},
	
	_px: function(size, widget) {
		if		(size == '0')				return 0;	
		else if (parseFloat(size) == size)	return size;
		else if ($.fn.px != 'undefined')	return $(widget.element).px(size);
		else								return size;
	},
	
	_ease: function(method, fraction) {
		return fraction >= 0? jQuery.easing[method](null, fraction, 0, 1, 1)
							: -jQuery.easing[method](null, -fraction, 0, 1, 1);	
	},
	
	_animationTimer: 0,
	_animate: function(x, y) {
		// Limit number of frames-per-second
		var t = new Date().getTime();
		if (t < this._animationTimer + (1000 / this.options.frameTime)) {
			return;
		}
		this._animationTimer = t;		
		
		var widget = this;		

		// px corrected
		var o_range		= widget._px(widget.options.mouseRange, widget);
		var o_distance	= widget._px(widget.options.distance, widget);
		var o_blurClose	= widget._px(widget.options.blurClose, widget);
		var o_blurFar	= widget._px(widget.options.blurFar, widget);
				
		//TODO This should only be needed when the DOM node was not visible.
		// return !(jQuery(a).is(':hidden') || jQuery(a).parents(':hidden').length);
		var position = $('.ui-shadowtext-shadow', this.element).first().position();
		$('.ui-shadowtext-original', this.element).each( function() {
			$(this).css('left', position.left).css('top', position.top);
		});
				
		$('.ui-shadowtext-symbol', this.element).each( function(index) {		
			h = $(this).height() / -2;
			w = $(this).width() / -2;
		
			var p			= $(this).offset();
			var shadow_x	= widget.options.axis != 'y'? (p.left - x - w) / o_range : 0;
			var shadow_y	= widget.options.axis != 'x'? (p.top  - y - h) / o_range : 0;
			var distance	= widget._hypot(shadow_x, shadow_y);
			
			if (distance > 1.) {
				var scale = 1. / distance;
				shadow_x *= scale;
				shadow_y *= scale;
				distance *= scale;
			}
			
			// apply easing
			if (widget.options.easing) {
				shadow_x = widget._ease(widget.options.easing, shadow_x);
				shadow_y = widget._ease(widget.options.easing, shadow_y);
				distance = widget._ease(widget.options.easing, distance);
			}
			
			var radius		= widget._scale(distance, 0, 1, o_blurClose, o_blurFar);
			var opacity		= widget._scale(distance, 0, 1, widget.options.opacityClose, widget.options.opacityFar);
			var rgb			= widget._colorToRGB(widget.options.color);
			$(this).css('text-shadow',	(shadow_x * o_distance)+'px '
									+	(shadow_y * o_distance)+'px '
									+	radius+'px '
									+	'rgba('+rgb+','+opacity+')');
		});
	},
	
	/* Based on FLOT/jquery.colorhelpers.js
	 * Released under the MIT license by Ole Laursen, October 2009.
	 */
	_colorToRGB: function(color) {
		var m;

		// Look for #fff
		if (m = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color))
			return [parseInt(m[1]+m[1], 16), parseInt(m[2]+m[2], 16), parseInt(m[3]+m[3], 16)];

		// Look for #a0b1c2
		if (m = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color))
			return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];

		// rgb{a}(#,#,#{,#})
		if (m = /^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*(?:,\s*([0-9]+(?:\.[0-9]+)?)\s*)?\)$/.exec(color))
			return m.slice(1,4);
		
		// rgb{a}(%,%,%{,%})
		if (m = /^rgba?\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*(?:,\s*([0-9]+(?:\.[0-9]+)?)\s*)?\)$/.exec(color))
			return [parseFloat(m[1]) * 2.55, parseFloat(m[2]) * 2.55, parseFloat(m[3]) * 2.55];
			
		// Otherwise, we're most likely dealing with a named color
		var name = jQuery.trim(color).toLowerCase();
		if (name == "transparent")
			return [255, 255, 255];
		else {
			return this.colors[name];
		}
	},

	colors: {
		aqua:			[0,255,255],
		azure:			[240,255,255],
		beige:			[245,245,220],
		black:			[0,0,0],
		blue:			[0,0,255],
		brown:			[165,42,42],
		cyan:			[0,255,255],
		darkblue:		[0,0,139],
		darkcyan:		[0,139,139],
		darkgrey:		[169,169,169],
		darkgreen:		[0,100,0],
		darkkhaki:		[189,183,107],
		darkmagenta:	[139,0,139],
		darkolivegreen:	[85,107,47],
		darkorange:		[255,140,0],
		darkorchid:		[153,50,204],
		darkred:		[139,0,0],
		darksalmon:		[233,150,122],
		darkviolet:		[148,0,211],
		fuchsia:		[255,0,255],
		gold:			[255,215,0],
		green:			[0,128,0],
		indigo:			[75,0,130],
		khaki:			[240,230,140],
		lightblue:		[173,216,230],
		lightcyan:		[224,255,255],
		lightgreen:		[144,238,144],
		lightgrey:		[211,211,211],
		lightpink:		[255,182,193],
		lightyellow:	[255,255,224],
		lime:			[0,255,0],
		magenta:		[255,0,255],
		maroon:			[128,0,0],
		navy:			[0,0,128],
		olive:			[128,128,0],
		orange:			[255,165,0],
		pink:			[255,192,203],
		purple:			[128,0,128],
		violet:			[128,0,128],
		red:			[255,0,0],
		silver:			[192,192,192],
		white:			[255,255,255],
		yellow:			[255,255,0]
	}
});

})(jQuery);