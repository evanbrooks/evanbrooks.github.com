// Hey, I wrote this, but feel free to reuse it any
// way you like, no attribution required!
// - Evan


function Lightbox() {
	var targ;
	var img = $(".lightbox");
	var tH, tW, tT, tL;

	this.viewImage = viewImage;
	this.clearImage = clearImage;

	function viewImage(e) {
		e.preventDefault();
		targ = $(e.target);
		src = targ.attr("src");

		tW = targ.width();
		tH = targ.height();
		tT = targ.position().top;
		tL = targ.position().left;

		endW = wind.width();
		endH = wind.height();
		endL = 0;
		endT = 0;

		img.find("img").attr("src", src);

		// if (tW/tH > endW/endH) {
		//	endT = (endH - tH) / 2;
		// }

		// Starting position
		// ----
		img.off().show().css({
			"-webkit-transition": "none",
			"width": tW,
			"height": tH,
			"top": tT,
			"left": tL
		}).fadeIn().css({
			"-webkit-transition": "all 0.4s",
			"width": endW,
			"height": endH,
			"top": endT,
			"left": endL
		});
		targ.addClass("being-viewed");
		body.addClass("viewing-lightbox");
	}
	function clearImage(e) {
		e.preventDefault();

		// Ending position
		// ----
		img.css({
			"width": tW,
			"height": tH,
			"top": tT,
			"left": tL
		}).afterTransition(function(){
			targ.removeClass("being-viewed");
			body.removeClass("viewing-lightbox");
			img.fadeOut();
		});
	}
}