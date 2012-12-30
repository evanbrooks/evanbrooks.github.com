$(function(){
	var $view       = $(".view");
	var $viewScroll = $(".view-scroller");
	var $body       = $("body");
	var $index      = $(".index");
	var $over       = $(".matte");
	var $currItem   = null;

	var $itemName    = $(".view .title");
	var $itemDate    = $(".view .subtitle");
	var $itemContent = $(".view-content");
	var whichCurrItem = "";

	var strtX = 0;
	var strtY = 0;
	var dX    = 0;
	var dY    = 0;
	var drag  = false;

	var scrollPos    = 0;
	var newScrollPos = 0;
	var sectionTops  = new Array();

	var INDEX  = 0; // const
	var ITEM   = 1;  // const
	var view   = INDEX;

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

	$(".matte").click(closeItem);

	// Bind to touch events
	// --------------------
	if(isTouchDevice()) {
		document.addEventListener('touchstart', dragBegin);
		document.addEventListener('touchmove', dragMove);
		document.addEventListener('touchend', dragStop);
	}

	// Bind to mouse events
	// --------------------
	$body.mousedown(dragBegin);
	$body.mousemove(dragMove);
	$body.mouseup(dragStop);

	$body.mouseleave(dragStop);

	$body.scrollTop(0);

	// Dragging
	// --------
	function dragBegin(e){
		if ( view == ITEM ) {
			e.preventDefault();
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
			$view.css("-webkit-transition","none");
			$viewScroll.css("-webkit-transition","none");
			$index.css("-webkit-transition","none");
			$over.css("-webkit-transition","none");
		}
	}

	function dragMove(e){
		if ( view == ITEM && drag == true ) {
			e.preventDefault();

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
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
    			//newScrollPos = scrollPos + dY;
    			scrollViewTo(dY);
    			if ( Math.abs(dX) > 50 || Math.abs(dY) > 50) {
    				if ( Math.abs(dX) > Math.abs(dY)){
    					scroll = HORIZ;
    					// $viewScroll.removeAttr("style"); // cancel previous vert scroll
    				} 
    				else{
    					scroll = VERT;
    					$view.removeAttr("style");	// cancel previous horiz scroll
    				}
    			}
    		}
			// Update horizontal position, parallax, and matte opacity
			// --------------------------------------------------------
    		else if ( scroll == HORIZ ){
    			dPad = parseInt(dX / 15);
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
	    		//if (dPad < 50) $index.css("-webkit-transform", "translate3d("+dPad+"px,0,0) scale(0.98)");
	    		//else 			$index.css("-webkit-transform", "translate3d(100px,0,0) scale(0.98)");
	    		$index.css("opacity", 0.7 + ( 0.3 * dX / $(window).width()));
    		}
    		// Update faked vertical scrolling
    		// -------------------------------
    		else if (scroll == VERT){
    			//np = scrollPos + dY
    			//if ( np > 0){
    			//	overScroll = -1 * (scrollPos - dY);
    			//	$view.css("-webkit-transform", "translate3d(0,"+overScroll+"px,0)");
    			//}
    			//else {
    				scrollViewTo(dY);
    			//}
    		}
    	}
	}

	function dragStop(e){
		if ( view == ITEM && drag == true) {
			drag = false;
			// If scrolled halfway over, close item
			// ------------------------------------
			if ( scroll == HORIZ && ( dX > ($(window).width()/2)) ){
				closeItem();
			}
			// If scrolled down, snap to section
			// ---------------------------------
			else if ( scroll == VERT){
				//$viewScroll.css("-webkit-transition", "all 500ms cubic-bezier(0.115, 0.910, 0.470, 1.00)");
				newScrollPos = scrollPos + dY;
				newScrollPosMid = newScrollPos - $(window).height()/2;
				// Check each scrolltop
				for (i = 0; i < sectionTops.length; i++){
					// If the midpoint is below this section top
					if ( newScrollPosMid < -1*sectionTops[i]) {
						// If it was flicked more than 100 up but less than halfway, advance
						if (dY > 100
						    && dY < $(window).height()/2
						    && i - 1 >= 0 ){
								scrollTarget = -1*sectionTops[i-1];
						}
						// If it was flicked more than 100 down but less than halfway, go back
						else if (dY < -100
							     && dY > -1*$(window).height()/2
							     && i + 1 < sectionTops.length ) {
								scrollTarget = -1*sectionTops[i+1];
						}
						// Default just go to this one
						else {
							scrollTarget = -1*sectionTops[i];
						}
					}
					// We've gone past the midpoint - stop here
					else { 
						break;
					}
				}
				// We need to convert the drag translation into true
				// scroll position, at least for desktop. This way
				// scrolling with trackpad/scrollbar/mousewheel makes
				// sense and works right. First we adjust the scroll
				// position, then do the reverse translation so it
				// seems like nothing happenned. After that, we
				// transition the "snap" to section. For some
				// reason this only seems to work with the transit
				// plug-in and not with writing the css directly
				// -----------------------------------------------
				dTarget = newScrollPos - scrollTarget;
				$view.scrollTop(-1 * scrollTarget);
				scrollViewTo(dTarget);

				// THIS IS THE OLD WAY WITH THE PLUGIN
    			// $viewScroll.transition({"-webkit-transform": "translate3d(0,0,0)"}, function(){
    			// 	// Clean up this inline-style mess!
    			// 	$viewScroll.removeAttr("style");
    			// });

				// AND here's the alternate way of doing it
				// fadein doesn't do anything, I guess, but
				// for some reason it delays everything enough
				$viewScroll.fadeIn("slow", function(){
					$(this).removeAttr("style");
				});

    			scrollPos = scrollTarget;
			}
			// Snap everything else back to "normal"
			// -------------------------------------
			$view.removeAttr("style");
			$index.removeAttr("style");
			$over.removeAttr("style");
		}
	}

	// Open or close item
	// ------------------
	function openItem(whichItem) {
		history.pushState({}, "", "#/"+whichItem);
		$body.addClass("view-item-mode");
		view = ITEM;

		if ( whichItem != whichCurrItem ){
			whichCurrItem = whichItem;
			url = whichItem+".html";
			console.log(whichItem);
			$itemName.html("");
			$itemDate.html("");
			$itemContent.html("Loading...");
			$.ajax(url).done(function ( data ) {
				content = data.split('==');

				// Parse metadata
				// --------------
				document.title = "Evan Brooks — "+content[0];
				$itemName.html(content[0]);
				$itemDate.html(content[1]);

				// Parse content
				// -------------
				var section = content[2].split('#');
				var html = "";

				for (i = 1; i < section.length; i++){
					//   ^ discard first section because we start with #
					content = section[i].split('\n--');
					attr = content[0].split(': ');
					attrHtml = "class=\""+attr[0]+"\"";
					if (attr.length > 1)
						attrHtml += "style=\"background-image: url('"+attr[1]+"')\"";
					
					html += "<section "+ attrHtml +">";
					pars = content[1].split("\n\n");
					//for (i = 0; i < pars.length; i++){
					//	html += "<p>" + pars[i] + "</p>";
					//}
					html += content[1];

					html += "</section>"
				}

				$itemContent.html(html);
				refreshSectionOffsets();

			}).error( function(xhr, textStatus, errorThrown){
				document.title = "Evan Brooks — Nothing";
				$itemName.html("");
				$itemDate.html("");
				$itemContent.html("<section class=\"text\">Not available right now</section>");
				refreshSectionOffsets();

			});
		}
		else {
			//the item is already loaded!
		}
	}

	function closeItem() {
		$body.removeClass("view-item-mode");
		view = INDEX;
		history.pushState({}, "", "/");
		document.title = "Evan Brooks — Portfolio";
	}

	function scrollViewTo(pos) {
	    $viewScroll.css("-webkit-transform", "translate3d(0px,"+pos+"px,0)");
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

	function refreshSectionOffsets(){
		var sectionArr = $(".view section");
		sectionTops = new Array(); // clear array
		for (i = 0; i < sectionArr.length; i++) {
			var offset = $(sectionArr[i]).position().top;
			sectionTops.push(offset);
			//console.log(offset);
		}
	}


	// Detect resizing
	// ------------------
	$(window).resize(function(){
		if (view == ITEM) {
			refreshSectionOffsets();
		}
	});

	$(window).on("onorientationchange", function() {
		if (view == ITEM) {
			refreshSectionOffsets();
		}
	});

	// $view.scroll(function(e){
	// 	pos = -1*$view.scrollTop()
	// 	$viewScroll.css("-webkit-transition: none");
	// 	scrollViewTo(pos);
	// 	//$viewScroll.css("-webkit-transition", "all 500ms cubic-bezier(0.115, 0.910, 0.470, 1.00)");
	// });

});


// Utility functions
// -----------------
function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}
