# CS 171 Homework 0

**Due: Friday, February 6th, 11:59 pm. Value: 2%**

Welcome to CS171.  In this class, we will be using a variety of tools that will require some initial configuration. To ensure everything goes smoothly moving forward, we will setup the majority of those tools in this homework.  This homework will not be graded **except** for Problem 2. In Problem 2 you set up git and github for this course, which is essential before starting with HW 1.

## Problem 1 - Class Survey, Signups, and Introduction

### Sign up for github

You'll be using git and [GitHub](http://github.com) to manage homework assignments and projects.

Sign up for a github account (if you don't already have one) and request a free account upgrade [on this page](https://github.com/edu). You'll need to verify ownership of an **.edu e-mail address** (Harvard, MIT or any other) if you didn't sign up with your .edu account. You can use this suggested text to request the account upgrade:

>I will be using my educational micro account for CS 171 - visualization at Harvard (http://cs171.org). We will use github and github pages for the code in our homework assignments and for our final projects. Thank you!

This educational micro-plan will enable you to create five private repositories. We will need two for the class. If you are already using private repositories at github under your micro plan for other projects, and you cannot free-up your quota, please contact the staff well in advance of the deadline.

**It is important that you complete this step quickly, as it may take a while for github to provide you with the repositories. Make sure to request a .edu e-mail address if you don't already have one (e.g., because you are registered via DCE).**

### Class Survey
Please complete the [course survey located here](https://docs.google.com/forms/d/1HEZUrfyjhnXqO8qpKkwyZkdQZN4WTNSUKIDU4g2bz1k/viewform?usp=send_form). It should only take a few moments of your time. It will ask you for your **github user name**, so you must go trough the sign-up process first. It is imperative that you fill out the survey on time.

### Piazza
Go to [Piazza](https://piazza.com/harvard/cs171) and sign up for the class using your Harvard e-mail address. If you don't (yet) have a Harvard e-mail address, send an e-mail to [staff@cs171.org](mailto:staff@cs171.org) with the subject "Piazza Access: your@e.mail".  

We will use Piazza as a forum for discussion, to find team members, to arrange appointments, and to ask questions. Piazza should be your primary form of communication with the staff. Use the staff e-mail only for individual requests, e.g., to excuse yourself from a mandatory guest lecture. All information such as new homework assignments will be linked from the website but announced on Piazza.

### Introduction

Once you are signed up to the Piazza course forum, introduce yourself to your classmates and course staff, as a follow-up [to the introduction thread](https://piazza.com/class/hzygu2uzmp4h7?cid=6). Include your name/nickname, your affiliation, why you are taking this course, and tell us something interesting about yourself (e.g., an unusual hobby, past travels, or a cool project you did, etc.). Also tell us whether you have experience with visualization.

## Problem 2 - Introduction to Git

Attend the first section and [follow the instructions](../section1#git) on setting up your **private** git repository for the homework.

Edit the `README.md` file at the root of your respository to add your name and email address. Commit your changes.

In the `hw0` directory, add a text file named `hw0.txt`. The text file can be empty. Commit and push your changes.

This part of your homework will be graded, so make sure that your github repository conforms to our naming guidelines, and that you successfully pushed everything.

**Log in to the GitHub website to ensure everything shows up correctly!**

## Problem 3 - Introduction to HTML, CSS and D3

**Note: you should be able to complete this problem after you have finished the readings for week 2. There is no need to hand anything in — this is an exercise and you can check whether you understood the concepts.**

Take this [quiz](http://www.w3schools.com/quiztest/quiztest.asp?qtest=HTML) to test your HTML knowledge, and this [one](http://www.w3schools.com/quiztest/quiztest.asp?qtest=CSS) to evaluate your understanding of CSS. If you feel confident, you can try the [JavaScript quiz](http://www.w3schools.com/quiztest/quiztest.asp?qtest=JavaScript).

Read the mandatory readings, and follow along with the examples in the D3 book (chapters 1-4, for week 1, chapters 5-8, for week 2). We recommend that you put the code you are producing into your hw0 subdirectory of your github repository.

Once you're done with the readings, answer the following questions with regard to this code snippet. Assume the variables used are sensibly defined. You can also look at the [live example here](http://bl.ocks.org/alexsb/8565055).

```javascript
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr({
    class : "bar",
    width : function(d) {return d;},
    height: "40",
    y : function(d, i) {return i*50 + 10;},
    x : "10"
   });
```

 * What does this snippet do?
 * What is `.bar`? What is selected?
 * Given that data is an array with `[150, 230, 180, 90]`, what values do `d` and `i` take while this program executes. Why?
 * What does `append("rect")` do?

Now consider the following code:

```javascript
var bars = svg.selectAll(".bar");

var bars_enter = bars.data(data).enter();

var rects = bars_enter.append("rect")
  .attr({
    class : "bar",
    width : function(d) {return d;},
    height: "40",
    y : function(d, i) {return i*50 + 10;},
    x : "10"
   });
```

 * What does this snippet do? How is it different than the previous one?
 * What do the variables `bars`, `bars_enter` and `rects` contain?
