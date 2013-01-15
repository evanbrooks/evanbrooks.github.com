function draggingSetup() {
	var strtX = 0;
	var strtY = 0;
	var dX    = 0;
	var dY    = 0;
	var drag  = false;

	var scrollPos    = 0;
	var newScrollPos = 0;

	var VERT   = 0;
	var HORIZ  = 1;
	var BOTH   = 2;
	var scroll = BOTH;

	// Bind to touch events
	// --------------------
	if(IS_TOUCH) {
		document.addEventListener('touchstart', dragBegin);
		document.addEventListener('touchmove', dragMove);
		document.addEventListener('touchend', dragStop);
	}

	// Bind to mouse events
	// --------------------
	$view.mousedown(dragBegin);
	$body.mousemove(dragMove);
	$body.mouseup(dragStop);

	$body.mouseleave(dragStop);


	// Bind to touch events
	// --------------------

	$viewScroll.scroll(detectOverScroll);

	// Dragging
	// --------
	function dragBegin(e){
		if ( view == ITEM ) {
			//e.preventDefault();
			if (e.touches == true) {
				strtX = e.changedTouches[0].pageX; //touch
				strtY = e.changedTouches[0].pageY; //touch
			}
			else {
				strtX = e.pageX;					//mouse
				strtY = e.pageY;					//mouse
			}
			drag = true;
			scroll = BOTH;
			if (!IS_TOUCH){
				$body.addClass("dragging");
			}
			if ($viewScroll.scrollTop() <= 0) {
				$viewScroll.scrollTop(1);
			}
			else if ($viewScroll.scrollTop() + $(window).height() >= $(".inner-scroll-wrap").height()) {
				s = $viewScroll.scrollTop() - 1;
				$viewScroll.scrollTop(s);
			}
		}
		else if ( view == INDEX ){
			if ($index.scrollTop() <= 0) {
				$index.scrollTop(1);
			}
			else if ($index.scrollTop() + $(window).height() >= $index.height()) {
				s = $index.scrollTop() - 1;
				$index.scrollTop(s);
			}
		}
	}

	function dragMove(e){
		if ( view == ITEM && drag == true ) {
			// e.preventDefault();

			// Read pointer/touch position
			// ---------------------------
			if (e.touches == true) {
				dX = e.targetTouches[0].pageX - strtX; // touch
				dY = e.targetTouches[0].pageY - strtY; // touch
			}
    		else {
    			dX = e.pageX - strtX;					// mouse
    			dY = e.pageY - strtY;					// mouse
    		}

    		// Update both Horizontal and vertical, but once we hit the distance
    		// threshold pick one direction to stick to
    		// ----------------------------------------
    		if ( scroll == BOTH ){
				//e.preventDefault();
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
    			if ( Math.abs(dX) > 5 || Math.abs(dY) > 5) {
    				if ( Math.abs(dX) > Math.abs(dY)){
    					scroll = HORIZ;
						$view.css("-webkit-transition","none");
						// $index.css("-webkit-transition","none");
						$matte.css("-webkit-transition","none");
						clearTextSelections();
    				} 
    				else{
    					scroll = VERT;
    					$view.removeAttr("style");	// cancel previous horiz scroll
						$body.removeClass("dragging");
    				}
    			}
    		}
			// Update horizontal position, parallax, and matte opacity
			// --------------------------------------------------------
    		else if ( scroll == HORIZ ){
				e.preventDefault();
    			//var maxRotate = 5;
    			var winWidth = $(window).width();
    			//var rotateStep = maxRotate / winWidth;
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)"); //rotate("+rotateStep*dX+"deg)");
	    		var op = 1 - 0.5*Math.round( dX / winWidth *100)/100;
	    		$matte.css("opacity", op);
    		}
    	}
	}

	function dragStop(e){
		if ( view == ITEM && drag == true) {
			drag = false;
			// If scrolled halfway over, close item
			// ------------------------------------
			if ( scroll != VERT ) {
				$body.removeClass("dragging");
				if ( dX == 0 ) {
					//bounceView();
				}
				else {
					if ( dX > ($(window).width()/2) ) {
						closeItemDir("right");
					}
					else if ( dX < -1*($(window).width()/2) ) {
						closeItemDir("left");
					}
					$view.removeAttr("style");
					$matte.removeAttr("style");
				}
				dX = 0;
			}
			else {
				var currScroll = $viewScroll.scrollTop();
				var triggerPoint = $(window).height()/4;
				if ( currScroll < -1*triggerPoint ){
					closeItem();
				}
				else if ( (currScroll + $(window).height())
							>=
						  ($(".inner-scroll-wrap").outerHeight() + triggerPoint)
						) {
					closeItemDir("up");
					console.log("triggered");
				}
				console.log(currScroll + $(window).height() +" >= "+($(".inner-scroll-wrap").height() + triggerPoint));
			}
			// Snap everything else back to "normal"
			// -------------------------------------
		}
	}


	// Bounce the view when the grab bar is tapped
	// -------------------------------------------
	function bounceView(){
		// Bounce out
		$view.css({
			"-webkit-transform": "translate3d(5%,0,0)",
			"-webkit-transition": "all 0.3s cubic-bezier(0.245, 0.975, 0.605, 1.020)"
		});
		// Wait until bounced out, then
		$view.on("webkitTransitionEnd", function(){
			// Bounce back
			$view.css({
				"-webkit-transform": "translate3d(0%,0,0)",
				"-webkit-transition": "all 0.4s cubic-bezier(0.470, 1.650, 0.330, 0.690)"
			});
			// Unbind this function
			$view.off("webkitTransitionEnd");
			// Wait until bounced back, then ...
			$view.on("webkitTransitionEnd", function(){
				// Clean up
				$view.removeAttr("style");
				// Remove binding
				$view.off("webkitTransitionEnd");
			});
		});
	}

	function detectOverScroll(){
		var currScroll = $viewScroll.scrollTop();
		var triggerPoint = $(window).height()/4;
		if ( currScroll < -1*triggerPoint ){
			$matte.addClass("danger top").removeClass("bottom");
		}
		else if ( (currScroll + $(window).height())
					>=
				  ($(".inner-scroll-wrap").outerHeight() + triggerPoint)
				) {
			$matte.addClass("danger bottom").removeClass("top");
		}
		else {
			$matte.removeClass("danger");
		}
		//console.log(currScroll + $(window).height() +" >= "+($(".inner-scroll-wrap").height() + triggerPoint));
    }

}

/* =========== Address Bar object =========== */

function AddressBar() {
	var state = "visible";
	var barH = 60;  // px
	var delay = 50; // ms

	var hide = function() {
		if(document.height <= window.outerHeight) {
		  	document.body.style.height = (window.outerHeight + barH) + 'px';
			$index.css({
				"-webkit-transition": "none",
				"padding-top": barH + "px"
			});
		}

		setTimeout( function(){
			window.scrollTo(0, 1);
			$index.removeAttr("style");
			state = "hidden";
		}, delay );
	}

	var show = function() {
		$index.css({
			"-webkit-transition": "none",
			"margin-top": -1*barH+"px"
		});
		setTimeout( function(){
			$index.removeAttr("style");
		}, delay );
		setTimeout( function(){
			$body.removeAttr("style");
		}, 250 );
		state = "visible";
	}

	var toggle = function() {
		if (state == "hidden") {
			show();
		}
		else if (state == "visible") {
			hide();
		}
	}

	this.hide = hide;
	this.show = show;
	this.toggle = toggle;
}
