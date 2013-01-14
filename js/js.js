var MY_EMAIL = "ebrooks@risd.edu";
var MY_NAME = "Evan Brooks";

var $view, $viewScroll, $body, $index, $matte, $currItem;
var $itemName, $itemDate, $itemContent;
var whichCurrItem;
var INDEX, ITEM, view;
var IS_TOUCH;

var aBar;

$(function(){
	// Cache jQuery objects
	// --------------------

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
		//var myScroll = new iScroll('iScroll');
		//$("body").addClass("i-scroll");
	}

	// Button click handlers
	// ---------------------

	// Open item
	$("html").on("click", "[data-item]", function(e){
		e.preventDefault();
		if ($currItem != null)
			$currItem.removeClass("active"); // remove from old item
		$currItem = $(this);			     // switch to new item
		$currItem.addClass("active");	     // make active
		openItem($currItem.attr("data-item"));
	});

	$matte.click(closeItem);

	// Toggle caption
	$("html").on("click", ".togCap", function(e){
		$(this).parent().toggleClass("show-caption");
	});

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


	// Action sheet for contact information
	// ------------------------------------

	$("html").on("click", "[data-action = actionsheet]", function(e){
		e.preventDefault();
		$body.addClass("action-mode");
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
	// Use a flipper by putting the [data-flip] attribute
	// on the wrapper div

	$("html").on("click", "[data-flip]", function(e){
		type = $(this).attr("data-flip");
		if (type == "permanent") {
			$(this).addClass("flipped");
		}
		else {
			$(this).toggleClass("flipped");
		}
	});

	// Crop and uncrop
	// ---------------

	$("html").on("click", ".cropped", function(e){
		$(this).toggleClass("uncropped");
	});

	clerestorySetup();

	aBar = new AddressBar();

	$("html").on("click", "[data-action = fullscreen]", function(e){
		aBar.toggle();
	});

	// If capable of fullscreen mode but not in it 
	if ( IS_TOUCH
		 && ("standalone" in window.navigator)
		 && !window.navigator.standalone
		){
		$("[data-action = fullscreen]").show();
	}


});

// Open or close item
// ------------------
function openItem(openThisItem) {
	history.pushState({}, "", "#/"+openThisItem);
	view = ITEM;

	if ( openThisItem != whichCurrItem ){
		whichCurrItem = openThisItem;
		url = "/item/"+openThisItem+".html";
		$body.addClass("loading");
		$viewScroll.scrollTop(0);
		$.ajax(url).done(function ( data ) {
			content = data.split('==');

			// Parse metadata
			// --------------
			setTitle(content[0]);
			$itemName.html(content[0]);
			$itemDate.html(content[1]);

			// Parse content
			// -------------

			// per http://cubiq.org/testing-memory-usage-on-mobile-safari,
			// consider switching to appendChild instead of innerHTML

			$itemContent.html("");
			var section = content[2].split('\n#');
			var html = "";

			// For each section
			// ----------------
			for (i = 1; i < section.length; i++){
				//   ^ discard first section because we start with #
				
				content = section[i].split('\n--');
				contentAttr = content[0].split(':');
				contentBody = content[1];
				
				classNames_str = "class=\""+contentAttr[0]+"\"";
				var parsedContent = "";

				// Image and/or sidebyside Image
				// -----------------------------
				if (classNames_str.indexOf("img") !== -1) {
					var img = "";
					for (j = 1; j < contentAttr.length; j++) {
						//   ^ discard the class name
						src = contentAttr[j].replace(/(^\s+|\s+$)/g, '');
						img += "<img src=\""+src+"\">";
					}
					parsedContent = img + contentBody;
				}

				// Browser window section
				// ----------------------
				else if (classNames_str.indexOf("windowed") !== -1) {
					var img = "";
					src = contentAttr[1].replace(/(^\s+|\s+$)/g, '');
					img += "<div class=\"browser\">";
					img += "<img src=\""+src+"\">";
					img += "</div>"
					parsedContent = img + contentBody;
				}

				// Resume section
				// --------------
				else if (classNames_str.indexOf("resume") !== -1) {
					parsedContent += "<ul class=\"events\">";
					var resevents = section[i].split('------');
					for (j = 1; j < resevents.length; j++) {
						var resparts = resevents[j].split('--');
						var reshead = resparts[0].split(':');
						var resdate = reshead[0];
						var resname = reshead[1];
						resname = resname.replace('(', '<i>').replace(')', '</i>');
						var resdesc = resparts[1].split('\n\n');
						var resparagraphs = "";
						for (k = 0; k < resdesc.length; k++) {
							resparagraphs += "<p>"+resdesc[k]+"</p>";
						}
						parsedContent += "<li>";
						parsedContent += "<div class=\"date\">"+resdate+"</div>";
						parsedContent += "<div class=\"name\">"+resname+"</div>";
						parsedContent += "<div class=\"desc\">"+resparagraphs+"</div>";
						parsedContent += "</li>";
					}
					parsedContent += "</ul>";
				}

				// Unknown section
				// ---------------
				else {
					parsedContent = content[1];
				}


				html += "<section "+ classNames_str +">";
				html += parsedContent;

				html += "</section>";
			}
			$itemContent.append(html);

			$view.waitForImages(function() {    
				$body.removeClass("loading").addClass("item-mode");
				iRefresh();
			});  

		}).error( function(xhr, textStatus, errorThrown){
			setTitle("Nothing");
			$itemName.html("");
			$itemDate.html("");
			$itemContent.html("<section class=\"text\">Not available right now</section>");
			$body.removeClass("loading").addClass("item-mode");
		});
	}
	else {
		$body.addClass("item-mode");
		setTitle($itemName.text());
	}
}

function closeItem() {
	$body.removeClass("item-mode action-mode");
	view = INDEX;
	history.pushState({}, "", "/");
	setTitle("Portfolio");
}

// Utility functions
// -----------------

function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   return typeof el.ongesturestart === "function";
}

function iRefresh() {
	// if (IS_TOUCH) {
	// 	setTimeout(function () {
	// 		myScroll.refresh();
	// 	}, 0);
	// }
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

function setTitle(title) {
	document.title = MY_NAME+" — "+title;
	console.log("set title: "+title);
}