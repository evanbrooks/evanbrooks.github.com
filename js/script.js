// Hey, I wrote this, but feel free to reuse it any
// way you like, no attribution required!
// - Evan

var iphone = isiPhone();

var wind = $(window);
var html = $("html");
var index = $(".scroller");
var body = $("body, html");
var slide = $("article");

var itemData = [];
var catchme;

var lb = new Lightbox();
var scroller = new Scroller();
var proj = new Projectbox(".project");
var cont = new ContentGetter();

bindHandlers();
cont.listen(); // Listen for history state changes
setupZClip();

function bindHandlers() {
	if (!iphone) {
		wind.scroll(scroller.scrolling);
	}
	wind.resize(refresh);
	$(".project").scroll(proj.scrolling);
	$(".project").on("touchmove", proj.scrolling);
	$(".project").on("mousedown touchstart", function(){
		$(".project-title").css("opacity", 0);
	});
	$(".project").on("touchend mouseup", function(){
		proj.scrolling();
	});

	html.on("click", "[data-item-name] b", proj.viewItemClick)
			.on("click", "[data-item-link]", proj.viewItemInterLink)
			.on("click", ".spinner, .ex, .project-back", proj.clearItemClick)
			.on("click", "[data-lightbox]", lb.viewImage)
			.on("click", ".lightbox, .lightbox-back .ex", lb.clearImage);
}
var currentvid;
function Scroller() {
	this.scrolling = scrolling;

	refresh();
	scrolling();

	function scrolling() {
		topScroll = wind.scrollTop();
		midScroll = topScroll + wind.height()/2;
		bottomScroll = topScroll + wind.height();

		if (topScroll > catchme) {
			$("#catch").css({
				"position": "fixed",
				"overflow": "auto",
				"-webkit-backface-visibility": "hidden",
				"top": "1em"
			});
		}
		else {
			$("#catch").removeAttr("style");
		}

		var foundCurrent = false;
		$.each(itemData, function(i, item) {
			if (!foundCurrent) {
				// Above the current item
				if ( item.top < topScroll ) {
					item.div.attr("data-position", "above");
					if (typeof item.vid != "undefined") item.vid.pause();
				}
				// The current item
				if ( item.top > topScroll && item.top < midScroll /*&& item.bottom < bottomScroll*/) {
					item.div.attr("data-position", "current");
					if (typeof item.vid != "undefined") {
						currentvid = item.vid;
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
	var el = $(projectElement);
	var targ;
	var id;
	var title = $(".project-title");
	var fig = $(".project-main-figure");
	var tH, tW, tT, tL;

	this.viewItemPop = viewItemPop;
	this.viewItemInterLink = viewItemInterLink;
	this.viewItemClick = viewItemClick;
	this.clearItem = clearItem;
	this.clearItemClick = clearItemClick;
	this.scrolling = scrolling;

	function scrolling(){
		if (el.scrollTop() > 100) {
			title.css("opacity", "0");
		}
		else {
			title.css("opacity", "1");
		}
		// title.freeze().css({
		// 	"top": (-1 * el.scrollTop() * 0.5)+"px",
		// 	"opacity": 1
		// });
	}

	function viewItemPop(str) {
		targ = $("[data-item-name = "+str+"]");
		if (targ.length < 1){
			targ = $("#missing");
		}
		viewItem();
	}

	function viewItemClick(e) {
		e.preventDefault();
		targ = $(e.target).parent();
		viewItem();
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
		body.addClass("loading");
		el.html("");
		cont.getItem(id, t, function(data){
			setTimeout(function(){
				el.html(data);
				el.imagesLoaded(function(){
					body.removeClass("loading");
					analytics.track("Viewed " + id);
					initiateProject();
				});
			}, 500);
		});

		body.addClass(id);

		var title_str = targ.html();
		tW = targ.width();
		tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		tL = targ.offset().left - wind.scrollLeft();
		fS = targ.css("font-size");
		fF = targ.css("font-family");

		endL = wind.width()/10 + "px";

		targ.freeze().addClass("being-viewed").css("border-color", "transparent");

		el.css("padding-top", (tH + 80) + "px");

		title.children("span").html(title_str);
		title
			.freeze()
			.css({
				"width": tW,
				"height": tH,
				"padding": "0px",
				"font-size": fS,
				"font-family": fF,
				"color": "black",
				"-webkit-transform": "translate3d("+tL+"px,"+tT+"px,0)",
				"-moz-transform": "translate3d("+tL+"px,"+tT+"px,0)"
			})
			.show()
			.fadeIn()
			.unfreeze()
			.css({
				"font-size": "",
				"-webkit-transform": "translate3d("+endL+",50px,0)",
				"-moz-transform": "translate3d("+endL+",50px,0)",
				"color": ""
			});

		pos = targ.parent().offset().top - 80;
		body.animate({"scrollTop": pos}, 500, function(){
			body.css("overflow", "hidden");
			(".item figure").hide();
		});
		body.addClass("viewing-item");
		body.afterTransition(function(){
			//
		});
	}

	function clearItemClick(e){
		e.preventDefault();
		cont.clearItem();
		clearItem(function(){});
	}

	function clearItem(cb) {
		if (typeof cb == "undefined") cb = function(){};
		if (!targ) return;

		//tW = targ.width();
		//tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		//tL = targ.offset().left - wind.scrollLeft();
		// $(".item figure").show();
		body.removeClass("viewing-item");
		title.unfreeze().css({
			"width": tW,
			"height": tH,
			"top": 0,
			"font-size": fS,
			"color": "black",
			"opacity": 1,
			"-webkit-transform": "translate3d("+tL+"px,"+tT+"px,0)",
			"-moz-transform": "translate3d("+tL+"px,"+tT+"px,0)"
		});
		function finish(){
			targ.removeClass("being-viewed").fadeIn().unfreeze().removeAttr("style");
			title.hide();
			body.css("overflow", "");
			el.scrollTop(0);
			analytics.track("Closed " + id);
		}
		setTimeout(function(){
			finish();
			title.removeAttr("style");
			body.removeClass(id);
			cb();
		}, 500);
	}
}

function refresh() {
	$(".item figure").hide().fadeOut().show();
	catchme = $("#catch").offset().top;
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