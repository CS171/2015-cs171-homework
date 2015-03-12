Section 6: Brushing and Linking
===

Up to now we've been building standalone graphs in D3, this week we'll learn to connect graphs together to form interactive linked views.

----
**Setup**

 * open `start/index.html` in both a text editor and a browser
 
----

Interactivity through brushing
---

*open `start/index.html`*

This is a line chart of call volume to Somerville's 311 service. ([source data](https://data.somervillema.gov/311-Call-Center/311-Call-Center/kja3-3jiv), cleaned up with `wrangling.js`). Let's improve this visualization.

### The `path` element
*no demonstration; follow along with explanation*

How is the squiggly line drawn? We know how to draw straight lines—

```svg
<line x1="10" y1="80" x2="180" y2="40" stroke="steelblue" fill="none"/>
```

<img src="images/line.png?raw=true" width="200px" alt="A line" />

but what about more complex lines? We can also use the `path` element to draw lines.

```svg
<path d="M10 80 L 180 40" stroke="steelblue" fill="none"/>
```

<img src="images/line.png?raw=true" width="200px" alt="A line" />

But we can draw many more things with `path`, say a [Bézier curve](http://en.wikipedia.org/wiki/B%C3%A9zier_curve).

```svg
<path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="steelblue" fill="none"/>
```

<img src="images/bezier.png?raw=true" width="200px" alt="Bézier curve" />

The `d` attribute (`M10 80 C 40...`) defines the path.

*inspect the line chart's path element*

The graph's line is a single `path` element with a very long `d` attribute. We don't need to understand the contents of `d` — we'll be using D3 functions for generating `d`s.

### Code structure

Our dataset contains information on the type (potholes, missed trash pickup, etc.) of each call. Let's add a bar chart of those types.

```js
...
volume_vis = new VolumeVis(d3.select("#volumeVis"), allData);
type_vis = new TypeVis(d3.select("#typeVis"), allData);
```
Where is all the D3 code that creates the bar chart? It's all hidden inside the `TypeVis` object. *open `js/typevis.js`*


Everything is encapsulated inside the `TypeVis` object. Everything about TyepVis is in `js/typevis.js`.

*return to `index.html`*

We could, say, create two `TypeVis`es.

```js
...
type_vis2 = new TypeVis(d3.select("#typeVis2"), allData);
```

*return to `js/typevis.js`*

There's some setup code at the top and the following main functions:

* initVis()
* wrangleData(_filterFunction)
* updateVis()

Let's walk through these.

*open `debug/index.html` in Chrome*

The first view (`VolumeVis`) is drawn but not the second: we've paused our code right before drawing the second view. This is done with a special `debugger;` statement — a *breakpoint*.

*resume execution to next breakpoint (<kbd>Cmd</kbd> + <kbd>&#92;</kbd>)*

We're now inside `TypeVis()`: starting to build the view. This code is a constructor: it sets up basic things for the object. It sets up constants.

*direct attention to Scope Variables pane*

Everything under `this` will always be accessible from everywhere inside the object. We set things like margin, height, data, etc.

You'll notice it calls `initVis()`. Let's go there. *resume execution*

`initVis()` sets up axes, scales, etc. We now have more stuff under `this`. *show Scope Variables*

*inspect Elements* It also added an SVG element inside the div `typeVis`, but didn't draw the graph yet.

*resume execution*

`this.wrangleData()` runs, which populates a variable `this.displayData`. *show in Scope Variables* That's the data we want to draw.

It then calls `this.updateVis()`. Let's look at that.

*resume execution*

We're in `updateVis()`, where we draw the graph.

We're in the middle of creating the view. We've drawn the axis and are about to do the data join to create the `rect`s.

*resume execution*

There we have it! Our masterpiece.

To summarize, we:

* initialized the visualization; (`initVis()`)
* got the data; and (`wrangleData(_filterFunction)`)
* created the visualization with the data (`updateVis()`)

### Context: `this` and `that`

*open `interactive/js/typevis.js`*

Let's add color to our bars.

First, we need to define a color scale.

Let's initialize the scale in `initVis()`.

```js
...
   .rangeRoundBands([0, this.height], .1);
   
this.color = d3.scale.category20();
```

And set the domain of the scale in `updateVis()`.

```js
...
this.y.domain(this.displayData.map(function(d) { return d.type; }));
this.color.domain(this.displayData.map(function(d) { return d.type }));
```

And then we can use `this.color` inside to set the fill of our bars. *warning: won't work; will cause exception*

```js
...
  .attr("y", 0)
  .style("fill", function(d,i) {
  	return this.color(d.type);
  });
```

`undefined is not a function` Oh no.

Every function has a special variable called `this` that indicates its context.

However, `this` is overwritten by each inner function execution. We're calling `color` on the wrong `this`.

If we want to access a `this` outside the scope of the function, we need to store it to another variable. Notice `var that = this` at the top of the function.

We can now use `that` inside our function.

```js
  .style("fill", function(d,i) {
  	return that.color(d.type);
  });
```

Nice!

At the top of the function we have many statements that use `this` — we can replace them with `that`, it doesn't matter.

```js
that.x.domain(d3.extent(that.displayData, function(d) { return d.count; }));
that.y.domain(that.displayData.map(function(d) { return d.type; }));
```

`that` and `this` are the same at the top most level: it's only inside nested functions that they refer to different things.

Interactivity with events
---

We want to explore the interactions between the two views: to understand how call types and call volume interact.

Let's filter the area chart when selecting a bar (call type) in the bar chart. Let's *link* the two views.

First, we need to detect a bar was clicked.

```js
...
bar_enter.append("text");

bar_enter.on("click", function(d) {
    ...
})
```

Remember our three steps: `initVis()`, `wrangleData()`, `updateVis()`. On click of one view, we need to  filter the other view's data and update its visualization.

`VolumeViz` has a function that does those two steps: `onSelectionChange`.

*show `onSelectionChange(type)` in `js/volumevis.js`*

Let's try in the console.

*run the following in the console*

```js
volume_vis.onSelectionChange("Pothole");
```

VolumeVis knows how to filter and redraw itself.

We could do this. *do not execute*

```js
bar_enter.on("click", function(d) {
	volume_vis.onSelectionChange(d.type);
})
```

But `TypeVis` shouldn't know about `VolumeViz` and vice versa — all the communication between views should go through a central intermediary.

We need to get `index.html` to call `onSelectionChange()`.

We'll use *events*. Events allow us to broadcast that something happen and parties that are interested can listen for that event and act upon it.

For example, I could trigger a `sectionStart` event to indicate to you to change your behaviour. Or, triggering a `questionAsked` event is the programming analogy to raising your hand.

Let's trigger a `selectionChange` event when 

```js
bar.on("click", function(d) {
	$(that.eventHandler).trigger("selectionChanged", d.type);
})
```

The `$` symbol is jQuery syntax.

When can also pass an argument to the event. We pass the call type.

Nothing happens when we click a bar. Nobody is paying attention to our event.

Let's listen to the `selectionChanged` event in `index.html`.

```js
...
var type_vis = new TypeVis(d3.select("#typeVis"), allData, MyEventHandler);

$(MyEventHandler).bind("selectionChanged", function(event, type){
      debugger;
});
```

*show the event getting triggered*

Great, let's update call volume view when the event is triggered.

```js
$(MyEventHandler).bind("selectionChanged", function(event, type){
	volume_vis.onSelectionChange(type);
});
```

Nice!

Brushing
---
*open brushing/index.html*

Our bar chart encodes categorical type data: we use it to filter categorical data from other views.

Our area chart encodes time-indexed data: we should use it to filter for time from other views.

Let's look at adding *brushing* to our area chart.

*show [brushing example](http://bl.ocks.org/mbostock/1667367)*

Consider our steps: `initVis()`, `wrangleData()`, `updateVis()`.

Let's look at what we need in `initVis()`. Let's define our brush.

```js
...
  .y1(function(d) { return that.y(d.calls.length); });

this.brush = d3.svg.brush();

this.svg.append("g")
  .attr("class", "brush");
```

Since brush is not affecting the data, we don't need to change `wrangleData()`.

On update (`updateVis()`), we need to tell the brush about the x scale and change its attributes.

```js
...
   .remove();
   
this.brush.x(this.x);
this.svg.select(".brush")
    .call(this.brush)
  .selectAll("rect")
    .attr("height", this.height);
```

Great! We're drawing the brush selection, but our bar chart view isn't being updated.

```js
this.brush = d3.svg.brush()
  .on("brush", function(){
    console.log(that.brush.extent());
  });
```

*demo brushing, panning the brush and deselecting the brush*

`brush.extent()` is telling us about the minimum and maximum time selected. We just need to connect the pieces together.

We won't do that today but — we'd just need to trigger the `selectionChanged` event and call the two views' `onSelectionChanged` to update them with the correct state.

*final work available in `final/`*


---
*See you next week!*
