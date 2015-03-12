// This is a Node.js script, run it with "node wrangling.js"
// It extracts and cleans the source Somerville 311 data ("raw.json") and saves it to data.json
fs = require('fs');
_ = require("underscore");   // install with "npm install underscore"

// retrieved from https://data.somervillema.gov/311-Call-Center/311-Call-Center/kja3-3jiv
fs.readFile('raw.json', 'utf8', function (err,contents) {
  var data = JSON.parse(contents);

  var cleaned = data.data.map(function(d) {
    var date = d[8].slice(0,-9);
    return {"date": date, "agency": d[9].trim(), "type": d[10].trim(), "priority": d[12], "location": d[13].trim()};
  }).filter(function(d) {
    // Filter for 2011 only
    var date = new Date(d.date);
    return date >= new Date(2011,1,1) && date <= new Date(2011,12,31);
  });

  // aggregate by date
  var grouped = _.chain(cleaned).sortBy("date").groupBy("date").map(function(value, key) { return {"date": key, "calls": value}; }).value();

  fs.writeFile("../data.json", JSON.stringify(grouped, null, '\t'));
});
