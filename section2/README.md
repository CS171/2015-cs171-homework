Section 2
===

Last week, we learned to draw vector graphics in the browser. Today, we will draw graphics *that encode data*.

What you should know after this Section are core skills in ...

... Javascript:

* What are arrays and objects in JavaScript and how they are encoded in JSON.
* What are functions in Javascript and why they are first class citizens.
* What asynchronous means, and what are callback functions.

... D3:

* How to bind data to graphical elements in D3.
* Working with scales in D3.
* Loading data from a file in D3. 
* Understand the Enter, Update and Exit sets for binding data in D3.
* Wrangling your data in D3 (Nesting).


*Italicized text are instructions for your TFs.*

----
**Setup**

* Open `bare.html` and `not-so-bare.html` in browser tabs
* Open `not-so-bare.html` in a text editor (large font size)

----

Data-driven documents
---
*Go to the `bare.html` browser tab. Open the Developer Tools Elements pane with the console drawer expanded. 20 minutes; demonstration only*

We know how to draw basic shapes, like rectangles. 

*do not execute: syntax refresher only. Explain code.*

```js
svg.append("rect")
  .attr("fill", "steelblue")
  .attr("width", 100)
  .attr("height", 25)
  .attr("x", 50)
  .attr("y", 50);
```

Let's use our rectangle-creating ability to visually encode data. Say, an array of numbers: `[10, 45, 105, 69, 80, 55, 200]`. First, let's create many rectangles.

```js
var rect = svg.selectAll("rect")
    .data([10, 45, 105, 69, 80, 55, 200])
  .enter().append("rect");
```

This code is a very common D3 pattern. We'll break it apart later, but for now consider it a standalone magic incantation: the code block tells D3 to create as many `<rect>`s as there are data elements.

But where are our rectangles? Let's give them `width`, `height`, `x` and `y` attributes.

```js
rect
  .attr("fill", "steelblue")
  .attr("width", 100)
  .attr("height", 25)
  .attr("x", 50)
  .attr("y", 50);
```

The magic snippet earlier also does something else: it *binds the data elements to `rect` elements*.

Every data element — `10`, `45`, etc. — is individually tied to a rectangle. The data and the SVG elements are connected: they are *bound*.

Given an element, we can always retrieve the particular data element bound to it.

*select a few `rect`s and show their associated `__data__` in the properties pane of the Developer Tools*

This enables something very powerful: we can set element attributes as *a function* of the data. 

```js
rect
	.transition()
	.attr("y", function(d, i) {
		console.log(d, i);
		return d;
	});
```

We've just made our first data visualization! We've encoded data in the y position of the rectangles.

This is a *data-driven document*. Changing the data updates the document.

We can do any computation in the function. Let's spread things out.

```js
rect
	.transition()
	.attr("y", function(d, i) {
		return d * 3;
	});
```

Functions can return any data type — including strings.

```js
rect
	.transition()
	.attr("fill", function(d, i) {
		if (d < 50)
			return "green";
		else
			return "red";
	});
```

### Scales

Our `d * 3` is clunky and hardcoded for this dataset. We really need a function to map the input to the output — compressing or contracting the range as needed.

