(function( $ ){
  $.fn.afterTransition = function(cb){
	var self = this;
    self.on("webkitTransitionEnd mozTransitionEnd", function(){
		cb();
		self.off("webkitTransitionEnd mozTransitionEnd");
    });
  };
})( jQuery );

(function( $ ){
	$.fn.freeze = function(cb){
		this.addClass("no-trans");
		return this;
  };
})( jQuery );

(function( $ ){
  $.fn.unfreeze = function(cb){
		this.removeClass("no-trans");
		return this;
  };
})( jQuery );