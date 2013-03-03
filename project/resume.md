<!-- <h2 style="font-size: 50px; font-family: 'apercumedium'; padding-bottom: 1.5rem">
	Hello there, I'm Evan. I'm a designer who likes to code.
</h2> -->

> Hello there, I’m Evan. I design, code, and make things. I’m currently studying at [RISD](//risd.edu). I worked to design better diabetes care at <a href="/#/agamatrix" data-item-link="agamatrix">Agamatrix</a> and helped build a company called <a href="/#/locu" data-item-link="locu">Locu</a>.

>  View my [résumé](//) or say <a class="at" href="mailto:hi@evn.io"> hi @ evanbrooks.co<span class="copy-wrapper"><span class="copy btn" id="copybtn" data-clipboard-text="hi@evn.io"><i>copied ✔</i> copy </span></span></a>

<!-- 

%aside

# Friends

- [Annie Wu](//anniewu.net/) *Product Design*
- [Andrea Nguyen](//andrealikes.to/) *Graphic Design*
- [Daisy Sun](//daisy-sun.com) *Product Design*
- [Isaac Blankensmith](//isaacblankensmith.com) *Product Design*
- [Mary Tao](//marytaodesign.com/) *Graphic Design*
- [Tabitha Yong](//tabithayong.com/) *Graphic Design*
- [Tori Hinn](//vhinn.com) *Graphic Design*
- [Victoria Rushton](//victoriarushton.com) *Lettering, illustration, and design*
 
%endaside
 -->


%aside


<!-- # Skills

### Design

- Typography
- Brand and identity
- Print design
- Web, app, & interface design
- InDesign, Illustrator, Photoshop

### Web

- HTML and CSS
- Responsive web design practices
- Javascript and JQuery
- D3.js and Processing
- Databases, Node.js, REST

### Programming

- Basic Java and Python
- Introduction to algorithms

%endaside



# Experience

### Rhode Island School of Design *Fall 2009 &#10132; Present* 

Studying Graphic Design with courses in Industrial Design

### Brown University *Fall 2012 &#10132; Present* 

Courses in computer science


### Product Designer at Locu *Fall 2010 &#10132; Spring 2012*

I met the Locu founding team members while they were students at MIT, and have worked closely with them creating publishing tools for small business owners. I helped to found the product design team, and I researched, designed, and did front-end development for the product. I also designed the brand, logo, and marketing materials.

<a href="#" data-item-link="locu">See projects</a>

### UI/UX Design Intern at Agamatrix *June 2011 &#10132; April 2012*

AgaMatrix is a mobile health company that created the first iPhone-compatible glucose meters for people with diabetes. I designed interfaces for the iPhone and for low-cost devices, as well as hardware concepts and promotional material.

I learned to work closely with people with diabetes, hardware and software engineers, medical and regulatory experts, and other designers. I started as a summer intern, then worked as a full-time member of the design team for several months following.

<a href="#" data-item-link="agamatrix">See projects</a>

### Art Director at Clerestory *Fall 2009 &#10132; June 2011*

I defined the visual language and concept for a biannual  anthology of writing, visual art, and music selected from RISD and Brown students. I led a small team of designers and oversaw printing.

<a href="#" data-item-link="clerestory">See project</a>

### Freelance design *2006 &#10132; present*

Miscellaneous freelance projects

### California College of the Arts *Summer 2008*

Pre-college program in Industrial Design, one of 5 student awarded a scholarship for outstanding achievement.
 -->





<script>
	// Load zeroclip here to support copying
	// the email address instead of using the mailto:
	var clip;
	if (typeof clip == "undefined") {
		ZeroClipboard.setDefaults({moviePath: "/js/zeroclip.swf"});
		clip = new ZeroClipboard();
	}
	var btn = $("#copybtn");

	// Because we're in a different scrolling context we need to move the zeroclipboard's flash movie from the end of the DOM
	var flash = $("#global-zeroclipboard-html-bridge").remove();
	flash = $(flash).removeAttr("style").css({
		"position": "absolute",
		"width": 20 + btn.width() + "px",
		"height": btn.height() + "px",
		"z-index": 999
	});
	// insert it right before our button
	btn.before(flash); 

	clip.on( 'load', function(client) {
		clip.setText(btn.attr("data-clipboard-text")); // set the text after loaded
	 	btn.parent().addClass("loaded"); // button won't display until loaded
	});

	clip.on( 'complete', function(client, args) {
		// Show the indicator
		btn.parent().addClass("done")
		setTimeout(function(){
			// Hide the indicator after 5s
			btn.parent().removeClass("done")
		}, 5000);
	});
</script>