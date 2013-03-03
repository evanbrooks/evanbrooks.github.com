// Hey, I wrote this, but feel free to reuse it any
// way you like, no attribution required!
// - Evan

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

bindHandlers();

function bindHandlers() {

	wind.scroll(scroller.scrolling).resize(refresh);

	$(".project").scroll(proj.scrolling);
	$(".project").on("touchmove", proj.scrolling);

	html.on("click", "[data-item-name]", proj.viewItemClick)
			.on("click", "[data-item-link]", proj.viewItemInterLink)
			.on("click", "#copybtn", function(e) { e.preventDefault(); })
			.on("click", ".spinner, .ex, .project-back", proj.clearItemClick)
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


		// if (topScroll < 300) {
		// 	$("nav .inner").css({
		// 		"padding": 50 - (1 * topScroll / 10)+"px 0"
		// 	});
		// }


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
					if (typeof item.vid != "undefined") item.vid.play();
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
		// if (el.scrollTop() > 100) {
		// 	title.css("opacity", "0.1");
		// }
		// else {
		// 	title.css("opacity", "1");
		// }
		title.freeze().css({
			"top": (-1 * el.scrollTop() * 0.5)+"px",
			"opacity": 1
		});
	}

	function viewItemPop(str) {
		targ = $("[data-item-name = "+str+"]");
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
		clearItem(function(){
			targ = $("[data-item-name = "+str+"]");
			viewItem();
		});
	}

	function viewItem() {
		id = targ.attr("data-item-name");
		body.addClass("loading");
		el.html("");
		cont.getItem(id, function(data){
			el.html(data);
			setTimeout(function(){
				body.removeClass("loading");
			}, 100);

		});

		body.addClass(id);

		var title_str = targ.html();
		tW = targ.width();
		tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		tL = targ.offset().left - wind.scrollLeft();
		fS = targ.css("font-size");
		fF = targ.css("font-family");

		console.log(tL);
		if (tL > wind.width()/2) endL = wind.width()/10 + "px";
		else                     endL = tL + "px";

		if (tW < wind.width()/3) tW = wind.width()/3 + "px";
		else                     tW = tW + "px";

		targ.freeze().addClass("being-viewed");

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
				"-webkit-transform": "translate3d("+tL+"px,"+tT+"px,0)"
			})
			.show()
			.fadeIn()
			.unfreeze()
			.css({
				"font-size": "",
				"-webkit-transform": "translate3d("+endL+",50px,0)",
				"color": ""
			});

		pos = targ.parent().offset().top - 150;
		body.animate({"scrollTop": pos}, 500, function(){
			body.css("overflow", "hidden");
			$(".item figure").hide();
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

		// Avoid removing the flash bridge
		var flash = $("#global-zeroclipboard-html-bridge").remove();
		$("body").append(flash);


		//tW = targ.width();
		//tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		//tL = targ.offset().left - wind.scrollLeft();
		$(".item figure").show();
		body.removeClass("viewing-item");
		title.unfreeze().css({
			"width": tW,
			"height": tH,
			"top": 0,
			"font-size": fS,
			"color": "black",
			"opacity": 1,
			"-webkit-transform": "translate3d("+tL+"px,"+tT+"px,0)"
		});
		function finish(){
			targ.removeClass("being-viewed").fadeIn().unfreeze();
			title.hide();
			body.css("overflow", "");
			el.scrollTop(0);
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

(function( $ ){
  $.fn.afterTransition = function(cb){
	var self = this;
    self.on("webkitTransitionEnd", function(){
		cb();
		self.off("webkitTransitionEnd");
    });
  };
})( jQuery );

(function( $ ){
	$.fn.freeze = function(cb){
		this.addClass("no-trans");
		return this;
  };
})( jQuery );

(function( $ ){
  $.fn.unfreeze = function(cb){
		this.removeClass("no-trans");
		return this;
  };
})( jQuery );