[![D3 scales](http://i0.wp.com/www.jeromecukier.net/wp-content/uploads/2011/08/d3scalePower.png)](http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/)

We need a *scale*.

```js
var scale = d3.scale.linear()
  .domain([0,200])
  .range([0,900]);
```

You might not be familiar with this syntax, but `scale` is a function. Let's try it out.

```js
scale(0);
```

*demo a few other scale values*

We could also, for example, use `d3.scale.log()` instead.

Let's update our code to take advantage of our new `scale` function.

```js
rect
	.attr("y", function(d) {
		return scale(d);
	});
```

We also have scales that map to non-numeric ranges. For example, color.

```js
var color = d3.scale.linear()
  .domain([0,200])
  .range(["green","red"]);
```

```js
rect
	.transition()
	.attr("fill", function(d, i) {
		return color(d);
	});
```

---

Exercise: a bar chart
---
*Instruct students to open `not-so-bare.html`. 15 minutes; exercise*

We were doing our work interactively in the console, but this file contains what we've done up to now, cleaned up a bit.

Let's make sure it still works as expected. *open `not-so-bare.html` in a browser*

**Exercise**: Change our rectangle-creating code to encode data with a horizontal bar chart. No need for axis or labels, just bars.

*tip: instruct students to start with specifying the width before specifying the y position*

---


Working with data
---
*Open `chart.html`. 40 minutes; demonstration only*

Our data is hardcoded, but in most cases, we'll be fetching data from an external service.

Let's remove `var data = ...` and instead retrieve the data from `data.json`. But how?

### Callbacks and asynchronous execution

Retrieving the data may take a while but we don't want to stop all our work waiting for it. We want to fetch the data *asynchronously*: we want to be woken up — *called back* — when the data is ready.

`d3.json` does exactly that.

```js
  d3.json("data.json", function(data) {
  
    var scale = d3.scale.linear()
      .domain([0, 200])
      .range([0, width]);
    ...
      .attr("y", function(d, i) {
          return (bar_height + 5) * i;
      });

  });
```

Everything inside the curly brackets (`{...}`) will be executed only when the data is available. This is know as a *callback*.

We also move out most scale logic from the callback.

```js
  var bar_height = 50;

  var scale = d3.scale.linear()
      .range([0, width]);
    
  d3.json("data.json", function(data) {
...
```

### Data types

*examples only: do not execute code in this section*

Data in D3 is a *list of things*. A list of anything. Negative numbers, floating-point numbers, strings, etc.

Say, a list of recent Crimson headlines.

```js
[
  "Defense Powers Football to 45-0 Shutout of Columbia",
  "Yale Faculty Approves CS50 Venture; Harvard Mum",
  "Pomp Marks Student Opening of Renovated Harvard Art Museums",
  "(A+)bove but (B-)elow Average",
  "Bol Authorized Study that Photographed Faculty, Students in Class without Notice",
  "Case Study: Consulting After College",
  "Fifteen Hottest Freshmen '17: Date Spots"
]
```

These lists are called *arrays*. Brackets (`[...]`) indicate arrays.

We can access individual data elements with their position. (we start counting at 0!)

```js
data[0]   // "Defense Powers Football to 45-0 Shutout of Columbia"
```

Arrays can also include other arrays. Say, an array of temperatures for major cities.

```js
[
	["San Francisco", 66.38],
	["Boston", 21.51],
	...
	["London", 34.34],
]
```

We access San Francisco's temperature like so.

```js
data[0][1]   // 66.38
```

But this is clunky: we have to remember that the 0th element is the city name and the 1th element is the temperature.

We really want labels. We want *key-value pairs*.

```js
[
	{
		"city": "San Francisco",
		"temperature": 66.38		
	},
	{
		"location": "Boston",
		"temperature": 21.51
	},
...
	{
		"location": "London",
		"temperature": 34.34
	}
]
```

We can now refer to temperature by name.

```js
data[0]["temperature"]   // 66.38
```

These key-value pairs are called *objects*. Curly brackets (`{...}`) indicate objects.

*open `weather.json` in a text editor and describe its structure*

Notice the `.json` extension: [JSON](https://en.wikipedia.org/wiki/JSON) is the term for this data format. It hierarchically represents lists and key-value pairs.

### More complex data source

Let's use our bar chart-making ability to understand this data.

What if we just change the data source in our code?

```js
  d3.json("weather.json", function(data) {
...
```

Oh no. Invalid `width` attribute.

Let's look at how we're setting width.

```js
...
    .attr("width", function(d, i) {
        return scale(d);
    })
...
```

`d` is the individual data bound to each element —  `d` is now more complicated. It's no longer something like `10`, it's now something like `{"temperature": 66.38, "location": {"city": "San Francisco", "country": "US" }}`.

We need to tell D3 exactly whats we want to plot — the temperature? the city?

```js
...
    .attr("width", function(d, i) {
          return scale(d["temperature"]);
    })
...
```

Nice! Let's also add a tooltip — a `<title>` element — so we can identify bars.

```js
...
    rect.append("title")
      .text(function(d, i) {
        return d["location"]["city"];
      });
  });
```

Since the inner `title` element doesn't have data bound to it, it can use the data bound to its parent (the `rect`).

### Dynamic updates: data joins

*open `chart-interactive.html`*

Let's make something interactive. `chart-interactive.html` has a filtering checkbox and a bit of provided plumbing.

When the user clicks the checkbox, `update()` is called with the new data to plot. We need to add code to `update()` so that it redraws our graph.

Let's update the rectangles' data.

```js
    var rect = g.selectAll("rect")
        .data(new_data);
```

This is a *data join*. We're merging new data with existing elements, but we need to specify how the new data is matched up with the elements.

[![Thinking with joins](images/join.png?raw=true)](http://bost.ocks.org/mike/join/)

We need to specify what happens on:

 * **Enter** (if there's more new data points than existing data points/elements)
 * **Update**
 * **Exit** (if there's fewer new data points than existing data points/elements)

#### Enter

What attributes do we need to set on new elements?

Everything! Let's copy every attribute we originally specified when creating the graph.

```js
    rect.enter().append("rect")
      .attr("fill", "steelblue")
      .attr("width", function(d, i) {
          return scale(d["temperature"]);
      })
      .attr("height", bar_height)
      .attr("x", 0)
      .attr("y", function(d, i) {
          return (bar_height + 5) * i;
      });
```

#### Update

Existing elements already have a fill, width, etc. But we need to ensure that their width and y matches their data.

We need to set a width and y to both enter and update groups, so let's do that together.


```js
    rect.enter().append("rect")
      .attr("fill", "steelblue")
      .attr("height", bar_height)
      .attr("x", 0);

    rect
      .attr("width", function(d, i) {
          return scale(d["temperature"]);
      })
      .attr("y", function(d, i) {
          return (bar_height + 5) * i;
      });
```

#### Exit

What do we do to elements that are not associated with data anymore? (i.e. there were fewer data points than elements)

Let's remove them.

```js
    rect.exit()
      .remove();
```

Let's try it now. Nice!

These concepts are important: [Three Little Circles](http://strongriley.github.io/d3/tutorial/circle.html) might help you grasp it further.

Oh, but notice the fourth bar: we're not updating tooltips.

We need to select the `title`s to update them. *example only*

```js
d3.selectAll("rect").select("title")
  // ...code to update tooltips
```

This is a [nesting selector](http://bost.ocks.org/mike/nest/).

We already have a variable for `d3.select("rect")` (`rect`), so `rect.select("title")` will do. Let's add code for updating the title's text.

```js
    rect.select("title")
      .text(function(d, i) {
        return d["location"]["city"];
      });
```

---

*See you next week!*


Additional explanations: JavaScript concepts
---

This section gives only a short intro to some core concepts in JavaScript.

###Datatypes in Javascript 
There are **simple datatypes** in Javascript like numbers and strings. They can be assigned to variables

```javascript
var numberX = 1;
var numberY = 1.3;
var title = "Hello World";
```

Besides these simple datatypes, Javascript offers collections of data called **arrays**. They can be seen as a bag of data in a specific order. Arrays are surrounded by square rackets `[]` and elements are listed comma separated `[ el1, el2, ...]`. An element can be directly addressed by its position in the array (we start counting positions at 0 !). Some examples:

```javascript
var someNumbers = [1,2,3,4];
var someTexts = ["abc","def","ghi"];

var getSecondElement = someTexts[1]; // --> "def"
someNumbers[2] = 5; // changes someNumbers to [1,2,5,4]
```

There are also **objects** in Javascript. These are collections of key-value pairs, also known in other programming languages as *maps*. For each key in an object there exists a corresponding value. These key-value assignments are surrounded by curly brackets `{}`, pairs are separated by commas `{X,Y,Z}`, and each key-value pair is marked by a colon `key : value`. Values can be retrieved by key names. See examples below:

```javascript
var oneObject = { 
		"students": 220, 
		"title":"CS172", 
		"ratings":[5,4,3,5] 
		};
			
var noOfStudents = oneObject["students"]; // --> 220
oneObject["title"] = "CS171"; // Thats actually the name of this great CS course
	
var allRatings = oneObject["ratings"] // -> [5,4,3,5] 
var allRatingsAlt = oneObject.ratings // works also -> [5,4,3,5] 

var secondRating = oneObject["ratings"][1] // -> 4 
```

One of the most powerful datatypes in Javascript is a **function**. Unlike in other languages you might know already, a function is a first class citizen, which means you can treat it like any other variable. Functions map inputs to outputs. This mapping is expressed as a series of commands. In Javascript, a function takes parameters and returns a result. It can be assigned to a variable. Here are two function declarations:

```javascript

var addNumbers = function(a,b){ 	// create a function and assign it to a variable.
										// the function takes two parameter a and b
		return a+b;					// return a+b as result
	}

var sumX = addNumbers(12,24); // --> 36

var multiplyNumbers = function(a,b) { return a*b;};
var multX = multiplyNumbers(12,13) //-> 156
```

Since you can treat them as any other data type, you can put functions into arrays and objects, or as parameters to other functions. Some crazy things you can do are shown here. After getting this idea, you will love it - guaranteed:

```javascript
// we re-use t the variables from before

var multiplyByTwo = function(c){ return multiplyNumbers(2,c);} // new function with fixed parameter
var eightTimesTwo = multiplyByTwo(8); // --> 16

var calculusObject = {
		"add":addNumbers,
		"mult":multiplyNumbers,
		"m2":multiplyByTwo
		};
		
var fourTimesTen = calculusObject["mult"](4,10); // -> 40
var fourTimesTenAlternative = calculusObject.mult(4,10); // -> 40

var wrangleNumbers = function (f,a,b){ // declare a function with three paramaters
		return f(a,b); // return the result of calling function f with parameters a and b
}

var addTwelveAndThree = wrangleNumbers(addNumbers, 12, 3); //-> 15
var seventeenTimesFour = wrangleNumbers(calculusObject.mult, 17, 4); //-> 68
```

*@Instructor: Let your students applaud here as expression of fascination :).*

###Asynchronous and Callbacks -- Whaaaat ?

Javascript has some functions that do not return a result immediately but instead give you a signal when they are done. This is useful if you wish your webpage to perform time-intensive work, to allow execution elsewhere to continue, and for you to be notified when the work was completed. It will call a feedback function (callback function) as soon as the initiated task has finished. 

As analogy, imagine that you ask a friend to buy you a coffee. During the time that it takes him/her to go to the cafe and get back, you don't want to idle. But when s/he returns you want to say "Thank you". You initiated an task that is not synchronized to yourself (you don't know when s/he will come back). In Javascript you would express the scenario like this:

```javascript
var thankYouFunction = function(coffee, mistake){
					if (mistake){
							say("No worries, Thank you.");
					}else if (coffee.hasCrema == true)  {
							say("That's amazing coffee. Thank you.");
					}
				}
sendMyFriendForCoffee("Macchiato", 2.68, thankYouFunction)
```
You send you friend for a "Macchiato" and you give her/him $2.68 to pay. As soon as s/he returns a callback-function is called that takes two parameters: *coffee* contains the coffee object, and *mistake* is true if a mistake happened. The actions taken in the `thankYouFunction` is subjective to your manners :)

A more typical Javascript scenario for long-lasting processes is loading a file. This will be described later in the Section document in the context of D3.