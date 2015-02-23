Section 3: Exploring positional data encoding
===

Last week we learned to draw graphics that encode data. Today, we'll explore 2D position encodings in depth.

----
**Setup**

 * Open `nodes.html` in a text editor and browser window (with Developer Tools expanded)
 
----

HW1 feedback
---

*prompt students for feedback (and possibly technical questions) on HW1 as they trickle in*

* *What was most difficult of HW1?*
* *How much time did you spend on HW1?*

Graph
---
*open `nodes.html`*

`nodes.html` is loading data for a few notable characters from *Les Misérables* and drawing circles for each.

*look at source data `characters.json`*

We could use the circles for a scatterplot — for example, we could set the `x` to the birth date of the character and `y` to be the length of their name.

Right now we're drawing circles at random positions — we're setting `cx` and `cy` as a function of `Math.random()`. *refresh a few times*

### Layouts

What if we wanted our random circles to be roughly the same distance from each other? How can we do that?

A common way to generally enforce constraints between elements is known as *force directed layout*. `var force = ...` is how we define that in D3 — let's look at how `force` works.

All the heavy lifting occurs in `force.on("tick", ...)`. Let's log the first data element to the console.

```js
force.on("tick", function() {
	console.log(data[0]);
});
```

*open the console drawer of the Developer Tools and refresh*

That's a lot of logs. `force.on("tick", ...)` is being called many times in quick succession.

Our original data (`name: "Enjolras", born: ...`) is still there, but now there's more stuff, like an `x` value. And the `x` value changes slightly every time.

D3 is adding an `x` and a `y` to our data.

So... let's set the circles to that x and y?

```js
force.on("tick", function() {
	console.log(data[0]);
	node.attr("cx", function(d) { return d.x; })
	  .attr("cy", function(d) { return d.y; });
});
```

Oh wow, what was that? Let's add a bit of friction to our system to slow it down.

```js
...
  .charge(-120)
  .friction(0.5)
  .size([width, height]);
```

This is a physical simulation. The circles start at a random position and every tick, their position is updated to iteratively get them closer to where they want to be.

The circles are attracted to the center, but also repulsed from each other. These are forces acting oin the circle: a *force-directed layout*.

Let's make them less attracted to the center.

*execute interactively in the console*

```js
> force.gravity(0.01).start();
```

*explore other gravity parameter values*

Using a physical simulation to lay out elements is what is known as a force directed layout. 

### Graph data structure

Some characters are related to each other; perhaps we should incorporate that in our visual encoding.

**How would we represent character relationships using arrays and Javascript objects in JSON? How could we represent a relation between nodes?**

*interactive: explore proposed solutions (whiteboard) for up to 5 minutes*

Luckily Donald Knuth [compiled](http://www-cs-faculty.stanford.edu/~uno/sgb.html) data about character co-occurrence in Les Misérables. Let's look at `miserables.json`.

*explain the structure of `miserables.json`. show examples, e.g. Napoleon is connected to Myriel.*

### Graph
*open `graph.html`*

Let's update our visualization to add lines connecting the characters that are related.

First, let's point our visualization to the new data.

```js
d3.json("miserables.json", function(data) {
	...
```

Oh no — it broke. Our character data is now under `data.nodes`, let's update the references.

```js
force
  .nodes(data.nodes)
  .links([])
...
```
```js
var node = svg.selectAll(".node")
	.data(data.nodes);
```

Great — lots more nodes. You might have noticed `links()` is getting passed an empty array. We previously didn't have any links, but now we have some. Let's make sure D3 knows.

```js
force
  .nodes(data.nodes)
  .links(data.links)
...
```

Nodes aren't equally spaced anymore — the force directed layout is taking into account the links between nodes.

We can't see the links yet. Let's log the first link at every tick.

```js
force.on("tick", function(e) {
	console.log(data.links[0]);
	...
```

Previously, `source` and `target` were index, but D3 replaced the index with the full objects they represent. We now have an `x` and `y` for source and target.

This is similar to the circles: first we need to create the lines.

```js
...
  .attr("r", 10);
        
var link = svg.selectAll(".link")
  .data(data.links);

link
  .enter().append("line");

link
  .attr("class", "link");

link
  .exit()
  .remove();
```

Then set their position at every tick using the `x`s and `y`s added by the forced directed layout.

```js
force.on("tick", function(e) {
	link.attr("x1", function(d) { return d.source.x; })
	  .attr("y1", function(d) { return d.source.y; })
	  .attr("x2", function(d) { return d.target.x; })
	  .attr("y2", function(d) { return d.target.y; });
	 
	...
```

Nice! Oh, but our links are on top of the nodes. In SVG, the element drawn last appears on top — like drawing on paper.

Let's make sure to add the links first.

```js
var link = svg.selectAll(".link")
  .data(data.links);

link
  .enter().append("line");

link
  .attr("class", "link");

link
  .exit()
  .remove();
	
var node = svg.selectAll(".node")
...
```

Very cool. Notice that the layout changes every refresh: force directed layout are limited by poor reproducibility. 

Let's tweak the force parameters of our graph.

```
var force = d3.layout.force()
	.charge(-200)
	.size([width, height]);
```

We can add interactivity easily — instructing D3 to rerun the simulation when a node is moved.

```js
  .attr("r", 10)
  .call(force.drag);
```

*demo interactive manipulation of nodes*

Yay D3! The final result is available in `graph-final.html`.

### Force layout innards: cooling

The `e` variable passed to the tick event contains data about the state of the simulation. Let's look at alpha.

```js
force.on("tick", function(e) {
	console.log(e.alpha);
...
```

Alpha is the cooling parameter: as the simulation converges on a stable layout, alpha gradually decreases, causing nodes to move more slowly. 

You'll notice that when alpha reaches a threshold (0.005), the simulation stops.

Initially, high alpha causes the randomly-positioned nodes to shuffle aggressively.

*refresh and show the initial rapid shuffling of the nodes*

This is jarring, let's fix it.

Let's only update the graph when alpha is low enough that nodes won't fly across the screen.

We can ignore ticks where alpha is greater than, say, 0.08.

```js
force.on("tick", function(e) {
	if (e.alpha <= 0.08) {
		link.attr("x1", function(d) { return d.source.x; })
			...
            .attr("cy", function(d) { return d.y; });
	}
}
```

There are better ways to achieve this result, but this introduces the alpha cooling parameter. You'll need to use `alpha` in HW2 to nudge nodes in progressively smaller increments.

*if time permits: explore the [multi-foci layout](http://bl.ocks.org/DavidChouinard/fbd8889e8fbb5ffbabce) example*

---
*See you next week!*
