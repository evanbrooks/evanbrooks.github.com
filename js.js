$(function(){
	var $view = $(".view");
	var $viewScroll = $(".view-scroller");
	var $body = $("body");
	var $over = $(".matte");
	var $currItem = null;

	var $itemName = $(".view .title");
	var $itemDate = $(".view .subtitle");
	var $itemContent = $(".view .content");


	var strtX = 0;
	var strtY = 0;
	var dX = 0;
	var dY = 0;
	var strtPad = 0;
	var drag = false;

	var INDEX = 0; // const
	var ITEM = 1;  // const
	var view = INDEX;

	$.ajaxSetup({ cache: false });

	// On click
	// --------
	$(".item .inner, .matte").click(function(e){
		if ($currItem != null)
			$currItem.removeClass("active"); // remove from old item
		$currItem = $(this);			     // switch to new item
		$currItem.addClass("active");	     // make active
		toggleItem($currItem.attr("data-item"));
	});

	// Bind to touch events
	// --------------------
	if(isTouchDevice()) {
		document.addEventListener('touchstart', dragBegin);
		document.addEventListener('touchmove', dragMove);
		document.addEventListener('touchend', dragStop);
	}

	// Bind to mouse events
	// --------------------
	$view.mousedown(dragBegin);
	$body.mousemove(dragMove);
	$view.mouseup(dragStop);


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
			$view.css("-webkit-transition","none");
			$viewScroll.css("-webkit-transition","none");
			$body.css("-webkit-transition","none");
			$over.css("-webkit-transition","none");
			strtPad = parseInt($body.css("padding-left"));
		}
	}

	function dragMove(e){
		if ( view == ITEM && drag == true ) {
			e.preventDefault();
			if (e.touches == true) {
				dX = e.targetTouches[0].pageX - strtX; // touch
				dy = e.targetTouches[0].pageY - strtY; // touch
			}
    		else {
    			dX = e.pageX - strtX;					// mouse
    			dY = e.pageY - strtY;					// mouse
    		}
    		dPad = parseInt(strtPad + dX / 15);
    		if ( Math.abs(dX) > Math.abs(dY)){
    			$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
    		}
    		else {
    			$viewScroll.css("-webkit-transform", "translate3d(0px,"+dY+"px,0)");
    		}
    		if (dPad < 100) $body.css("padding-left", dPad+"px");
    		else 			$body.css("padding-left", "100px");
    		$over.css("opacity", 1 - dX / $(window).width());
    	}
	}

	function dragStop(e){
		if ( view == ITEM ) {
			drag = false;
			if ( dX > ($(window).width()/2) ){
				closeItem();
			}
			$view.removeAttr("style");
			$viewScroll.removeAttr("style");
			$body.removeAttr("style");
			$over.removeAttr("style");
		}
	}

	// Open or close item
	// ------------------
	function toggleItem(whichItem) {
		if (view == ITEM) {
			closeItem();
  		}
  		else if (view == INDEX) {
  			history.pushState({}, "", whichItem);
			$body.addClass("view-item-mode");
			view = ITEM;
			url = whichItem+".html";
			console.log(whichItem);
			$itemName.html("");
			$itemDate.html("");
			$itemContent.html("Loading...");
			$.ajax(url).done(function ( data ) {
				content = data.split('==');
				$itemName.html(content[0]);
				$itemDate.html(content[1]);
				$itemContent.html(content[2]);
			}).error( function(xhr, textStatus, errorThrown){
				$itemName.html("");
				$itemDate.html("");
				$itemContent.html("Not available right now");
			});
		}
	}

	function closeItem() {
		$body.removeClass("view-item-mode");
		view = INDEX;
		history.pushState({}, "", "/");
	}

	// Detect back button
	// ------------------
	window.addEventListener('popstate', function(event) {
	  console.log('popstate fired!');
	  closeItem();
	  //updateContent(event.state);
	});

});


// Utility functions
// -----------------
function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}
