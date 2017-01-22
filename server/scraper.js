var newsNetwork = require("./newsNetwork.js");
var request = require("request");
var querystring = require("querystring");
var cheerio = require("cheerio");
var url = require("url");
var watson = require("watson-developer-cloud");


var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemy_language = new AlchemyLanguageV1({
  "url": "https://gateway-a.watsonplatform.net/calls",
  // "note": "It may take up to 5 minutes for this key to become active",
  "apikey": "3f9b78a8f4fa659b8d31a0c2c491ea216a8a92c0"
});

var params = {
  text: 'IBM Watson won the Jeopardy television show hosted by Alex Trebek'
};

/*
alchemy_language.keywords(params, function (err, response) {
  if (err) {
    console.log('error:', err);
  }
  else {
    var array = response.keywords;
    if (array.length < 0) {
      console.log('no keywords')
    }
    else {
      var searchString = '';
      for (var i = 0; i < array.length; i++) {
        searchString += array[i].text + ' ';
      }
      console.log(searchString);
    }
  }
});
*/

function findKeywords(initialString, callback) {
  var params = {
    text: initialString
  };

  alchemy_language.sentiment(params, function (err, response) {
    if (err) {
      console.log('error:', err);
      callback(initialString);
    }
    else {
      var array = response.keywords;
      if (array.length > 0) {
        callback(initialString)
      }
      else {
        var searchString = '';
        for (var i = 0; i < array.length; i++) {
          searchString += array[i].text + ' ';
        }
        callback(searchString);
      }
    }
  });

}


module.networkSource = { // + delimited
    "huffingtonpost": "http://www.huffingtonpost.com/search?sortBy=recency&sortOrder=desc&keywords=",
    "wnd": "http://www.wnd.com/?s=",
    "theblaze": "http://www.theblaze.com/?s=",
    "washingtonpost": "https://www.washingtonpost.com/newssearch/?query=",
    "npr": "http://www.npr.org/search/index.php?searchinput=",
    "time": "http://search.time.com/?site=time&q=",
    "thenation": "http://www.thenation.com/?post_type=article&ssearch=",
    "politico": "http://www.politico.com/search?q="
};

module.scrapeNetwork = {
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
        var link = item.children("h2").first().children().first().attr("href");
        var img = item.children("figure").first().children().first().attr("src");

        if (!title || !link) {
            return null;
        }
        link = url.resolve(baseLink, link);

        if (!img) {
            img = null;
        } else {
            img = url.resolve(baseLink, img);
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "theblaze": function($, baseLink) {
        var item = $("a.feed-link").first();
        var link = item.attr("href");
        var title = item.children(".feed-bottom").first().children().first().text().trim();
        var img = item.children("div.feed-img").first().children().first().attr("src");

        if (!title || !link) {
            return null;
        }
        link = url.resolve(baseLink, link);

        if (!img) {
            img = null;
        } else {
            img = url.resolve(baseLink, img);
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "washingtonpost": function($, baseLink) {
        var link = $("a.ng-binding").first().attr("href");
        var title = $("a.ng-binding").first().text();
        var img = $(".pb-feed-article-image.ng-scope").first().attr("src");

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "npr": function($, baseLink) {
        var link = $("h1.title").first().children().first().attr("href");
        var title = $("h1.title").first().children().first().text();
        var img = $("article.item").first().children().first().children().first().children().first().children().first().children().first().attr("src");

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "time": function($, baseLink) {
        var link = $("div.content-title").first().children().first().attr("href");
        var title = $("div.content-title").first().children().first().text();
        var img = $("span.content-image").first().children().first().children().first().attr("src");

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        //console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "thenation": function($, baseLink) {
        var link = $("div.details").first().children().first().children().first().attr("href");
        var title = $("div.details").first().children().first().children().first().text();
        var img = $("div.listing__img.small-4.medium-3.columns").first().children().children().attr("src");

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    },
    "politico": function($, baseLink) {
        var link = $("div.summary").first().children().children().children().attr("href");
        var title = $("div.summary").first().children().children().children().first().text();
        var img = $("div.fig-graphic").first().children().children().first().attr("src");

        if (!title || !link) {
            return null;
        }
        if (!img) {
            img = null;
        }

        console.log("LINK: " + link, "TITLE: " + title, "IMG: " + img);
        return {"url": link, "title": title, "img": img};
    }
};

module.exports.scrape = function(network, article, callback) {
    /*if (typeof network == "string") {
        network = newsNetwork.getNewsNetwork(network);
    }*/
    console.log(network);

    if (!network.searchable || module.networkSource[network.name] == undefined) {
        console.error("Network '" + network.name + "' is not searchable.");
        callback(null);
        return;
    }

    var query = querystring.stringify({query: "article"}).split("%20").join("+");
    findKeywords(query, function(keywordsAsString) {

      var link = module.networkSource[network.name] + query;
      console.log("Scraping " + link);

      request(link, function(err, res, html) {
          if (err != undefined) {
              console.error("Failed to scrape:", err.stack);
              callback(null);
              return;
          }

          var $ = cheerio.load(html);
          console.log("Scraping network '" + network.name + "'");
          callback(module.scrapeNetwork[network.name]($, link));
      });

    })
}
