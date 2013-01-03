/*
 *  Project: dsCarousel
 *  Description: Simple carousel to rotate a-spot image
 *  Author: Derrick Showers
 *  License: None
 */

;(function ( $, window, document, undefined ) {

    // Defaults
    var pluginName = "dsCarousel",
        defaults = {
            autoStart: true,
            slideSpeed: 500,
            slideDelay: 3000
        };

    // Plugin Constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
        	this.setProperties();
            this.autoSlide(this.options.autoStart);
        },
        
        setProperties: function() {
        
        	// Set defaults based on CSS properties
	        this.options.width = $(this.element).width();
	        this.options.panels = $("ul > li",this.element).length;
	        this.options.currentPanel = 1;
	        
	        // Create carousel container
	        $("ul",this.element).width(this.options.width * this.options.panels);
	        $("ul > li",this.element).width(this.options.width);
        
        },

        slide: function() {
            
            // Define some variables to make things easier
            var $panelContainer = $("ul",this.element);
            var $panels = $("ul > li",this.element);
            
            // Find out if we're at the end
            var _end = (this.options.currentPanel == this.options.panels) ? true : false;
            
            // Set the new position
            var _newLeft = (_end) ? 0 : '-=' + $panels.width();
                        
            // Animate
            $panelContainer.animate({
	        	left: _newLeft
            }, this.options.slideSpeed);
            
            // Set current panel
            (_end) ? this.options.currentPanel = 1 : this.options.currentPanel++;
            
        },
        
        autoSlide: function(onOff) {
	        
	        // Define some variables
	        var _sliding;
	        var self = this;
	        
	        // Turn on auto slide if true is passed
	        if (onOff) {
		        _sliding = setInterval(function(){
			        self.slide()
		        },this.options.slideDelay);
	        }
	        
	        // Turn off auto slide if false is passed
	        else {
		        clearInterval(_sliding);
	        }
	        
        }
        
    };

    // Plugin Wrapper
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );