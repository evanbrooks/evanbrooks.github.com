var iphone = isiPhone();

var wind = $(window);
var html = $("html");
var index = $(".scroller");
var body = $("body, html");
var slide = $("article");

var itemData = [];

var lb = new Lightbox();
var scroller = new Scroller();
var proj = new Projectbox(".project");
var cont = new ContentGetter();

var spinner = "<div id=\"spinner\"><span></span><span></span><span></span></div>";
var ex = "<div id=\"ex\">✕</div>";

bindHandlers();
cont.listen(); // Listen for history state changes
setupZClip();

function bindHandlers() {
	if (!iphone) {
		wind.scroll(scroller.scrolling);
	}
	wind.resize(refresh);

	html.on("click", "[data-item-name]", proj.viewItemClick)
			.on("click", "[data-item-link]", proj.viewItemInterLink)
			.on("click", "#spinner, #ex, .project-back", proj.clearItemClick)
			.on("click", "[data-lightbox]", lb.viewImage)
			.on("click", ".lightbox, .lightbox-back .ex", lb.clearImage);
}

function Scroller() {
	this.scrolling = scrolling;

	refresh();
	scrolling();

	function scrolling() {
		topScroll = wind.scrollTop();
		midScroll = topScroll + wind.height()/2;
		bottomScroll = topScroll + wind.height();

		var foundCurrent = false;
		$.each(itemData, function(i, item) {
			if (!foundCurrent) {
				// Above the current item
				if ( item.top < topScroll ) {
					item.div.attr("data-position", "above");
					if (typeof item.vid != "undefined") item.vid.pause();
				}
				// The current item
				if ( item.top > topScroll && item.top < midScroll) {
					item.div.attr("data-position", "current");
					if (typeof item.vid != "undefined") {
						item.vid.play();
					}
					foundCurrent = true;
				}
			}
			else {
				// Below the current item
				item.div.attr("data-position", "below");
				if (typeof item.vid != "undefined") item.vid.pause();
			}
		});
	}
}

function Projectbox(projectElement) {
	var el;
	var targ = null;
	var id;

	this.viewItemPop = viewItemPop;
	this.viewItemInterLink = viewItemInterLink;
	this.viewItemClick = viewItemClick;
	this.clearItem = clearItem;
	this.clearItemClick = clearItemClick;

	function viewItemPop(str) {
		if (targ !== null) clearItem();
		targ = $("[data-item-name = "+str+"]");
		if (targ.length < 1){
			targ = $("#missing");
		}
		viewItem();
	}

	function viewItemClick(e) {
		e.preventDefault();
		if (targ !== null){
			clearItem(view);
		}
		else {
			view();
		}
		function view(){
			targ = $(e.target);
			if (!targ.hasClass("item-name")) {
				targ = targ.parent();
			}
			viewItem();
		}
	}

	function viewItemInterLink(e) {
		e.preventDefault();
		str = $(e.target).attr("data-item-link");
		analytics.track("Interlink to " + str);
		clearItem(function(){
			targ = $("[data-item-name = "+str+"]");
			viewItem();
		});
	}

	function viewItem() {
		id = targ.attr("data-item-name");
		t = targ.attr("data-title");
		el = $(targ).siblings(".details");
		elparent = $(targ).parent();
		elparent.addClass("loading "+id);
		targ.append(spinner);
		targ.before(ex);
		el.html("");
		$("#favicon").attr("href", ("img/" + id + "/favicon.png"));
		cont.getItem(id, t, function(data){
			setTimeout(function(){
				el.css("height", "1000px");
				el.afterTransition(function(){
					el.html(data);
					body.addClass("viewing-item");
					el.imagesLoaded(function(){
						el.freeze().css("height", "auto").fadeIn().unfreeze();
						elparent.removeClass("loading");
						analytics.track("Viewed " + id);
						if (typeof initiateProject == "function") initiateProject();
					});
				});
			}, 500);
		});

		var title_str = targ.html();

		pos = targ.parent().offset().top - 1;
		body.animate({"scrollTop": pos}, 200, function(){
			elparent.addClass("current");
		});
		body.afterTransition(function(){
			//
		});
	}

	function clearItemClick(e){
		e.preventDefault();
		body.animate({"scrollTop": pos}, 200, function(){
			cont.clearItem();
			clearItem(function(){});
		});
	}

	function clearItem(cb) {
		$("#favicon").attr("href","img/favicon.png");
		if (typeof cb == "undefined") cb = function(){};
		if (!targ) return;

		el.freeze().css({"height": "1000px", "opacity": 1}).fadeIn().unfreeze().fadeIn().removeAttr("style");
		$("#spinner").remove();

		elparent.removeClass("current");
		body.removeClass("viewing-item");
		elparent.removeClass(id);
		setTimeout(function(){
			el.html("");
			targ = null;
			$("#ex").remove();
			analytics.track("Closed " + id);
			refresh();
			cb();
		}, 500);
	}
}


// Calculate scroll offsets
// ------------------------

function refresh() {
	$(".item figure").hide().fadeOut().show();
	itemData = [];
	$.each($(".item"), function(i, item) {
		var self = $(item);
		var video = self.find("video").get(0);
		itemData[i] = {
			div: self,
			top: self.offset().top,
			bottom: self.offset().top + self.innerHeight(),
			vid: video
		};
	});
}




// ZeroClipBoard Setup
// -------------------

function setupZClip() {
	// Load zeroclip here to support copying
	// the email address instead of using the mailto:
	ZeroClipboard.setDefaults({moviePath: "/js/zeroclip.swf"});
	var btn = $("#copybtn");
	var clip = new ZeroClipboard();

	// // Because we're in a different scrolling context we need to move the zeroclipboard's flash movie from the end of the DOM
	var flash = $("#global-zeroclipboard-html-bridge").remove();
	flash = $(flash).removeAttr("style").css({
		"position": "absolute",
		"left": "100%",
		"top": "0",
		"width": 60 + btn.width() + "px",
		"height": btn.height() + "px",
		"z-index": 999
	});
	// insert it right before our button
	btn.parent().before(flash);

	clip.on( 'load', function(client) {
		setTimeout(function(){
			clip.setText(btn.attr("data-clipboard-text")); // set the text after loaded
			btn.parent().addClass("loaded"); // button won't display until loaded
			$(".flash-wrapper").on("click", function(e) {
				e.preventDefault();
			});
		}, 200);
	});

	clip.on( 'complete', function(client, args) {
		// Show the indicator
		btn.parent().addClass("done open");
		setTimeout(function(){
			// Hide the indicator after 4s
			btn.parent().removeClass("open");
		}, 2000);
		setTimeout(function(){
			btn.parent().removeClass("done");
		}, 2200);
		analytics.track("copied email");
	});
}