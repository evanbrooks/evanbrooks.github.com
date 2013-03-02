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

		nW = targ.get(0).naturalWidth;
		nH = targ.get(0).naturalHeight;

		marg = endH / 2;
		if (nH < endH) {
			marg = nH / 2;
		}

		img.find("img").attr("src", src);

		// Starting position
		// ----
		img.off().show().css({
			"-webkit-transition": "none",
			"width": tW,
			"height": tH,
			"top": tT,
			"left": tL
		}).fadeIn().css({
			"-webkit-transition": "all 0.3s",
			"width": endW,
			"height": endH,
			"margin-top": -1 * marg + "px",
			"top": endH / 2,
			"left": 0
		});
		targ.addClass("being-viewed");
		body.addClass("viewing-lightbox");
	}
	function clearImage(e) {
		e.preventDefault();

		// Ending position
		// ----
		img.css({
			"margin-top": 0,
			"width": tW,
			"height": tH,
			"top": tT,
			"left": tL,
			"-webkit-transform": "none"
		}).afterTransition(function(){
			targ.removeClass("being-viewed");
			body.removeClass("viewing-lightbox");
			img.fadeOut();
		});
	}
}