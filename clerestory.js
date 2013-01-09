function clerestorySetup() {
	$("html").on("click", ".box-fold", toggleBox);
	$("html").on("click", ".box-toggle-btn", toggleBox);
	$("html").on("click", ".box-items > li", toggleSpread);
}

function toggleBox(e){
	e.preventDefault();
	var $wrapper = $(".box-contents");
	var boxState = $wrapper.attr("data-box");
	var spreadState = $wrapper.attr("data-spread");
	var $box = $(".box-fold");
	if ( spreadState == "spread") {
		toggleSpread();
	}
	else if ( boxState == "unfolded" ){
		$(".box-fold").parent().removeClass("box-open");
		goHere = $(".box-top-point").position().top;
		$viewScroll.animate({scrollTop: goHere}, 'slow');
		$(".box-fold > .frames").stepWise('backward', 6, 600, function(){
		});
		$box.removeClass("unfolded");
		$wrapper.attr("data-box", "folded");
	}
	else {
		$(".box-fold > .frames").stepWise('forward', 6, 600, function(){
			$(".box-fold").parent().addClass("box-open");
		});
		$box.addClass("unfolded");
		$wrapper.attr("data-box", "unfolded");
	}
}

function toggleSpread(e){
	var $wrapper = $(".box-contents");
	var spreadState = $wrapper.attr("data-spread");
	var goHere;
	if (spreadState == "spread") {
		$wrapper.attr("data-spread", "stacked").removeClass("box-spread");
		goHere = $(".box-top-point").position().top;
		// 							  ^ don't use offset() in a scrollable div
	}
	else {
		$wrapper.attr("data-spread", "spread").addClass("box-spread");
		goHere = $(".box-fold").position().top + $(".box-fold").height();
		// 					 ^ don't use offset() in a scrollable div
	}
	$viewScroll.animate({scrollTop: goHere}, 'slow');
}

/* =========== Stepwise Plugin =========== */

(function( $ ){

  $.fn.stepWise = function(dir, frames, duration, callback) {
	var timePerFrame = duration / frames;
	var posPerFrame = -100; //100 / (frames-1);
	var endPos = -1 * (frames-1) * 100;
	var framestrip = this;

	if (dir == "backward") {
		pos = endPos;
		posPerFrame *= -1;
	}
	else if (dir == "forward") {
		pos = 0;
	}
	else {
		console.log("unkown direction for animation");
	}


	step();
	return framestrip;

	function step() {
		pos += posPerFrame;
		framestrip.css("left", pos+"%");
		if (pos > endPos && pos < 0) {
			window.setTimeout(function() {
			    step();
			}, timePerFrame);
		}
		else {
			$(".box-fold > .frames").removeAttr("style");
			callback();
		}
	}
  };

})( jQuery );

