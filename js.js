$(function(){
	var $view       = $(".view");
	var $viewScroll = $(".view-scroller");
	var $body       = $("body");
	var $index      = $(".index");
	var $matte      = $(".matte");
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
	$body.mousedown(dragBegin);
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
			$view.css("-webkit-transition","none");
			$index.css("-webkit-transition","none");
			$matte.css("-webkit-transition","none");
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
    			//newScrollPos = scrollPos + dY;
    			// scrollViewTo(dY);
    			if ( Math.abs(dX) > 5 || Math.abs(dY) > 5) {
    				if ( Math.abs(dX) > Math.abs(dY)){
    					scroll = HORIZ;
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
				e.preventDefault();
    			dPad = 0 + parseInt(dX / 15);
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
	    		//if (dPad < 30) $index.css("-webkit-transform", "translate3d("+dPad+"px,0,0) scale(0.98)");
	    		//else 			$index.css("-webkit-transform", "translate3d(30px,0,0) scale(0.98)");
	    		var op = 1 - parseInt( dX / $(window).width() *100)/100;
	    		$matte.css("opacity", op);
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
			// Snap everything else back to "normal"
			// -------------------------------------
			$view.removeAttr("style");
			$index.removeAttr("style");
			$matte.removeAttr("style");
		}
	}

	// Open or close item
	// ------------------
	function openItem(whichItem) {
		history.pushState({}, "", "#/"+whichItem);
		view = ITEM;

		if ( whichItem != whichCurrItem ){
			whichCurrItem = whichItem;
			url = "/item/"+whichItem+".html";
			$view.addClass("loading");
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
					var img = "";
					if (attr.length > 1) {
						//attrHtml += "style=\"background-image: url('"+attr[1]+"')\"";
						img = "<img src=\""+attr[1]+"\">";
					}
					html += "<section "+ attrHtml +">";
					html += img;
					// paragraph = content[1].split("\n\n");
					// if (paragraph.length > 1) {
					// 	for (j = 0; j < paragraph.length; j++) {
					// 		html += "<p>" + paragraph[j] + "</p>";
					// 		console.log(j);
					// 	}
					// }
					html += content[1];

					html += "</section>";
				}
				$itemContent.html(html);

				$viewScroll.waitForImages(function() {    
					$view.removeClass("loading");
					$body.addClass("view-item-mode");
				});  

			}).error( function(xhr, textStatus, errorThrown){
				document.title = "Evan Brooks — Nothing";
				$itemName.html("");
				$itemDate.html("");
				$itemContent.html("<section class=\"text\">Not available right now</section>");
				refreshSectionOffsets();
				$view.removeClass("loading");
				$body.addClass("view-item-mode");
			});
		}
		else {
			$body.addClass("view-item-mode");
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

	// Detect resizing
	// ------------------
	$(window).resize(function(){
		if (view == ITEM) {
		}
	});

	$(window).on("onorientationchange", function() {
		if (view == ITEM) {
		}
	});

	$("html").on("click", ".togCap", function(e){
		$(this).parent().toggleClass("show-caption");
	});

	$("html").on("click", ".flip-wrap", function(e){
		$(this).toggleClass("flipped");
	});

	$("html").on("click", ".box-fold", function(){
		if ( $(this).hasClass("unfolded") ){
			stepwiseAnim('backward', 6, 600);
			$(this).removeClass("unfolded");
		}
		else {
			stepwiseAnim('forward', 6, 600);
			$(this).addClass("unfolded");
		}
	});

});


// Utility functions
// -----------------
function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}


// ========

function stepwiseAnim(dir, frames, duration) {
	timePerFrame = duration / frames;
	posPerFrame = 100 / (frames-1);

	if (dir == "backward") {
		pos = 100;
		posPerFrame *= -1;
	}
	else if (dir == "forward") {
		pos = 0;
	}
	else {
		console.log("unkown direction for animation");
	}


	step();
	
	function step() {
		pos += posPerFrame;
		$(".box-fold").css("background-position", pos+"% center");
		if (pos < 100 && pos > 0) {
			window.setTimeout(function() {
			    step();
			}, timePerFrame);
		}
		else {
			$(".box-fold").removeAttr("style");
		}
	}
}

