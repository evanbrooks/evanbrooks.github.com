var MY_EMAIL = "ebrooks@risd.edu";
var MY_NAME = "Evan Brooks";

var $view, $viewScroll, $body, $index, $matte, $currItem;
var $itemName, $itemDate, $itemContent;
var whichCurrItem;
var INDEX, ITEM, view;
var IS_TOUCH;

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

	IS_TOUCH = isTouchDevice();

	INDEX  = 0; // const
	ITEM   = 1;  // const
	view   = INDEX;


	$.ajaxSetup({ cache: false });

	// Set up iScroll
	// --------------
	if (IS_TOUCH) {
		var myScroll = new iScroll('iScroll');
		$("body").addClass("i-scroll");
	}

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


	draggingSetup();

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
	$(window).resize(iRefresh);

	$(window).on("onorientationchange", iRefresh);

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
		$(".actions input").val(MY_EMAIL);
		//window.setTimeout( function(){
			el = document.getElementById("email");
			el.selectionStart=0;
			el.selectionEnd = el.value.length;
		//}, 250);
	});

	$(".actions input").blur(function(e){
		$(".actions .flip-wrap").removeClass("flipped");
	});

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
			document.title = MY_NAME+" — "+content[0];
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
				iRefresh();
			});  

		}).error( function(xhr, textStatus, errorThrown){
			document.title = MY_NAME+" — Nothing";
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
	document.title = MY_NAME+"— Portfolio";
}

// Utility functions
// -----------------

function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}

function iRefresh() {
	if (IS_TOUCH) {
		setTimeout(function () {
			myScroll.refresh();
		}, 0);
	}
}

function clearTextSelections() {
	if (window.getSelection) {
	  if (window.getSelection().empty) {  // Chrome
	    window.getSelection().empty();
	  } else if (window.getSelection().removeAllRanges) {  // Firefox
	    window.getSelection().removeAllRanges();
	  }
	} else if (document.selection) {  // IE
	  document.selection.empty();
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
