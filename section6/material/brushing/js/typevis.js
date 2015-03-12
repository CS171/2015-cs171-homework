/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
TypeVis = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // defines constants
    this.margin = {top: 20, right: 20, bottom: 30, left: 0},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
TypeVis.prototype.initVis = function(){

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.x = d3.scale.linear()
      .range([0, this.width]);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([0, this.height], .1);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .ticks(6)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")");

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
TypeVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data whiche is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
TypeVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};

    var that = this;

    // updates scales
    this.x.domain(d3.extent(this.displayData, function(d) { return d.count; }));
    this.y.domain(this.displayData.map(function(d) { return d.type; }));
    this.color.domain(this.displayData.map(function(d) { return d.type }));

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    // updates graph

    // Data join
    var bar = this.svg.selectAll(".bar")
      .data(this.displayData, function(d) { return d.type; });

    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");
    bar_enter.append("text");

    // Add click interactivity
    bar_enter.on("click", function(d) {
       $(that.eventHandler).trigger("selectionChanged", d.type);
    })

    // Add attributes (position) to all bars
    bar
      .attr("class", "bar")
      .transition()
      .attr("transform", function(d, i) { return "translate(0," + that.y(d.type) + ")"; })

    // Remove the extra bars
    bar.exit()
      .remove();

    // Update all inner rects and texts (both update and enter sets)

    bar.selectAll("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", this.y.rangeBand())
      .style("fill", function(d,i) {
        return that.color(d.type);
      })
      .transition()
      .attr("width", function(d, i) {
          return that.x(d.count);
      });

    bar.selectAll("text")
      .transition()
      .attr("x", function(d) { return that.x(d.count) + (that.doesLabelFit(d) ? -3 : 5); })
      .attr("y", function(d,i) { return that.y.rangeBand() / 2; })
      .text(function(d) { return d.type; })
      .attr("class", "type-label")
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return that.doesLabelFit(d) ? "end" : "start"; })
      .attr("fill", function(d) { return that.doesLabelFit(d) ? "white" : "black"; });
}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
TypeVis.prototype.onSelectionChange = function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    this.updateVis();
}


/**
 * Helper function that figures if there is sufficient space
 * to fit a label inside its bar in a bar chart
 */
TypeVis.prototype.doesLabelFit = function(datum, label) {
  var pixel_per_character = 6;  // obviously a (rough) approximation

  return datum.type.length * pixel_per_character < this.x(datum.count);
}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
TypeVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;


    var counts = Object();

    // Convert data into summary count format
    this.data
      .filter(filter)
      .forEach(function(d) {
        d.calls.forEach(function(c) {
          c.type in counts ? counts[c.type]++ : counts[c.type] = 1;
        });
      });

    // Convert counts to an array and keep only the top 10
    counts = Object.keys(counts)
      .map(function (key) {return {"type": key, "count": counts[key]}; })
      .sort(function(a, b) { return a.count < b.count || (a.count === b.count) - 1; })
      .slice(0, 20);

    return counts;
}




