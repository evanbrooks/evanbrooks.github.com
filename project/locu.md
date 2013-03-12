<script>
	initiateProject = function() {
		var slider = new Swipe(document.getElementById('slider1'), {
			speed: 400,
			//auto: 3000,
	    	callback: function(event, index, elem) {
	    		$(".pagination .current").removeClass("current");
				$(".pagination :nth-child("+(index+1)+")").addClass("current");
	    		$("#slider1 .current").removeClass("current");
	    		$(elem).addClass("current");
			}
	    });
		//$("#slider1").mouseup(function(){slider.next()});
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

<figure>
	<div class="browser">
		<img src="img/locu/locu-ui.png"/>
	</div>
</figure>

Restaurant owners have been sold a whole tangled mess of services to appease their tech-savvy customers, and Locu's task is to untangle it.

When I first met Locu, they had set out to collect and organize all the small business data available. My task was to reconcile the structured nature of data with the messy and complicated needs of business owners.

### 1 - A flexible design system

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
				<h4>Pop — fun and retro-inspired</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/metric_c.png"/>
					<img class="b" src="img/locu/theme/metric_b.png"/>
					<img class="a" src="img/locu/theme/metric_a.png"/>
				</div>
				<h4>Metric — clean and precise</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/slab_c.png"/>
					<img class="b" src="img/locu/theme/slab_b.png"/>
					<img class="a" src="img/locu/theme/slab_a.png"/>
				</div>
				<h4>Slab — sturdy and honest</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/original_c.png"/>
					<img class="b" src="img/locu/theme/original_b.png"/>
					<img class="a" src="img/locu/theme/original_a.png"/>
				</div>
				<h4>Original — simple and sophisticated</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/grid_c.png"/>
					<img class="b" src="img/locu/theme/grid_b.png"/>
					<img class="a" src="img/locu/theme/grid_a.png"/>
				</div>
				<h4>Grid — bold and vibrant</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/metropolitan_c.png"/>
					<img class="b" src="img/locu/theme/metropolitan_b.png"/>
					<img class="a" src="img/locu/theme/metropolitan_a.png"/>
				</div>
				<h4>Metroplitan — dramatic and playful</h4>
			</li>
			<li>
				<div class="wrapper">
					<img class="c" src="img/locu/theme/squares_c.png"/>
					<img class="b" src="img/locu/theme/squares_b.png"/>
					<img class="a" src="img/locu/theme/squares_a.png"/>
				</div>
				<h4>Squares — boistrous and busy</h4>
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


### 1 - Editing structured datas

A restaurant menu has clear hierarchy and typographic contrast, so the form interface does too. 

<!-- <figure class="inset bleed">
	<img src="img/locu/locu-edit.gif"/>
</figure> -->

Click on any text, and you're editing it in place — each item doesn't need its own “Edit” button.

<!-- <figure class="inset bleed">
	<img src="img/locu/locu-options.gif"/>
</figure> -->

By contrast, older interfaces for structured data suffer from an explosion of form inputs. They're designed to accomodate the developer, and they get pretty irritating when you need to get something done.

<!-- 
<p style="padding: 30px; background:rgb(241, 218, 218); margin: 20px 0 2.5em; position: relative;">
	Item 1 - Editing<br>
	<span>
		<input value="This" />
		<select>
			<option>is going to be</option>
			<option>already is</option>
			<option>shouldn't have to be</option>
		</select>
		<input value="a" />
		<input value="pain" />
		<input value="in" />
		<select>
			<option>the neck</option>
			<option>the ass</option>
		</select>
		<input value="to" />
		<input value="keep" />
		<input value="up to date" />
		<button>show more options</button>
		<button>cancel</button>
		<button class="primary" onclick='var retVal = prompt("These popups are extremeley irritating, don’t you think? ", "Yeah");
	   alert("You have entered: " +  retVal );'>save</button>
	</span>
	<br><br>Item 2<br>
	This shouldn't have to be a pain in the neck.
	<button>Edit</button>
	<button>Delete</button>
</p> -->


Restaurant people are always busy, so the interface is designed to have few interruptions. Instead of stopping everything to confirm a delete, we use an in-place undo button that persists until the user publishes. 

<!-- <figure class="inset bleed">
	<img src="img/locu/locu-undo.gif"/>
</figure>
 -->
### 2 - Design + Publish

Restaurants have to manage a mess of technology to actually get anything published. Their in-restaurant menu is a local Word *.doc* or *PDF*. Updates to the web site require emailing a web master and either linking their print *PDF* or retyping it as *HTML*. And now they are expected to put it on Facebook, make it mobile-friendly, add an online-ordering system, and keep track of themselves on every new food/social app?

The design/publish workflow consolidates everything into one step - the save button. That's it.


<!-- <figure class="inset bleed">
	<img src="img/locu/locu-scroll.gif"/>
</figure>
 -->
### 3 - Branding


<figure class="bleed">
	<img src="img/locu/brandguide.png"/>
	<caption>I designed and built a small internal website for our brand guidelines.</caption>
</figure>


The name Locu stuck early on - it manages to be both unique and descriptive without feeling too goofy (the pitfall of countless internet startups) or too stodgy (the pitfall of many other business-to-business companies).

The identity system conveys a fresh, bright confidence.

<figure class="inset bleed">
	<img src="img/locu/sticker.png"/>
</figure>
#### Die-cut stickers by [stickermule](//stickermule.com)


<figure>
	<img src="img/locu/logo.png"/>
</figure>

### 4 - Current status

10,000 restaurants use the tools. OpenTable, CitySearch, TimeOut and countless others use Locu data.

<a href="//locu.com" class="btn">Visit Locu.com</a>

<hr>

### Details

Interface and brand assets set in [Bariol](http://www.bariol.com/) <br/> UX designed in collaboration with [Sol Bisker](http://biskerrific.com/) <br/>Thanks to Rene Reinsberg, Marek Olsewski, and Marc Piette <br/> Summer 2012