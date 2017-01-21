var parser = require("rss-parser");
var mongodb = require("./mongodb.js");

var rssList = [
    {name: "vox", domain: "www.vox.com", rss: 'http://www.vox.com/rss/index.xml', lean: -0.67, cache: []},
    {name: "cnn", domain: "www.cnn.com", rss: 'http://rss.cnn.com/rss/cnn_topstories.rss', lean: -0.067, cache: []},
    {name: "motherjones", domain: "www.motherjones.com", rss: 'http://feeds.feedburner.com/motherjones/main', lean: -0.93, cache: []},
    {name: "huffingtonpost", domain: "www.huffingtonpost.com", rss: 'http://www.huffingtonpost.com/feeds/index.xml', lean: -0.8, cache: []},
    {name: "salon", domain: "www.salon.com", rss: 'http://www.salon.com/feed/', lean: -0.73, cache: []},
    {name: "wnd", domain: "www.wnd.com", rss: 'http://www.wnd.com/feed/', lean: 1.0, cache: []},
    {name: "breitbart", domain: "www.breitbart.com", rss: 'https://feeds.feedburner.com/breitbart', lean: 0.93, cache: []},
    {name: "theblaze", domain: "www.theblaze.com", rss: 'http://www.theblaze.com/rss', lean: 0.8, cache: []},
    {name: "foxnews", domain: "www.foxnews.com", rss: 'http://feeds.foxnews.com/foxnews/latest', lean: 0.53, cache: []},
    {name: "washingtontimes", domain: "www.washingtontimes.com", rss: 'http://www.washingtontimes.com/rss/headlines/news/', lean: 0.47, cache: []},
    {name: "wsj", domain: "www.wsj.com", rss: 'http://www.wsj.com/xml/rss/3_7085.xml', lean: 0.4, cache: []}, // (world news)
    {name: "forbes", domain: "www.forbes.com", rss: 'https://www.forbes.com/real-time/feed2/', lean: 0.33, cache: []},
    {name: "realclearpolitics", domain: "www.realclearpolitics.com", rss: 'https://feeds.feedburner.com/realclearpolitics/qlMj', lean: 0.2, cache: []},
    {name: "usatoday", domain: "www.usatoday.com", rss: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories', lean: 0, cache: []},
    {name: "abcnews", domain: "www.abcnews.com", rss: 'http://feeds.abcnews.com/abcnews/topstories', lean: -0.13, cache: []},
    {name: "cbsnews", domain: "www.cbsnews.com", rss: 'http://www.cbsnews.com/latest/rss/main', lean: -0.2, cache: []},
    {name: "washingtonpost", domain: "www.washingtonpost.com", rss: 'http://feeds.washingtonpost.com/rss/politics', lean: -0.27, cache: []},
    {name: "time", domain: "www.time.com", rss: 'http://time.com/feed/', lean: -0.33, cache: []},
    {name: "nytimes", domain: "www.nytimes.com", rss: 'http://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', lean: -0.4, cache: []},
    {name: "npr", domain: "www.npr.org", rss: 'http://www.npr.org/rss/rss.php?id=1001', lean: -0.47, cache: []}, // (top stories)
    {name: "msnbc", domain: "www.msnbc.com", rss: 'http://www.msnbc.com/feeds/latest', lean: -0.53, cache: []},
    {name: "mediamatters", domain: "www.mediamatters.org", rss: 'http://mediamatters.org/rss/all.rss', lean: -0.6, cache: []},
    {name: "thenation", domain: "www.thenation.com", rss: 'https://www.thenation.com/feed/?post_type=article', lean: -0.87, cache: []},
    {name: "alternet", domain: "www.alternet.org", rss: 'https://feeds.feedblitz.com/alternet', lean: -1.0, cache: []},
    {name: "politico", domain: "www.politico.com", rss: 'http://www.politico.com/rss/politics08.xml', lean: 0, cache: []},
    {name: "thehill", domain: "www.thehill.com", rss: 'http://thehill.com/rss/syndicator/19110', lean: 0, cache: []},
    {name: "rollcall", domain: "www.rollcall.com", rss: 'http://www.rollcall.com/rss/tag/rss-feed/all-news', lean: 0, cache: []}
];

/*
vox
cnn
motherjones
huffingtonpost
salon
wnd
breitbart
theblaze
foxnews
washingtontimes
wsj
forbes
realclearpolitics
usatoday
abcnews
cbsnews
washingtonpost
time
nytimes
npr
msnbc
mediamatters
thenation
alternet
politico
thehill
rollcall
*/

function getNewsNetwork(network) {
    for (var i = 0; i < rssList.length; i++) {
        if (rssList[i].name == network) {
            return rssList[i];
        }
    }
}

function getNewsNetworkByDomain(domain) {
    for (var i = 0; i < rssList.length; i++) {
        if (rssList[i].domain.indexOf(domain) >= 0) {
            return rssList[i];
        }
    }
}

function getNewsNetworksByLean(low, high) {
    if (high < low) {
        var temp = high;
        high = low;
        low = temp;
    }
    var results = [];
    for (var i = 0; i < rssList.length; i++) {
        if (rssList[i].lean >= low && rssList[i].lean <= high) {
            results.push(rssList[i]);
        }
    }
    return results;
}

var rssReader = [];

rssReader["vox"] = createGeneralReader(function(entry) {
    var re = [];
    re[0] = new RegExp("^<img.*src=\".*\" \/>");
    re[1] = new RegExp("src=\".*\"");
    re[2] = new RegExp("\".*\"");

    var image = entry.content;

    for (var i = 0; i < re.length; i++) {
        image = re[i].exec(image);
        if(image != null) {
            image = image[0];
        }
        else {
            return "";
        }
    }
    image = image.substring(1, image.length - 1);
    return image;
});

rssReader["cnn"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["motherjones"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["huffingtonpost"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["salon"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["wnd"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["breitbart"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["theblaze"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["foxnews"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["washingtontimes"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["wsj"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["forbes"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["realclearpolitics"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["usatoday"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["abcnews"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["cbsnews"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["washingtonpost"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["time"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["nytimes"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["npr"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["msnbc"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["mediamatters"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["thenation"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["alternet"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["politico"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["thehill"] = createGeneralReader(function(entry) {
    return entry.image;
});
rssReader["rollcall"] = createGeneralReader(function(entry) {
    return entry.image;
});

function createGeneralReader(entryFunction) {
    return function(articles, cache) {
        articles.feed.entries.forEach(function(entry) {
            var obj = {};
            obj.title = entry.title;
            obj.url = entry.link;
            obj.image = entryFunction(entry);
            cache.push(obj);
        }, cache, entryFunction);
    };
}

function scrapeAllRss(callback) {
    parser.parseURL(rssList[0].rss, function(err, parsed) {
        console.log(parsed.feed.title);
        parsed.feed.entries.forEach(function(entry) {
            console.log(entry.title + ':' + entry.link);
        });
        callback(rssList[0].name, parsed);
    });
}

function startFeedReader() {

    scrapeAllRss(function(network, articles) {
        // connect to mongodb
        MongoClient.connect(url, function(err, db) {
            // check if we up to date cache
          assert.equal(null, err);
          console.log("Connected successfully to server");

          //
          var newsNetwork = getNewsNetwork(network);
          rssReader[network](articles, newsNetwork.cache);

          db.close();
        });
    });
    /*
    var refreshIntervalId = setInterval(function() {
        console.log('intervalSet');
        scrapeAllRss(function(network, articles) {
            var newsNetwork = getNewsNetwork(network);
            rssReader[network](articles, newsNetwork.cache);
        });
        clearInterval(refreshIntervalId);
    }, 1000);
    */
}

var url = 'mongodb://localhost:27017/news';

function getCache(newsNetworkName, callback) {
    mongodb.MongoClient.connect(url, function(err, db) {
      //assert.equal(null, err);
      console.log("Connected successfully to server");

      // check database for cache
      mongodb.findDocument(db, {'name': newsNetworkName},function(result) {
          // if news network is found
          if (1 <= result.length) {
              var network = result;

              // if lastUpdate was less than 1 hour ago
              var hour = 60*60*1000;
              if (network.lastUpdate > Date.now() - hour) {
                  callback(network.cache);
              }
              else {
                  // check rss
                  getCacheFromRssAndUpdate(db, newsNetworkName, callback)
              }

          }
          else {
              getCacheFromRssAndUpdate(db, newsNetworkName, callback)
          }
      });

      db.close();
    });
    // check database
    // return cache

    // on failure/more than 1 hour ago
    // check rss
    // add cache to database
    // return cache

    // return cache
}

function getCacheFromRssAndCreate(db, newsNetworkName, callback) {
    getCacheFromRss(newsNetworkName, function(cache) {
        var newsNetwork = getNewsNetwork(newsNetworkName);
        newsNetwork.lastUpdate = Date.now();
        newsNetwork.cache = cache;
        var set = {"$set": newsNetwork};
        mongodb.insertDocument(db, set, function(result) {

        });
        callback(cache);
    });
}

// DONE
function getCacheFromRssAndUpdate(db, newsNetworkName, callback) {
    getCacheFromRss(newsNetworkName, function(cache) {
        var newsNetwork = getNewsNetwork(newsNetworkName);
        newsNetwork.lastUpdate = Date.now();
        newsNetwork.cache = cache;
        var set = {"$set": newsNetwork};
        mongodb.updateDocument(db, {'name': newsNetworkName}, set, function(result) {

        });
        callback(cache);
    });
}

// DONE
function getCacheFromRss(newsNetworkName, callback) {
    var newsNetwork = getNewsNetwork(newsNetworkName);
    parser.parseURL(newsNetwork.rss, function(err, parsed) {
        var cache = [];
        rssReader[newsNetworkName](parsed, cache);
        callback(cache);
    });
}

module.exports.getNewsNetwork = getNewsNetwork;
module.exports.getNewsNetworksByLean = getNewsNetworksByLean;
module.exports.getNewsNetworkByDomain = getNewsNetworkByDomain;

module.exports.rssList = rssList;
module.exports.getCache = getCache;
