// Hey, I wrote this, but feel free to reuse it any
// way you like, no attribution required!
// - Evan

function ContentGetter() {

	this.getItem = getItem;
	this.clearItem = clearItem;

	var converter = new Showdown.converter({ extensions: ['showmore', 'fig', 'vid'] });

	function getItem(itemName, title, cb) {
		history.pushState({}, "", "/#/"+itemName);
		url = "/posts/"+itemName+"/"+itemName+".md";
		setTitle(title);
		$.ajax(url).done(function (data) {
			var html = converter.makeHtml(data);
			cb(html);
		}).error(function(){
			cb("I don't have anything here right now. <a href='mailto:hello@evn.io?subject=I have a question%20'>Get in touch</a> if you have any questions.");
		});
	}

	function clearItem() {
		history.pushState({}, "", "/");
		setTitle("Portfolio");
	}

	// Detect back button
	// ------------------

	this.listen = function() {
		window.addEventListener('popstate', updateState);
		// Webkit fires a popstate on page load,
		// but firefox does not, so we do some broswer sniffin'
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			updateState();
		}
	};

	function updateState() {
		console.log(window.location.hash);
		if (window.location.hash !== "") {
			whichItem = window.location.hash.split("#");
			whichItem = whichItem[1].replace("/","");
			proj.viewItemPop(whichItem);
		}
		else {
			proj.clearItem();
		}
	}

	function setTitle(title) {
		document.title = "Evan Brooks — "+title;
	}

}
