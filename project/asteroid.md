<script>
	initiateProject = function() {
		var slider = new Swipe(document.getElementById('slider1'), {
			speed: 400,
			// auto: 3000,
	    	callback: function(event, index, elem) {
	    		$(".pagination .current").removeClass("current");
				$(".pagination :nth-child("+(index+1)+")").addClass("current");
	    		$("#slider1 .current").removeClass("current");
	    		$(elem).addClass("current");
			}
	    });
		$("#slider1").click(function(){
			slider.next();
		});
		$(".pagination > li").mouseup(function(){
			ind = $(this).index();
			slider.slide(ind, 300);
		});
		$(".prev").click(function(){
			slider.prev();
		});
		$(".next").click(function(){
			slider.next();
		});
	}
</script>

<!-- <figure>
	<div class="browser">
		<img src="img/locu/locu-ui.png"/>
	</div>
</figure>
 -->
Restaurant owners have been sold a whole tangled mess of services to appease their tech-savvy customers, and Locu's task is to untangle it.

When I first met Locu, they had set out to collect and organize all the small business data available. My task was to reconcile the structured nature of data with the messy and complicated needs of business owners.

### 1 - Branding

<figure>
	<img src="img/locu/logo.png"/>
</figure>

The name Locu stuck early on - it manages to be both unique and descriptive without feeling too goofy (the pitfall of countless internet startups) or too stodgy (the pitfall of many other business-to-business companies).


<figure class="bleed">
	<img src="img/locu/brandguide.png"/>
	<h5>I designed and built a small internal website for our brand guidelines.</h5>
</figure>


The identity system conveys a fresh, bright confidence.

<figure class="inset bleed">
	<img src="img/locu/sticker.png"/>
	<h5>Die-cut stickers by [stickermule](//stickermule.com)</h5>
</figure>


### 2 - A flexible design system

<figure>
	<img src="img/locu/mediaicons.png"/>
</figure>


Locu treats the menu’s physical and online representation as a single document. We used responsive web design practices plus a custom print layout system to tie everything together.
<figure>
	<div id="slider1" class="slider">
		<ul>
			<li class="current">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/circle_c.png"/>
					<img class="b" src="img/locu/theme/circle_b.png"/>
					<img class="a" src="img/locu/theme/circle_a.png"/>
				</div>
				<h5>Pop — fun and retro-inspired</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/metric_c.png"/>
					<img class="b" src="img/locu/theme/metric_b.png"/>
					<img class="a" src="img/locu/theme/metric_a.png"/>
				</div>
				<h5>Metric — clean and precise</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/slab_c.png"/>
					<img class="b" src="img/locu/theme/slab_b.png"/>
					<img class="a" src="img/locu/theme/slab_a.png"/>
				</div>
				<h5>Slab — sturdy and honest</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/original_c.png"/>
					<img class="b" src="img/locu/theme/original_b.png"/>
					<img class="a" src="img/locu/theme/original_a.png"/>
				</div>
				<h5>Original — simple and sophisticated</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/grid_c.png"/>
					<img class="b" src="img/locu/theme/grid_b.png"/>
					<img class="a" src="img/locu/theme/grid_a.png"/>
				</div>
				<h5>Grid — bold and vibrant</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/metropolitan_c.png"/>
					<img class="b" src="img/locu/theme/metropolitan_b.png"/>
					<img class="a" src="img/locu/theme/metropolitan_a.png"/>
				</div>
				<h5>Metroplitan — dramatic and playful</h5>
			</li>
			<li style="display: none">
				<div class="wrapper">
					<img class="c" src="img/locu/theme/squares_c.png"/>
					<img class="b" src="img/locu/theme/squares_b.png"/>
					<img class="a" src="img/locu/theme/squares_a.png"/>
				</div>
				<h5>Squares — boistrous and busy</h5>
			</li>
		</ul>
	</div>
	<ul class="pagination">
		<li class="current"></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
	</ul>
	<div class="prev">➔</div> 
	<div class="next">➔</div>
</figure>

Every starting template has simple controls for color and type so restaurants can maintain their identities, but underneath it’s simply *HTML* and *CSS*. Designers and developers can choose to make simple templates with lots of options or ones specialized to a specific purpose. We took inspiration from tumblr's theming ecosystem—no limits to design, but the structure of the content remains the same.


### 3 - Design + Publish

Restaurants have to manage a mess of technology to actually get anything published. Their in-restaurant menu is a local Word *.doc* or *PDF*. Updates to the web site require emailing a web master and either linking their print *PDF* or retyping it as *HTML*. And now they are expected to put it on Facebook, make it mobile-friendly, add an online-ordering system, and keep track of themselves on every new food/social app? 


### 4 - Editing structured datas

A restaurant menu has clear hierarchy and typographic contrast, so the form interface does too. 

<figure class="bleed">
	<video loop autoplay="autoplay" webkit-playsinline>
		<source src="/img/locu/locu-edit.mp4" />
		<source src="/img/locu/locu-edit.webm" />
	</video>
	<h5>Click on any text, and you're editing it in place — each item doesn't need its own “Edit” button.</h5>
</figure>

By contrast, older interfaces for structured data suffer from an explosion of form inputs. They're designed to accomodate the developer, and they get pretty irritating when you need to get something done. 

<figure class="bleed">
	<video loop autoplay="autoplay" webkit-playsinline>
		<source src="/img/locu/locu-options.mp4" />
		<source src="/img/locu/locu-options.webm" />
	</video>
	<h5>Instead of an explicit button for "Add option", the interface makes sure there's always an available space</h5>
</figure>

Restaurant people are always busy, so the interface is designed to have few interruptions. Instead of stopping everything to confirm a delete, we use an in-place undo button that persists until the user publishes. 

<figure class="bleed">
	<video loop autoplay="autoplay" webkit-playsinline>
		<source src="/img/locu/locu-undo.mp4" />
		<source src="/img/locu/locu-undo.webm" />
	</video>
	<h5>Inline undo button makes for a better workflow than a popup navigation.</h5>
</figure>

<!-- <figure class="bleed">
	<video loop autoplay="autoplay" webkit-playsinline>
		<source src="/img/locu/locu-scroll.mp4" />
		<source src="/img/locu/locu-scroll.webm" />
	</video>
	<h5>The entire editing interface is one page, so there's no getting lost.</h5>
</figure> -->


<!-- <figure class="inset bleed">
	<img src="img/locu/locu-scroll.gif"/>
</figure>
 -->

### 5 - Current status

10,000 restaurants use the tools. OpenTable, CitySearch, TimeOut and countless others use Locu data.

<a href="//locu.com">Visit Locu.com</a>


-----

#### Details

##### Interface and brand assets set in [Bariol](http://www.bariol.com/)
##### UX designed in collaboration with [Sol Bisker](http://biskerrific.com/) 
##### Thanks to Rene, Marek, Marc, Stelios, Peter, Zain, and [the rest of the team](https://locu.com/about/team/) for making it all happen