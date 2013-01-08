var $view, $viewScroll, $body, $index, $matte, $currItem;
var $itemName, $itemDate, $itemContent;
var whichCurrItem;
var INDEX, ITEM, view;

$(function(){
	$view       = $(".view");
	$viewScroll = $(".view-scroller");
	$body       = $("body");
	$index      = $(".index");
	$matte      = $(".matte");
	$currItem   = null;

	$itemName    = $(".view .title");
	$itemDate    = $(".view .subtitle");
	$itemContent = $(".view-scroller");
	whichCurrItem = "";

	var strtX = 0;
	var strtY = 0;
	var dX    = 0;
	var dY    = 0;
	var drag  = false;

	var scrollPos    = 0;
	var newScrollPos = 0;

	INDEX  = 0; // const
	ITEM   = 1;  // const
	view   = INDEX;

	var VERT   = 0;
	var HORIZ  = 1;
	var BOTH   = 2;
	var scroll = BOTH;

	$.ajaxSetup({ cache: false });

	// On click
	// --------
	$(".item .inner").click(function(e){
		if ($currItem != null)
			$currItem.removeClass("active"); // remove from old item
		$currItem = $(this);			     // switch to new item
		$currItem.addClass("active");	     // make active
		openItem($currItem.attr("data-item"));
	});

	$matte.click(closeItem);

	// Bind to touch events
	// --------------------
	if(isTouchDevice()) {
		document.addEventListener('touchstart', dragBegin);
		document.addEventListener('touchmove', dragMove);
		document.addEventListener('touchend', dragStop);
	}

	// Bind to mouse events
	// --------------------
	$(".grabby").mousedown(dragBegin);
	$body.mousemove(dragMove);
	$body.mouseup(dragStop);

	$body.mouseleave(dragStop);


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
			$body.addClass("dragging");
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
    			dPad = 0 + parseInt(dX / 15);
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
	    		var op = 1 - Math.round( dX / $(window).width() *100)/100;
	    		// parseInt(z * 100)/100 --> round to hundredths
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
					bounceView();
				}
				else {
					if ( dX > ($(window).width()/2) ) {
						closeItem();
					}
					$view.removeAttr("style");
					$matte.removeAttr("style");
				}
				dX = 0;
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

	// Detect back button
	// ------------------
	window.addEventListener('popstate', function(event) {
	  //console.log('popstate fired!');
	  if (window.location.hash != "") {
	  	whichItem = window.location.hash.split("#/");
	  	openItem(whichItem[1]);
	  }
	  else {
	  	closeItem();
	  }
	  //updateContent(event.state);
	});

	// Detect resizing
	// ----------------
	$(window).resize(function(){
		if (view == ITEM) {
		}
	});

	$(window).on("onorientationchange", function() {
		if (view == ITEM) {
		}
	});

	// Toggle caption
	// --------------

	$("html").on("click", ".togCap", function(e){
		$(this).parent().toggleClass("show-caption");
	});


	// Action sheet for contact information
	// ------------------------------------

	$("html").on("click", "[data-action = slideup]", function(e){
		e.preventDefault();
		$body.addClass("slideup");
	});

	$("html").on("click", "[data-action = copy]", function(e){
		e.preventDefault();
		$(".actions input").val("evan@evn.io");
		window.setTimeout( function(){
			el = document.getElementById("email");
			el.selectionStart=0;
			el.selectionEnd = el.value.length;
		}, 250);
	});

	// $(".actions input").blur(function(e){
	// 	$(".actions .flip-wrap").removeClass("flipped");
	// });

	// Flip the flippers
	// -----------------

	$("html").on("click", ".flip-wrap", function(e){
		type = $(this).attr("data-flip");
		if (type == "permanent") {
			$(this).addClass("flipped");
		}
		else {
			$(this).toggleClass("flipped");
		}
	});

	// Clerestory box fanciness
	// ------------------------

	$("html").on("click", ".box-fold", toggleBox);
	$("html").on("click", ".box-toggle-btn", toggleBox);
	$("html").on("click", ".box-items > li", toggleSpread);


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

});

// Open or close item
// ------------------
function openItem(whichItem) {
	history.pushState({}, "", "#/"+whichItem);
	view = ITEM;

	if ( whichItem != whichCurrItem ){
		whichCurrItem = whichItem;
		url = "/item/"+whichItem+".html";
		$body.addClass("loading");
		$viewScroll.scrollTop(0);
		$.ajax(url).done(function ( data ) {
			content = data.split('==');

			// Parse metadata
			// --------------
			document.title = "Evan Brooks — "+content[0];
			$itemName.html(content[0]);
			$itemDate.html(content[1]);

			// Parse content
			// -------------
			var section = content[2].split('\n#');
			var html = "";

			// per http://cubiq.org/testing-memory-usage-on-mobile-safari,
			// consider switching to appendChild instead of innerHTML

			$itemContent.html("");

			for (i = 1; i < section.length; i++){
				//   ^ discard first section because we start with #
				content = section[i].split('\n--');
				attr = content[0].split(': ');
				attrHtml = "class=\""+attr[0]+"\"";
				var img = "";
				if (attr.length > 1) {
					//attrHtml += "style=\"background-image: url('"+attr[1]+"')\"";
					img = "<img src=\""+attr[1]+"\">";
				}
				html += "<section "+ attrHtml +">";
				html += img;
				html += content[1];

				html += "</section>";
			}
			$itemContent.append(html);

			$view.waitForImages(function() {    
				$body.removeClass("loading").addClass("view-item-mode");
			});  

		}).error( function(xhr, textStatus, errorThrown){
			document.title = "Evan Brooks — Nothing";
			$itemName.html("");
			$itemDate.html("");
			$itemContent.html("<section class=\"text\">Not available right now</section>");
			$body.removeClass("loading").addClass("view-item-mode");
		});
	}
	else {
		$body.addClass("view-item-mode");
	}
}

function closeItem() {
	$body.removeClass("view-item-mode slideup");
	view = INDEX;
	console.log("close");
	history.pushState({}, "", "/");
	document.title = "Evan Brooks — Portfolio";
}



// Utility functions
// -----------------

function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}

function clearTextSelections() {
	if (window.getSelection) {
	  if (window.getSelection().empty) {  // Chrome
	    window.getSelection().empty();
	  } else if (window.getSelection().removeAllRanges) {  // Firefox
	    window.getSelection().removeAllRanges();
	  }
	} else if (document.selection) {  // IE?
	  document.selection.empty();
	}
}

function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
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
