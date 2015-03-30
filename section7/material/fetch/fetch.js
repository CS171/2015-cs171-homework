
// Execute this code by running:
//   node fetch.js
// You'll need to have Node.js installed
fs = require('fs');
request = require('request');

var API_KEY = "" //TODO: add your API key!

var file = fs.createWriteStream('../data.json');

file.write("[\n");  // start JSON array in file

// this is a function that's called recursively, starting at page 1
function get_products_for_page(page) {
  var url = "http://api.remix.bestbuy.com/v1/products?format=json&pageSize=100&page=" + page + "&apiKey=" + API_KEY;

  // this is analogous to doing d3.json(...) like we did in the browser with D3
  request(url, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.error("Error: " + body);  // there was an error, give up
      return;
    }

    try {
      var data = JSON.parse(body);

      console.log("Page " + data.currentPage + "/" + data.totalPages); // print our progress

      if (data.products.length == 0) {
        // we've reached the end
        file.write("]");
        file.end();
      } else {
        // We could just maintain a global array that we add every page of products to. Something like this:
        //    all_products = all_products.concat(data.products);
        // However, this requires all data to be kept in memory until the very end. Instead, we incrementally write
        // each page to the output file and do some string manipulations to merge the individual JSON arrays.

        var stringified = JSON.stringify(data.products, null, '\t')

        // Removes the start and end bracket from stringified JSON
        //  Note that this approach will generate a trailing comma for the last element (technically invalid JSON),
        //  but still accepted by modern browsers
        stringified = stringified.slice(2, -2) + ',\n';

        file.write(stringified);

        // get next page
        get_products_for_page(page + 1);
      }
    } catch (e) {
      console.error(e);  // there was an error, move on to the next page
      get_products_for_page(page + 1);
    }
  })
}

// Start at page 1
get_products_for_page(1);
