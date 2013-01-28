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
        	// Global self variable
        	self = this;
        	
        	// Init functions
        	this.setProperties();
        	this.listeners();
            this.autoSlide(this.options.autoStart);
            this.progress();
        },
        
        setProperties: function() {
        
        	// Set defaults based on CSS properties
	        this.options.width = $(this.element).width();
	        this.options.panels = $("ul#carousel > li",this.element).length;
	        this.options.panelContainer = $("ul#carousel",this.element);
	        this.options.currentPanel = 1;
	        
	        // Create carousel container
	        $("ul#carousel",this.element).width(this.options.width * (this.options.panels + 1));
	        $("ul#carousel > li",this.element).width(this.options.width);
        
        },

        slide: function(direction) {
        
        	// Define some variables to make things easier
            var $panels = $("ul#carousel > li",this.element);
        	
        	// Set panel number
        	(direction == "next") ? self.options.currentPanel++ : self.options.currentPanel --;
            
            var _uhOh = ((direction == "next" && self.options.currentPanel > self.options.panels) ||
            	(direction == "prev" && self.options.currentPanel < 1)) ? true : false;
            	
            // Add panel to begining or end depending upon direction
            if (_uhOh) {
	            
	            // Clone first/last panel and place it at begining or end
	            var $newPanel = (direction == "next") ? $($panels[0]) : $($panels.get(self.options.panels - 1));
	            (direction == "next") ? $newPanel.clone().appendTo(self.options.panelContainer) :
	            	$newPanel.clone().prependTo(self.options.panelContainer);
	            
	            // Reset left position after cloning
	            if (direction == "prev") {
		            self.options.panelContainer.css('left',-self.options.width);
	            }
            }
                                    
            // Animate
            self.options.panelContainer.stop().animate({
	        	left: (direction == "next") ? "-=" + self.options.width : "+=" + self.options.width
            }, this.options.slideSpeed, function() {
                        
            	// Reset beginning or end
            	if (_uhOh) {
		           	if (direction == "next") {
			           	self.options.panelContainer.css('left',0)
			           	self.options.panelContainer.children("li:last").remove();
			           	self.options.currentPanel = 1;
		           	} else {
		           		self.options.panelContainer.css('left',-((self.options.panels - 1) * self.options.width))
			           	self.options.panelContainer.children("li:first").remove();
			           	self.options.currentPanel = self.options.panels;
		           	}
		        }
		        
		        // Track Progress
		        self.progress();
		        
            });
            
        },
        
        skipTo: function(panelNumber) {
	        
	        // Turn off auto
	        this.autoSlide(false);
	        
	        // Figure out panel postiion
	        var _newPos = -(panelNumber * this.options.width);
	        
	        // Animate to it
	        self.options.panelContainer.animate({
	        	left: _newPos
            }, this.options.slideSpeed);
            
            // Update panel number and track progress
            self.options.currentPanel = panelNumber + 1;
            self.progress();
	        
        },
        
        autoSlide: function(onOff) {

	        // Turn on auto slide if true is passed
	        if (onOff) {
		        self.options.sliding = setInterval(function(){
			        self.slide("next")
		        },this.options.slideDelay);
	        }
	        
	        // Turn off auto slide if false is passed
	        else {
		        clearInterval(self.options.sliding);
	        }
	        
        },
        
        progress: function() {
	        
	        var $progressDots = $("ul#progress li",this.element);
	        var self = this;
	        
	        $progressDots.each(function(index) {
		        ((index + 1) == self.options.currentPanel) ? $(this).addClass("active") : $(this).removeClass("active");
	        });
	        
        },
        
        listeners: function() {
	        
	        // Setup elements into vars
	        var $prev = $("#prev", this.element);
	        var $next = $("#next", this.element);
	        var $jump = $("#progress li", this.element);
	        
	        // Progress dots
	        $jump.each(function(index) {
		        $(this).click(function() {
			        self.skipTo(index);
		        });
	        });
	        
	        // Next button
	        $next.click(function() {
	        	self.autoSlide(false);
		        self.slide("next");
	        });
	        
	        // Previous button
	        $prev.click(function() {
	        	self.autoSlide(false);
		        self.slide("prev");
	        });
	        
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