var newsNetwork = require("./newsNetwork.js");
var request = require("request");
var querystring = require("querystring");
var cheerio = require("cheerio");
var url = require("url");

module.networkSource = { // + delimited
    //"vox": "http://www.vox.com/results?q=",
    "huffingtonpost": "http://www.huffingtonpost.com/search?sortBy=recency&sortOrder=desc&keywords=",
    "wnd": "http://www.wnd.com/?s=",
    "breitbart": "http://www.breitbart.com/search/?s=",
    "theblaze": "http://www.theblaze.com/?s=",
    "washingtonpost": "https://www.washingtonpost.com/newssearch/?query="
};

module.toAbsoluteUrl = function(href) {
    var link = document.createElement("a");
    link.href = href;
    return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
}

module.scrapeNetwork = {
    /*"vox": function($) {
        // Invalid, uses AJAX.
        console.log($('a.gs-title').first());
        var link = $('a.gs-title').first().attr("href");
        var title = $('a.gs-title').first().text();
        var img = $('img.gs-image').first().attr("src");

        console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
        //top.children('.gsc-thumbnail-inside').first().

    },*/
    "huffingtonpost": function($, baseLink) {
        var link = $('.card__link').first().attr('href');
        var title = $('.card__link').first().text();
        var img = $('div.card__image__src').first().attr('style');
        if (!title || !link) {
            return null;
        }

        if (!img) {
            img = null;
        } else {
            img = img.replace("background-image: url(", "");
            img = img.replace(");", "");
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "wnd": function($, baseLink) {
        var item = $("li.has-thumbnail").first();
        var title = item.children("h2").first().children().first().text();
        var link = url.resolve(baseLink, item.children("h2").first().children().first().attr("href"));
        var img = url.resolve(baseLink, item.children("figure").first().children().first().attr("src"));

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "theblaze": function($, baseLink) {
        var item = $("a.feed-link").first();
        var link = url.resolve(baseLink, item.attr("href"));
        var title = item.children(".feed-bottom").first().children().first().text().trim();
        var img = url.resolve(baseLink, item.children("div.feed-img").first().children().first().attr("src"));

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "realclearpolitics": function($, baseLink) {

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

    var link = module.networkSource[network.name] + article.split(" ").join("+");
    console.log("Scraping " + link);

    request(link, function(err, res, html) {
        if (err != undefined) {
            console.error("Failed to scrape:", err.stack);
            return;
        }

        var $ = cheerio.load(html);
        console.log("Scraping network '" + network.name + "'");
        callback(module.scrapeNetwork[network.name]($, link));
    });
}
