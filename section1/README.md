Section 1
===

Welcome to CS171. Let's get you set up for submitting homework assignments. We'll also quickly cover some basic knowledge that should already feel familiar to you.

----
**Setup**

* Open a blank browser window and a terminal window
* Open `basic.html` in a text editor (large font size)

----

Git
---

*30 minutes; interactive.*

In this course, we will be using a tool called git to track changes to our code. We'll also be using Github, an online tool for hosting git repositories.

You should already have git installed.

*briefly describe the value of version control*

First, let's configure git: open a shell. *describe how to do this on other OSes*

Run the following.

```
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR EMAIL ADDRESS"
```

`cd` to the directory you want put your homework in (e.g., your Documents folder). *ensure the concept of a working directory is clear*

What we going to do as overview:
![Setting up your Github repository](images/section1_github.png?raw=true)



Run the following:

```
git clone https://github.com/CS171/2015-cs171-homework.git -o homework
```

Then `cd` into the newly created `2015-cs171-homework/` directory.  You can change the directory name if you want.

*open a browser window*

Create a new repository on the Github website following the `cs171-hw-lastname-firstname` naming convention. **Use all lowercase for your repository name. It is important that your repository be named exactly as above so that we can access it for grading.**

Ensure your new repository is private and don't click the option to "Initialize the repository with a README".

Unless you know what you're doing, select HTTPS.

![Setting up your Github repository](images/https.png?raw=true)

Run the two commands described on GitHub under the heading "Push an existing repository from the command line", highlighted in red below.

![Setting up your Github repository](images/commands.png?raw=true)

On GitHub, go to the repository settings and navigate to the Collaborators page. Add [`cs171tf`](https://github.com/cs171tf) as a collaborator to your private repository.

Now your homework repository is all set!

### Committing

While working on homework assignments, periodically run the following:

```
git add -A
git commit -m "Describe your changes"
git push
```

The `git commit` operation takes snapshot of your code at that point in time — a snapshot is called a "commit" in Git parlance. You can revert to a previous commit at any time.

The `git push` operation pushes your local commits to the remote repository. It is important that you push your changes or others will not be able to see them.

You should do this frequently: as often as you have an incremental, standalone improvement.

### Submitting your homework

We will automatically copy your repository after each homework deadline. **You do not need to do anything else to submit your work (but make sure that you have pushed the latest version of your homework).** We will count the time of your last commit to the Github repository as your submission time.

Refer to the [CS 171 web page](http://www.cs171.org/2015/homework/) for more information on how to submit your homework.

### Getting new homework assignments

When we release a new assignment we will simply add it to the [homework github repository](https://github.com/CS171/2015-cs171-homework).

To get the latest homework assignments and potential updates or corrections to the assignment, run the following.

```
git pull homework master
```

Make sure to have all your changes committed before you do that.

*Hands-on help to ensure all students have their git environment configured*

More nuts & bolts: Python server
---

*10 minutes; interactive.*

In most cases, we need special software — a *server* — to view HTML files. 

You will need Python; you should already have it installed.

`cd` to `hw1/` and run the following.

```
python -m SimpleHTTPServer
```

Open [http://localhost:8000/](http://localhost:8000/) — we have a server. You can open `table_example.html` to see an HTML file.

*show the relation between the files and the contents of the directory*

You can only have one server at the same time (unless you specify a port). Control-C to quit. 

The DOM
---

*Return to your text editor (`basic.html`). 20 minutes; demonstration only.*

The DOM is the hierarchical structure used for representing elements in the browser — you should already be familiar with it. Here is a simple HTML example:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>CS171 Section 1</title>
    <script src="http://d3js.org/d3.v3.min.js"></script>
  </head>
  <body>
    <h1>Welcome to CS171</h1>
    <p>Data visualization</p>
    <svg></svg>
  </body>
</html>
```

*briefly describe the structure of the document*

Notice the tags `<...>` that are matched with `</...>` — those are DOM (HTML) elements.

### The Web Inspector

`<h1>` indicates a heading. Let's change the contents of the `<h1>` and refresh.

Let's add anotger paragraph below the first paragraph — a `<p>`.

*Open `basic.html` in Chrome with Developers Tools vertically docked*

In Developer Tools, we can do live modifications to the DOM. For example, let's move the paragraph around and change its content. Or, let's delete it.

### CSS: Making it pretty

*Return to the text editor*

HTML sets the structure and contents of the page and CSS sets its style — things like fonts, colors, margins, backgrounds, etc.

Let's add some CSS.

```
...
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/style.css" />
  </head>
...
```

That line tells the browser to look for styling information in `style.css`.

*open `style.css` in another pane*

The file describes a list of styles (e.g. `color: darkgrey`) applied to a particular group of HTML elements.

We won't be using CSS extensively in this course: CSS works by assigning styles (e.g. `color: darkgrey`) to particular groups of HTML elements.

Sometimes we want to target one particular element — a particular `p`, not all `p`s. Let's add an *id* of `subheading` to the first `p`.

```html
...
    <h1>Welcome to CS171</h1>
    <p id="subheading">Data visualization</p>
...
```

And now, in `style.css`, we use that id to only apply styling to a specific paragraph.

```css
p#subheading {
  color: darkgrey;
  font-style: italic;
}
```

*return to Developer Tools*

We can also edit CSS live in the Developer Tools. Let's change that paragraph's color to red.

### SVG: Drawing shapes

*return to the text editor*

SVG is a format for drawing vector graphics in the browser. We'll be using SVG a lot in this course and you're probably not familiar with it yet.

HTML and SVG are similar — HTML defines the content and structure of elements such as headings, paragraphs, and images; SVG defines graphical marks such as circles, rectangles, and paths.

Let's add a circle inside the `<svg>` element.

```svg
<circle cx="200" cy="200" r="50"/>
```

We can modify the attributes of the circle. Let's change the `cx` value. Let's make the `fill` attribute `steelblue`.

Let's add a rectangle.

```svg
<rect x="10" y="100" width="10" height="100" fill="steelblue"/>
```

*remove the circle and rectangle*

### Manipulating the DOM

*Expand the console drawer in the Developer Tools Elements pane*

In addition to hardcoding SVG elements, we can use Javascript to programmatically add to the DOM.

```js
var svg = d3.select("svg");

var circle = svg.append("circle");
```

Why don't we see anything? The circle is in the DOM, but it needs attributes for its position and size.

```js
circle
    .attr("cx", 200)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "steelblue");
```

How about more circles?

```js
var circle2 = svg.append("circle")
    .attr("cx", 300)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "steelblue");
```

And of course, we can still update our original circle.

```js
circle
	.transition()
    .attr("cx", 400);
```

### Groups

We can group elements using `<g>` elements. First, we create a `<g>` element.

```js
var g = svg.append("g");
```

Let's move the two circles into the `<g>`.

```js
g.node().appendChild(circle.node());
g.node().appendChild(circle2.node());
```

Nothing changes — the `<g>` element just helps us group and organize elements.

We can apply transformations that apply to the whole group — for example, let's translate the group.

```js
g
  .transition()
  .attr("transform", "translate(0, 100)");
```

---
*See you next week!*
