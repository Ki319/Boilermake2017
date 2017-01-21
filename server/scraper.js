var newsNetwork = require("./newsNetwork.js");
var request = require("request");
var querystring = require("querystring");
var cheerio = require("cheerio");

module.networkSource = { // + delimited
    "vox": "http://www.vox.com/results?q=",
    "huffingtonpost": "http://www.huffingtonpost.com/search?sortBy=recency&sortOrder=desc&keywords=",
    "wnd": "http://www.wnd.com/?s=",
    "breitbart": "http://www.breitbart.com/search/?s="
};

module.scrapeNetwork = {
    "vox": function($) {
        var top = $('.gsc-webResult .gsc-result').first().children().first();

        var link = $('a.gs-title').first().attr("href");
        var title = $('a.gs-title').first().text();
        var img = $('img.gs-image').first().attr("src");

        console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
        //top.children('.gsc-thumbnail-inside').first().

    },
    "huffingtonpost": function($) {
        // ...
    }
};

module.exports.scrape = function(network, article, callback) {
    if (typeof network == "string") {
        network = newsNetwork.getNewsNetwork(network);
    }

    if (!network.searchable) {
        console.error("Network '" + network.name + "' is not searchable.");
        return null;
    }

    var link = module.networkSource[network.name] + article.replace(" ", "+");
    console.log("Scraping " + link);

    request(link, function(err, res, html) {
        if (error) {
            console.error("Failed to scrape:", err.stack);
            return;
        }

        var $ = cheerio.load(html);
        callback(module.scrapeNetwork[network.name]($));
    });
}
