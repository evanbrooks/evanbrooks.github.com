$(function(){
	var $view = $(".view");
	var $body = $("body");
	var $over = $(".matte");
	var $currItem = null;

	var $itemName = $(".view .title");
	var $itemDate = $(".view .subtitle");
	var $itemContent = $(".view .content");


	var strtX = 0;
	var dX = 0;

	var strtPad = 0;
	var drag = false;

	var INDEX = 0; // const
	var ITEM = 1; // const
	var view = INDEX;

	$(".item .inner, .matte").click(function(e){
		if ($currItem != null)
			$currItem.removeClass("active"); // remove from old item
		$currItem = $(this);			     // switch to new item
		$currItem.addClass("active");	     // make active
		toggleItem($currItem.attr("data-item"));
	});

	$view.mousedown(function(e){
		strtX = e.pageX;
		drag = true;
		$view.css("-webkit-transition","none");
		$body.css("-webkit-transition","none");
		$over.css("-webkit-transition","none");
		strtPad = parseInt($body.css("padding-left"));
	});

	$body.mousemove(function(e){
		if (drag == true ) {
    		dX = e.pageX - strtX;
    		dPad = strtPad + dX / 15;
    		$view.css("-webkit-transform", "translate3d("+dX+"px,0,0)");
    		if (dPad < 100) $body.css("padding-left", dPad+"px");
    		else 			$body.css("padding-left", "100px");
    		$over.css("opacity", 1 - dX / 1000);
    	}
	});

	$view.mouseup(function(e){
		drag = false;
		$view.removeAttr("style");
		$body.removeAttr("style");
		$over.removeAttr("style");
		if ( dX > 400 ){
			toggleItem();
		}
	});

	function toggleItem(whichItem) {
		if (view == ITEM) {
			$body.removeClass("view-item-mode");
			view = INDEX;
			history.pushState({}, "", "/");
  		}
		else if (view == INDEX) {
			$body.addClass("view-item-mode");
			view = ITEM;
			url = whichItem+".html";
			console.log(whichItem);
			history.pushState({}, "", whichItem);
			$.ajax(url).done(function ( data ) {
				content = data.split('==');
				$itemName.html(content[0]);
				$itemDate.html(content[1]);
				$itemContent.html(content[2]);
			}).error( function(xhr, textStatus, errorThrown){
				$itemName.html("");
				$itemDate.html("");
				$itemContent.html("Still working on this");
			});
		}
	}

});
