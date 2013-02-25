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

	$("#prev").click(scroller.prevItem);
	$("#next").click(scroller.nextItem);

	$(".project").scroll(proj.scrolling);

	html.on("click", "[data-item-name]", proj.viewItemClick)
			.on("click", "[data-item-link]", proj.viewItemInterLink)
			.on("click", ".spinner, .ex, .project-back", proj.clearItemClick)
			.on("click", "[data-lightbox]", lb.viewImage)
			.on("click", ".lightbox, .lightbox-back .ex", lb.clearImage);

}

function Scroller() {
	this.nextItem = nextItem;
	this.prevItem = prevItem;
	this.scrolling = scrolling;

	scrolling();
	refresh();

	function nextItem() {
		var scroll = wind.scrollLeft();
		for (i = 0; i < slide.length; i++) {
			pos = $(slide[i]).offset().left;
			if (pos > scroll) {
				body.animate({"scrollLeft": pos}, 200);
				break;
			}
		}
	}

	function prevItem() {
		var scroll = wind.scrollLeft();
		for (i = slide.length - 1; i >= 0; i--) {
			pos = $(slide[i]).offset().left;
			if (pos < scroll) {
				body.animate({"scrollLeft": pos}, 200);
				break;
			}
		}
	}

	function scrolling() {
		topScroll = wind.scrollTop();
		midScroll = topScroll + wind.height()/2;
		bottomScroll = topScroll + wind.height();

		var foundCurrent = false;
		$.each(itemData, function(i, item) {
			if (!foundCurrent) {
				if ( item.top < topScroll ) {
					item.div.attr("data-position", "above");
				}
				if ( item.top > topScroll && item.top < midScroll && item.bottom < bottomScroll) {
					item.div.attr("data-position", "current");
					foundCurrent = true;
				}
			}
			else {
				item.div.attr("data-position", "below");
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
		title.freeze().css({
			"top": (-1 * el.scrollTop() / 4)+"px"
		});
	}

	function viewItemPop(str) {
		targ = $("[data-item-name = "+str+"]");
		viewItem();
	}

	function viewItemClick(e) {
		e.preventDefault();
		targ = $(e.target);
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
			}, 1000);

		});

		body.addClass(id);

		var title_str = targ.html();
		tW = targ.width();
		tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		tL = targ.offset().left - wind.scrollLeft();
		fS = targ.css("font-size");
		fF = targ.css("font-family");
		tF = targ.css("text-transform");

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
				"text-transform": tF,
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

		pos = targ.parent().offset().top;
		body.animate({"scrollTop": pos}, 500, function(){
			body.css("overflow", "hidden");
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

		tW = targ.width();
		tH = targ.height();
		tT = targ.offset().top - wind.scrollTop();
		tL = targ.offset().left - wind.scrollLeft();
		body.removeClass("viewing-item");
		title.unfreeze().css({
			"width": tW,
			"height": tH,
			"top": 0,
			"font-size": fS,
			"color": "black",
			"-webkit-transform": "translate3d("+tL+"px,"+tT+"px,0)"
		}).afterTransition(function(){
			targ.removeClass("being-viewed").fadeIn().unfreeze();
			title.hide();
			body.css("overflow", "");
			el.scrollTop(0);
		});

		setTimeout(function(){
			title.removeAttr("style");
			body.removeClass(id);
			cb();
		},500);
	}
}

function refresh() {
	$.each($(".item-name"), function(i, item) {
		var self = $(item);
		itemData[i] = {
			div: self,
			top: self.offset().top,
			bottom: self.offset().top + $(item).innerHeight()
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