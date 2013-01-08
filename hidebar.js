function hideAddressBar() {
  if(document.height <= window.outerHeight) {
      document.body.style.height = (window.outerHeight + 60) + 'px';
  }

  setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
}
 
window.addEventListener("load", function(){
	if( isTouchDevice() ){
		hideAddressBar();
	}
});

window.addEventListener("orientationchange", hideAddressBar );
