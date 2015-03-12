# Section 5: HW2 and beyond

We've spent the last few weeks understanding D3 features. Today, we look back at HW1 and HW2 and zoom out with general recommendations.

## Tips for the road

- **Learn by example**: D3 has extensive examples through [bl.ocks.org](http://bl.ocks.org/) and a large community on Stack Overflow. Taking apart a similar example is one of the most productive learning strategies.
- **Programming is bookkeeping**: Naming is important: `allData` and `filteredData` tells us a lot about the variables.
- **Code is poetry**: Indentation and format convey meaning. They should help you understand how parts interact.
- **Understand intermediate representations**: Whenever you are unclear how your code behaves, use `console.log()` or the debugger to intermediate steps. Getting stuck looking at code is frustrating, focus on building intuition with interaction. *demonstrate `debubger;` statement and breakpoints*
- **Planing might be key:** Especially if you are less experienced in programming, a systematic approach might help you: Read everything first, understand the problem, and start only the next day with programming. Make a list of subproblems you need to understand before actually starting. Think also about re-usable parts of your code. E.g., in HW1, how could you re-use table drawing code for a second data set?

##HW1 recap

*Describe the homework shortly*

Let's look at HW1 and see how layout, naming and comments support understanding. See [material/table.html](material/table.html). 

## HW2 and beyond

*Use `bare.html` as a code playground, as appropriate*

### The Data Join

A template:

```js
var dots = svg.selectAll(".dot")
  .data([1,2,3]);
      
// --- adding Element of class dots
var dotsEnter = dots
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 5) // radius will never change
  .attr("cy", 10); // y position will not change
  
// --- add a nested element ONLY for new dots, e.g.:
// dotsEnter.append('title')...

// --- changes for ALL visible dots
dots
  .attr("cx", function(d) {return d * 20; });
  
// --- change the nested elements for ALL dots
// dots.select('title').text(function(d) { return d; })

// remove unused dots:
dots.exit()
	.remove();
```

This code can both create the visualization *and* update it.

 > 'undefined is not a function' during the exit phase? You're (likely) calling `exit()` on the enter phase. If you have `var dots = ....enter().append("circle")`, `dots` is the updated circles, not the whole data join.
 
 * You should only have `append` within the enter phase.
 * Nested data join: we add the nested element on enter, set the nested attributes on update.
 * CSS Selectors:
   * `d3.selectAll(".dot")` selects elements having class `dot`
   * `d3.select("#uniqueid")` selects the single element having the id `uniqueid`
   * `d3.selectAll("circle")` select all circle elements
   * combinations: `d3.selectAll("circle.dot")` select all circles having class `dot`

### Groups

`g` elements are used to structure your nodes. They don't draw anything on screen, but contain things that are drawn.

We can transform a whole group at once: the `transform` attribute is a powerful way to translate, rotate, and scale elements in SVG.

Transformations are hierarchically added,

```svg
  <g transform="translate(0,10)">
    <g transform="translate(10,20)">
      <circle cx="100" cy="100" r="10"/>
      <text>United States</text>
    </g>
  </g>
```

The final center position of the circle is `cx = 0+10+100 = 110` and `cy = 10+20+100 = 130`.

The `title` element can also be added to every element and will be shown as a tooltip when hovering the shape.

### Elements around a circle: the pie layout

*open `pie.html`*

To center elements around a circle, we can use the pie layout with even data, say [1,1,1].

*interactive demonstration*

First we need data and a pie layout.

```js
var data = [1,1,1];
var pie = d3.layout.pie();
```

Applying `pie` to `data` adds angles to each data elements. *show in console*

```js
var data = pie(data);
```

We need a D3 arc to convert the angles into a position.

```js
var arc = d3.svg.arc()
	.innerRadius(0)
    .outerRadius(10);
```

Using the arc's centroid function gives us a position for a particular data element.

```js
arc.centroid(data[0]);
```

### Graph representation

The file [**dataNodelink.html**](material/dataNodelink.html) contains an example how to construct a node-link structure from a given array of elements and how to hand this over to a d3 layout function.

*explain Option_A and Option_B*




## Structure: the processing pipeline

A good way to think about your code is to split it into these phases:

- initialization 
- data wrangling
- visual update

Let's understand those phases.



<p align="center" style="font-size:10pt;">
<img src="imgs/CS171_Erklaerbaer_01_General.png" /><br/>
</p>

### Application of Pipeline to Homework 1
A way to approach HW1 is to think of it like the figure below. When we change the filters or select an aggregation we modify the view on the data. We derive `showData` from `allData` by filtering and aggregation. If our d3-vis code in `updateVis()` is written in a way that it always reflects what is in `showData` we just have to call `updateVis()`. Some hints how to write a good, robust, update-handling code is given in this Section (see e.g. Practical D3 rules) 



<p align="center" style="font-size:10pt;">
<img src="imgs/CS171_Erklaerbaer_02_HW1.png" /><br/>
</p>

### Application of Pipeline to Homework 2
In HW2 it is all about the layouts and changes to it.

*Explain the fundamental difference between direct mapping and simulation*

- **direct mapping:** assign data directly to visual variable
- **simulation:** configure a simulator (e.g. force), react to updates during simulation (e.g. "tick" events)

<p align="center" style="font-size:10pt;">
<img src="imgs/CS171_Erklaerbaer_03_HW2.png" /><br/>
</p>

---
*See you next week!*
