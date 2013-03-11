<figure>
	<div class="browser">
		<img src="img/locu/locu-ui.png"/>
	</div>
</figure>

Restaurant owners have been sold a whole tangled mess of services to appease their tech-savvy customers, and Locu's task is to untangle it.

When I first met Locu, they had set out to collect and organize all the small business data available. My task was to reconcile the structured nature of data with the messy and complicated needs of business owners.


### 1 - Editing structured datas

A restaurant menu has clear hierarchy and typographic contrast, so the form interface does too. 

<figure class="inset">
	<img src="img/locu/locu-edit.gif"/>
</figure>

Click on any text, and you're editing it in place — each item doesn't need its own “Edit” button.

<figure class="inset">
	<img src="img/locu/locu-options.gif"/>
</figure>

By contrast, older interfaces for structured data suffer from an explosion of form inputs. They're designed to accomodate the developer, and they get pretty irritating when you need to get something done.

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
</p>


Restaurant people are always busy, so the interface is designed to have few interruptions. Instead of stopping everything to confirm a delete, we use an in-place undo button that persists until the user publishes. 
<figure class="inset">
	<img src="img/locu/locu-undo.gif"/>
</figure>

### 2 - Design + Publish

Restaurants have to manage a mess of technology to actually get anything published. Their in-restaurant menu is a local Word *.doc* or *PDF*. Updates to the web site require emailing a web master and either linking their print *PDF* or retyping it as *HTML*. And now they are expected to put it on Facebook, make it mobile-friendly, add an online-ordering system, and keep track of themselves on every new food/social app?

The design/publish workflow consolidates everything into one step - the save button. That's it.


<figure class="inset">
	<img src="img/locu/locu-scroll.gif"/>
</figure>

### 3 - Building a flexible system for design

<figure>
	<div class="prev" onclick='slider.prev();return false;'>➔</div> 
	<div class="next" onclick='slider.next();return false;'>➔</div>
	<div id="slider1" class="slider">
		<ul>
			<li>
				<img src="img/locu/theme/circle.png"/>
			</li>
			<li>
				<img src="img/locu/theme/metric.png"/>
			</li>
			<li>
				<img src="img/locu/theme/slab.png"/>
			</li>
			<li>
				<img src="img/locu/theme/original.png"/>
			</li>
			<li>
				<img src="img/locu/theme/squares.png"/>
			</li>
			<li>
				<img src="img/locu/theme/metropolitan.png"/>
			</li>
			<li>
				<img src="img/locu/theme/grid.png"/>
			</li>
		</ul>
	</div>
</figure>

<script>
	var slider = new Swipe(document.getElementById('slider1'));
</script>

Locu treats the menu’s physical and online representation as a single document. We used responsive web design practices plus a custom print layout system to tie everything together. Each media type can be previewed in the browser.

The publishing feature caters to both professional designers and restaurant owners. Every starting template exposes variables for color type, and scale, so restaurants can maintain their identities, but underneath it’s simply **HTML** and CSS**. We tppk inspiration from tumblr's templating system — no limits to design, but the structure of the content remains the same.

### 3 - Branding guidelines

The name Locu stuck early on - it manages to be both unique and descriptive without feeling too goofy (the pitfall of countless internet startups) or too stodgy (the pitfall of many other business-to-business companies).

The identity system conveys a fresh, bright confidence.

<figure>
	<img src="img/locu/logo.png"/>
</figure>

### 4 - Current status

10,000 restaurants use the tools. OpenTable, CitySearch, TimeOut and countless others use Locu data.

<a href="//locu.com" class="btn">Visit Locu.com</a>

<hr>

### Details

Interface and brand assets set in [Bariol](http://www.bariol.com/) <br/> UX designed in collaboration with [Sol Bisker](http://biskerrific.com/) <br/>Thanks to Rene Reinsberg, Marek Olsewski, and Marc Piette <br/> Summer 2012