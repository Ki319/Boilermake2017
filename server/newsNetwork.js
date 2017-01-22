var mongodb = require("./mongodb.js");
var htmlparser = require("./feedparser.js");

var rssList = [
    {name: "vox", domain: "www.vox.com", rss: 'http://www.vox.com/rss/index.xml', lean: -0.67, cache: [], searchable: false},
    {name: "cnn", domain: "www.cnn.com", rss: 'http://rss.cnn.com/rss/cnn_topstories.rss', lean: -0.067, cache: [], searchable: false},
    {name: "motherjones", domain: "www.motherjones.com", rss: 'http://feeds.feedburner.com/motherjones/main', lean: -0.93, cache: [], searchable: false},
    {name: "huffingtonpost", domain: "www.huffingtonpost.com", rss: 'http://www.huffingtonpost.com/feeds/index.xml', lean: -0.8, cache: [], searchable: true},
    {name: "salon", domain: "www.salon.com", rss: 'http://www.salon.com/feed/', lean: -0.73, cache: [], searchable: false},
    {name: "wnd", domain: "www.wnd.com", rss: 'http://www.wnd.com/feed/', lean: 1.0, cache: [], searchable: true},
    {name: "breitbart", domain: "www.breitbart.com", rss: 'https://feeds.feedburner.com/breitbart', lean: 0.93, cache: [], searchable: false},
    {name: "theblaze", domain: "www.theblaze.com", rss: 'http://www.theblaze.com/rss', lean: 0.8, cache: [], searchable: true},
    {name: "foxnews", domain: "www.foxnews.com", rss: 'http://feeds.foxnews.com/foxnews/latest', lean: 0.53, cache: [], searchable: false},
    {name: "washingtontimes", domain: "www.washingtontimes.com", rss: 'http://www.washingtontimes.com/rss/headlines/news/', lean: 0.47, cache: [], searchable: false},
    {name: "wsj", domain: "www.wsj.com", rss: 'http://www.wsj.com/xml/rss/3_7085.xml', lean: 0.4, cache: [], searchable: false}, // (world news)
    {name: "forbes", domain: "www.forbes.com", rss: 'https://www.forbes.com/real-time/feed2/', lean: 0.33, cache: [], searchable: false},
    {name: "realclearpolitics", domain: "www.realclearpolitics.com", rss: 'https://feeds.feedburner.com/realclearpolitics/qlMj', lean: 0.2, cache: [], searchable: true},
    {name: "usatoday", domain: "www.usatoday.com", rss: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories', lean: 0, cache: [], searchable: false},
    {name: "abcnews", domain: "abcnews.go.com", rss: 'http://feeds.abcnews.com/abcnews/topstories', lean: -0.13, cache: [], searchable: true},
    {name: "cbsnews", domain: "www.cbsnews.com", rss: 'http://www.cbsnews.com/latest/rss/main', lean: -0.2, cache: [], searchable: false},
    {name: "washingtonpost", domain: "www.washingtonpost.com", rss: 'http://feeds.washingtonpost.com/rss/politics', lean: -0.27, cache: [], searchable: true},
    {name: "time", domain: "www.time.com", rss: 'http://time.com/feed/', lean: -0.33, cache: [], searchable: true},
    {name: "nytimes", domain: "www.nytimes.com", rss: 'http://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', lean: -0.4, cache: [], searchable: true},
    {name: "npr", domain: "www.npr.org", rss: 'http://www.npr.org/rss/rss.php?id=1001', lean: -0.47, cache: [], searchable: true}, // (top stories)
    {name: "msnbc", domain: "www.msnbc.com", rss: 'http://www.msnbc.com/feeds/latest', lean: -0.53, cache: [], searchable: false},
    {name: "mediamatters", domain: "www.mediamatters.org", rss: 'http://mediamatters.org/rss/all.rss', lean: -0.6, cache: [], searchable: false},
    {name: "thenation", domain: "www.thenation.com", rss: 'https://www.thenation.com/feed/?post_type=article', lean: -0.87, cache: [], searchable: true},
    {name: "alternet", domain: "www.alternet.org", rss: 'https://feeds.feedblitz.com/alternet', lean: -1.0, cache: [], searchable: false},
    {name: "politico", domain: "www.politico.com", rss: 'http://www.politico.com/rss/politics08.xml', lean: 0, cache: [], searchable: true},
    {name: "thehill", domain: "www.thehill.com", rss: 'http://thehill.com/rss/syndicator/19110', lean: 0, cache: [], searchable: false},
    {name: "rollcall", domain: "www.rollcall.com", rss: 'http://www.rollcall.com/rss/tag/rss-feed/all-news', lean: 0, cache: [], searchable: false}
];

/*
vox
cnn
motherjones
huffingtonpost [searchable](?)
salon [searchable](bad)
wnd [searchable]
breitbart [searchable]
theblaze [searchable]
foxnews
washingtontimes
wsj
forbes
realclearpolitics [searchable]
usatoday
abcnews [searchable]
cbsnews
washingtonpost [searchable]
time [searchable]
nytimes [searchable]
npr [searchable]
msnbc
mediamatters
thenation [searchable]
alternet
politico [searchable]
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

function getNewsNetworkByLean(targetLean, callback) {
    var bestNet = rssList[0];
    for (var i = 1; i < rssList.length; i++) {
        if (Math.abs(rssList[i].lean - targetLean) < Math.abs(bestNet.lean - targetLean)) {
            bestNet = rssList[i];
        }
    }
    callback(bestNet);
}

function getNewsNetworksByLean(low, high, callback) {
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
    callback(results);
}

var rssReader = [];

function rssContentParser(content) {
    var re = [];
    re[0] = new RegExp("<[iI]mg.*src=\".*\" \/>");
    re[1] = new RegExp("src=\".*\"");
    re[2] = new RegExp("\".*\"");

    var image = content;
    console.log(image);

    for (var i = 0; i < re.length; i++) {
        image = re[i].exec(image);
        console.log(image);
        if (image == null) {
            return "";
        }
        else {
		    image = image[0];
        }
    }
    image = image.split('\"')[1];
    return image;
}

rssReader["vox"] = function(post) {
    var obj = createGeneralReader([
        ['atom:title', '#'],
        ['link'],
        ['atom:content', '#']
    ])(post);

    obj.image = rssContentParser(obj.image);
    console.log(obj);
    console.log(null.drop);

    return obj;
};

rssReader["cnn"] = createGeneralReader([
    ['rss:title', '#'],
    ['rss:link', '#'],
    ['meta', 'image', 'url']
]);

rssReader["motherjones"] = createGeneralReader([
    ['title'],
    ['origlink'],
    ['meta', 'image', 'url']
]);

rssReader["huffingtonpost"] = createGeneralReader([
    ['title'],
    ['link'],
    ['enclosures', 0, 'url']
]);

rssReader["salon"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["washingtontimes"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["wsj"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["forbes"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["realclearpolitics"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["usatoday"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["abcnews"] = createGeneralReader([
    [],
    [],
    []
]);

rssReader["cbsnews"] = createGeneralReader([
    ['title'],
    ['rss:link', '#'],
    ['rss:image', '#']
]);
rssReader["washingtonpost"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["time"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["nytimes"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["npr"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["msnbc"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["mediamatters"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["thenation"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["alternet"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["politico"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["thehill"] = createGeneralReader([
    [],
    [],
    []
]);
rssReader["rollcall"] = createGeneralReader([
    [],
    [],
    []
]);

function createGeneralReader(arr) {
    return function(post) {
        var obj = {};
        var cur;

        console.log(post);

        cur = arr[0];
        obj.title = post;
        for (var i = 0; i < cur.length; i++) {
            obj.title = obj.title[cur[i]];
        }

        cur = arr[1];
        obj.url = post;
        for (var i = 0; i < cur.length; i++) {
            obj.url = obj.url[cur[i]];
        }

        cur = arr[2];
        obj.image = post;
        for (var i = 0; i < cur.length; i++) {
            obj.image = obj.image[cur[i]];
        }

        console.log(obj);

        process.exit();

        return obj;
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

var url = 'mongodb://localhost:27017/news';

function getCache(newsNetworkName, callback) {
    mongodb.MongoClient.connect(url, function(err, db) {
        if (err != null) {
          console.log("error?");
          console.log(err);
        }
        else {
            console.log("Connected successfully to server");
        }

      // check database for cache
      mongodb.findDocument(db, {'name': newsNetworkName},function(result) {
          // if news network is found
          if (1 <= result.length) {
              console.log("network found");
              var network = result[0].data;

              // if lastUpdate was less than 1 hour ago
              var hour = 60*60*1000;
              if (network.lastUpdate > Date.now() - hour) {
                  callback(network.cache);
                  db.close();
              }
              else {
                  // check rss
                  getCacheFromRssAndUpdate(db, newsNetworkName, callback)
              }

          }
          else {
              console.log("network not found");
              getCacheFromRssAndCreate(db, newsNetworkName, callback)
          }
      });
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
        console.log(newsNetwork);
        var set = {"name": newsNetworkName, "data": newsNetwork};
        mongodb.insertDocument(db, set, function(result) {
            console.log("Added to Database");
            db.close();
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
        var set = {"$set":
        {
            "data.lastUpdate": newsNetwork.lastUpdate,
            "data.cache": newsNetwork.cache,
        }};
        mongodb.updateDocument(db, {'name': newsNetworkName}, set, function(result) {
            db.close();
        });
        callback(cache);
    });
}

// DONE
function getCacheFromRss(newsNetworkName, callback) {
    var newsNetwork = getNewsNetwork(newsNetworkName);

    var readPost = rssReader[newsNetworkName];

    htmlparser.fetch(newsNetwork.rss, readPost, callback);
}

module.exports.getNewsNetwork = getNewsNetwork;
module.exports.getNewsNetworkByLean = getNewsNetworkByLean;
module.exports.getNewsNetworksByLean = getNewsNetworksByLean;
module.exports.getNewsNetworkByDomain = getNewsNetworkByDomain;

module.exports.rssList = rssList;
module.exports.getCache = getCache;
