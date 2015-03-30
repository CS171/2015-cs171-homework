Section 7: Data, data, data
===

Up to now, we've been focusing on learning skills for building interactive visualizations. Today, we'll go downstream one level and think about datasets.

----
**Setup**

 * **Important**: [register for a Best Buy API key](https://remix.mashery.com/member/register)
 * **Important**: [Install the Kimono Labs Chrome extension](https://www.kimonolabs.com/) and create an account

----

Datasets: your final project
---

A strong dataset is *crucial* for a good project.

**Data wrangling takes longer than expected, even when take that into account.**

You should have your data in hand by the time you submit your project proposal. (or, a strong plan for acquiring it)

*emphasize importance of dataset*

If you don't currently have a project idea, the best way to get unstuck is to expose yourself to the many fascinating datasets available.

*briefly walk through these datasets. comment on their quality, format and appropriateness for a project, emphasizing general ideas useful for judging other datasets*

 * [Gapminder data](http://www.gapminder.org/data/) ★★★ *high quality, aggregated datasets*
 * US Census: [Americain FactFinder](http://factfinder.census.gov/faces/nav/jsf/pages/download_center.xhtml) ★★ *cumbersome to discover datasets*
 * [data.gov](http://www.data.gov/) ★★★
 * [Boston Open Data](https://data.cityofboston.gov/) ★★★
 * [Harvard Library Bibliographic Dataset](http://openmetadata.lib.harvard.edu/bibdata) ★ *fascinating data, unusable data format*
 * [Harvard Common Data Set](http://oir.harvard.edu/common-data-set) ★ *data stuck in PDFs*
 * [FEC election data](http://www.fec.gov/data/DataCatalog.do) ★★★
 * [Last statements of Texas death row prisoners](http://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html) ★ *fascinating, but data stuck in PDFs*
 * [Wikipedia API](http://www.mediawiki.org/wiki/API:Main_page) ★★★ *interesting metadata, data dumps also [available](https://dumps.wikimedia.org/)* 
 * [Top Reddit posts](https://github.com/umbrae/reddit-top-2.5-million) ★★ *limited data, good format*
 * [Who uses which drugs and how often?](http://www.icpsr.umich.edu/icpsrweb/ICPSR/studies/34933?q=&paging.rows=25&sortBy=10) ★★★ *exhaustive data, reasonable format*
 * [Race and gender in AP CS pass rates](http://home.cc.gatech.edu/ice-gt/556) ★★ *summary data only, good format*
 * [Yelp Academic Dataset](https://www.yelp.com/academic_dataset) ★★★ *JSON data format*
 * [UFO Sightings](http://www.nuforc.org/) ★ *requires location geocoding and scraping (or, using somebody else's [scraped data](https://raw.githubusercontent.com/johnmyleswhite/ML_for_Hackers/master/01-Introduction/data/ufo/ufo_awesome.tsv))*
 * [Chipotle order data](https://github.com/TheUpshot/chipotle/blob/master/orders.tsv) ★★ *simple data, some string processing required*
 * [Food composition data](http://foodb.ca/downloads) ★★★
 * [Dating: How Couples Meet and Stay Together](http://www.icpsr.umich.edu/icpsrweb/ICPSR/studies/30103) ★★★ *reasonably simple TSV*
 * [Zillow](http://www.zillow.com/research/data/) ★★★
 * Sports
	* [Chess: Million Base](http://www.top-5000.nl/pgn.htm) ★ *tricky data representation*
	* [Soccer: football.db](http://openfootball.github.io/) ★★ *data provided as SQLite database*
	* [Poker: Hand Data Set](http://archive.ics.uci.edu/ml/datasets/Poker+Hand) ★★ *old, but simple index format*
	* [Baseball: Lahman’s Database](http://www.seanlahman.com/baseball-archive/statistics/) ★★★ *exhaustive*
 * Personal data: your social network, walking patterns, calendar appointments, emails, etc.

These are all datasets, but APIs are also valuable data source: they give us tidbits of information that can be assembled into datasets.

Interacting with APIs
---

An API is a standard interface for programs to talk to each other. It's an abstraction layer.

For example, Best Buy has [an API](https://developer.bestbuy.com/) for its data. Humans consume and interact with Best Buy's data through a website, but programs can interact with Best Buy through a standard interface: the API.

Let's look into the Best Buy API. The [API's documentation](https://developer.bestbuy.com/documentation) is a good starting point. *open link in browser*

Let's build a dataset of Best Buy's catalog. We're interested in the [Products API](https://developer.bestbuy.com/documentation/products-api).

*briefly skim the product API documentation*

The [third example](https://developer.bestbuy.com/documentation/products-api#ProductDetailExample3) shows searching for a few product IDs. Let's start with that.

*copy `http://api.remix.bestbuy.com/v1/products(sku in(43900,2088495,7150065))?apiKey=YourAPIKey` and open in a new browser tab*

Uh oh. `Developer inactive`. Currently, we're anonymous to Best Buy and Best Buy wants to know who we are. Best Buy is asking us to tie our identity to the query — we need to pass an id ("key") to the `apiKey` query argument.

*return the documentation and click [Get API key](https://remix.mashery.com/member/register). the page will list API key for registered users*

Let's use our API key in the query.

*replace `YourAPIKey` with key in query*

Nice! But this appears to be HTML-like gibberish. This is the XML format — we want JSON. We can ask Best Buy to return its data in that format instead.

Let's look back at the documentation.

*open the [Overview](https://developer.bestbuy.com/documentation#overview) section of the documentation. scroll to [Response Format](https://developer.bestbuy.com/documentation#responseFormat-response-format)*

We can use the `format` parameter to request JSON.

*append `&format=json` to query*

There. Data!

*skim through data, calling out interesting properties*

### Project ideas

There are many interesting potential projects in this dataset, for example:

 * Top 1000 products, explored interactively through various product attributes, e.g. category
 * A graph visualization of `frequentlyPurchasedWith` related products (how do products cluster together?)
 * Reviews: which attributes are associated with high volume or high variability (controversial) reviews?
 * Which words are associated with high selling products?
 * Extract salient colors from packaging photos, visualized by product category

*discuss potential data hurdles with each of these projects*

### Expanding processing: using Node

As is, we can query the API directly from our Javascript (getting real-time prices).

```js
var url = "http://api.remix.bestbuy.com/v1/products(sku%20in(43900,2088495,7150065))?format=json&apiKey=" + API_KEY;

d3.json(url, function(data) {
  // do something with data
});
```

*do not execute. note: this snippet won't directly work because Best Buy doesn't support CORS. address this point if time permits*

Our current query is filtering for particular product IDs (SKUs).

Let's remove the filter and fetch all products in Best Buy's database.

*remove `(sku%20in(43900,2088495,7150065))` from API call in browser*

Why aren't all products listed? The first few properties indicate that we're only getting the first 10 results.

*go to [pagination section of Overview documentation](https://developer.bestbuy.com/documentation#pagination-pagination)*

To request the second set of 10 results, we need the `page` parameter.

*add `&page=2` to API call*

There are 70,000+ pages. Ouch. Let's use the `pageSize` parameter to reduce that (maximum page size is 100).

*add `&pageSize=100` to API call*

We still have many pages. To assemble our dataset, we need to fetch all the pages sequentially.

We could use `d3.json` to recursively fetch our files and concatenate them.

Something like this. *walk through logic*

```js
var API_KEY = "YOUR API KEY";
var all_products = [];

function get_products_for_page(page) {
    var url = "http://api.remix.bestbuy.com/v1/products?format=json&pageSize=100&page=" + page + "&apiKey=" + API_KEY;

	d3.json(url, function(data) {
		if (data.products.length == 0) {
			// done! we've reached the end, all products are available all_products
		} else {
			all_products = all_products.concat(data.products);
			get_products_for_page(page + 1);
		}
	});
}

// Start at page 1
get_products_for_page(1);
```

However, fetching the 7,000+ files would take hours on each page load. Let's prefetch all the files and store them in a `data.json` file already assembled.

We'll use Node for that (you'll need to [install it](https://nodejs.org/download/) to use it). Node is a way to run Javascript outside a browser.

*open fetch/fetch.js and briefly walk through the script. add your API key*

Notice we're using `request()` instead of `d3.json()`.

*run `node fetch.js`; quit after a few pages*

We've already run the script for you and the [resulting data is available](http://static.davidchouinard.com/cs171/section7.json)(3.1GB).

At this point, we'd be ready to start making a beautiful visualization.

But what if a potential data source doesn't have an API?

Unlocking data in websites: web scraping with Kimono 
---

Quantcast is a company that measures traffic to websites. Their listing of [Top US Mobile sites](https://www.quantcast.com/top-mobile-sites/US) is interesting. *open page in browser*

(note that the data only includes sites that participate in Quantcast's program — generally sites that are primarily advertising-driven)

*open [Top US Mobile site ranking](https://www.quantcast.com/top-mobile-sites/US) in a browser*

We'll be using [Kimono Labs](https://www.kimonolabs.com/) to extract structured data from this page.

![Start Kimono](images/kimono-start.png?raw=true)

*start Kimono. click Close if prompted with an onboarding screen*

Let's capture monthly visit counts.

![Select counts](images/kimono-counts.png?raw=true)

*select the first monthly value*

Kimono has made a guess about other similar values on the page. Let's confirm a few of its guesses. 

*accept the second count value by clicking the checkmark*

Kimono has now captured the first 50 values. Let's make sure it doesn't miss the second column.

*select the first monthly visit count from the second column*

Uh oh. It got what we wanted, but also added more values that we don't want. Let's give Kimono feedback on its guesses.

*reject a few values from other columns*

Great! Kimono is now capturing the values.

![All counts selected](images/kimono-counts-all.png?raw=true)

We can see Kimono identified 100 values *draw attention to the toolbar*. Let's name these values. *name property "count"*

![Naming the property](images/kimono-counts-toolbar.png?raw=true)

Let's capture rank number now.

*click the `+` button in the toolbar and repeat the steps above for the fist row value (rank)*

Let's capture the website name.

*select the first website name (excluding the icon)*

Only 39 selected: it's missing the "hidden profile" values.

*select a Hidden Profile name, making sure to deselect icons if appropriate*

Great! *name the property*

Looking good. We're only getting the first page of results thought — let's add paging ability.

![Pagination](images/kimono-pagination.png?raw=true)

*return to the Extractor view and select Pagination*

![Next page](images/kimono-nextpage.png?raw=true)

*highlight the Next page link*

Let's preview the data we collected.

![Preview data](images/kimono-viewdata.png?raw=true)

*select Raw Data View icon from toolbar; skim the data, confirming correctness*

How does Kimono work?

![Data model view](images/kimono-datamodel.png?raw=true)

*select the Data Model view and select Advanced. point out CSS selectors*

This is a *CSS selector*: it specifies from which elements to pull data from. We've used simple CSS selectors before, but these are more complex.

*briefly describe the rank CSS selector*

Let's get our data!

![Done](images/kimono-done.png?raw=true)

*click Done and submit the form*

There's our data! Kimono is currently fetching ("crawling") for all the data, so it only has partial coverage. Clicking the JSON endpoint, we see our (partial) data.

*show partially-complete JSON endpoint; show the staff-created API with full dataset [https://www.kimonolabs.com/api/ehmahbbs?apikey=e285279125167103ffd71948e8aba6ae](https://www.kimonolabs.com/api/ehmahbbs?apikey=e285279125167103ffd71948e8aba6ae)*

Using Kimono, we've created an API out of a website.

Note that this scraping approach is very fragile: changes in the website structure will likely break our API.

### A warning about scraping

Kimono is limited: if you need to scrape more complex pages, you'll need to do it programmatically (including manually defining your own CSS selectors).

In Node, you can use [Cheerio](https://www.npmjs.com/package/cheerio) ([tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-node-js-request-and-cheerio-to-set-up-simple-web-scraping)). (there are [also](https://github.com/ruipgil/scraperjs) [other](https://github.com/ruipgil/scraperjs) Node scraping tools available)

All major programming languages have libraries for scraping. Searching for *[language] web scraping* should help you find them.

A warning: tweaking a scraping system is very tedious. Consult with a TF to get a sense of complexity for your application.

---
This was the last section. *See you in class!*
