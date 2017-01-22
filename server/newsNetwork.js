var mongodb = require("./mongodb.js");
var htmlparser = require("./feedparser.js");

var rssList = [
    {name: "vox", realname: "Vox.com", defaultImg: 'http://i.imgur.com/lEuTNRb.png', domain: "www.vox.com", rss: 'http://www.vox.com/rss/index.xml', lean: -0.67, cache: [], searchable: false},
    {name: "cnn", realname: "CNN", defaultImg: 'http://wepartypatriots.com/wp/wp-content/uploads/2014/09/CNN-logo.jpg', domain: "www.cnn.com", rss: 'http://rss.cnn.com/rss/cnn_topstories.rss', lean: -0.067, cache: [], searchable: false},
    {name: "motherjones", realname: "Mother Jones", defaultImg: 'http://cdn.newsbusters.org/images/motherjones_logo_facebook.jpg', domain: "www.motherjones.com", rss: 'http://feeds.feedburner.com/motherjones/main', lean: -0.93, cache: [], searchable: false},
    {name: "huffingtonpost", realname: "Huffington Post", defaultImg: 'http://lh5.ggpht.com/s5DuS8_GWnjvGd-Ypdxd9-5S3H3ul_82CFMomN7OgTYBM223Sxnf-qOZLxPk0owqUAw=w300', domain: "www.huffingtonpost.com", rss: 'http://www.huffingtonpost.com/feeds/index.xml', lean: -0.8, cache: [], searchable: true},
    {name: "salon", realname: "Salon", defaultImg: 'http://media.salon.com/images/salon-twitter-card.jpg', domain: "www.salon.com", rss: 'http://www.salon.com/feed/', lean: -0.73, cache: [], searchable: false},
    {name: "wnd", realname: "WND", defaultImg: 'http://pbs.twimg.com/profile_images/1426598663/wnd.WND.logo.white.jpg', domain: "www.wnd.com", rss: 'http://www.wnd.com/feed/', lean: 1.0, cache: [], searchable: true},
    {name: "breitbart", realname: "Breitbart", defaultImg: 'http://cloudfront.mediamatters.org/static/uploader/image/2016/03/11/breitbart-fb.jpg', domain: "www.breitbart.com", rss: 'https://feeds.feedburner.com/breitbart', lean: 0.93, cache: [], searchable: false},
    {name: "theblaze", realname: "The Blaze", defaultImg: 'http://pbs.twimg.com/profile_images/3436711800/ee29cac54256e75a69cf134ec15f9ada_400x400.png', domain: "www.theblaze.com", rss: 'http://www.theblaze.com/rss', lean: 0.8, cache: [], searchable: true},
    {name: "foxnews", realname: "Fox News", defaultImg: 'https://pmcvariety.files.wordpress.com/2013/12/fox-news-logo.jpg?w=1000&h=563&crop=1', domain: "www.foxnews.com", rss: 'http://feeds.foxnews.com/foxnews/latest', lean: 0.53, cache: [], searchable: false},
    {name: "washingtontimes", realname: "Washington Times", defaultImg: 'https://pbs.twimg.com/profile_images/797941480107216896/0F7jfmaf.jpg', domain: "www.washingtontimes.com", rss: 'http://www.washingtontimes.com/rss/headlines/news/', lean: 0.47, cache: [], searchable: false},
    {name: "wsj", realname: "Wall Street Journal", defaultImg: 'http://www.radicalandright.com/wp-content/uploads/2015/12/WSJ.png', domain: "www.wsj.com", rss: 'http://www.wsj.com/xml/rss/3_7085.xml', lean: 0.4, cache: [], searchable: false}, // (world news)
    {name: "forbes", realname: "Forbes", defaultImg: 'http://www.millennialmarketing.com/wp-content/uploads/2013/03/forbes.com-logo-vector.png', domain: "www.forbes.com", rss: 'https://www.forbes.com/real-time/feed2/', lean: 0.33, cache: [], searchable: false},
    {name: "realclearpolitics", realname: "RealClearPolitics", defaultImg: 'http://www.realclearpolitics.com/asset/img/rcp-logo-ss-red-250.gif', domain: "www.realclearpolitics.com", rss: 'https://feeds.feedburner.com/realclearpolitics/qlMj', lean: 0.2, cache: [], searchable: false},
    {name: "usatoday", realname: "USA Today", defaultImg: 'http://www.stonybrook.edu/commcms/ceas/images/news/usa-today-logo.jpg', domain: "www.usatoday.com", rss: 'http://rssfeeds.usatoday.com/usatoday-newstopstories&x=1', lean: 0, cache: [], searchable: false},
    {name: "abcnews", realname: "ABC News", defaultImg: 'http://image.roku.com/blog/wp-content/uploads/2015/03/ABC-News-logo.jpg', domain: "abcnews.go.com", rss: 'http://feeds.abcnews.com/abcnews/topstories', lean: -0.13, cache: [], searchable: true},
    {name: "cbsnews", realname: "CBS News", defaultImg: 'http://audienceservices.cbs.com/feedback/cbsn.jpg', domain: "www.cbsnews.com", rss: 'http://www.cbsnews.com/latest/rss/main', lean: -0.2, cache: [], searchable: false},
    {name: "washingtonpost", realname: "Washington Post", defaultImg: 'http://pbs.twimg.com/profile_images/753656134565785600/iQ1GX-ov.jpg', domain: "www.washingtonpost.com", rss: 'http://feeds.washingtonpost.com/rss/politics', lean: -0.27, cache: [], searchable: true},
    {name: "time", realname: "Time", defaultImg: 'http://s0.wp.com/wp-content/themes/vip/time2014/img/time-logo-og.png', domain: "www.time.com", rss: 'http://time.com/feed/', lean: -0.33, cache: [], searchable: true},
    {name: "nytimes", realname: "New York Times", defaultImg: 'http://www.powerlineblog.com/ed-assets/2016/11/20-ny-times-logo.w529.h529.2x.jpg', domain: "www.nytimes.com", rss: 'http://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', lean: -0.4, cache: [], searchable: true},
    {name: "npr", realname: "NPR", defaultImg: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/NPR_News_logo.png', domain: "www.npr.org", rss: 'http://www.npr.org/rss/rss.php?id=1001', lean: -0.47, cache: [], searchable: true}, // (top stories)
    {name: "msnbc", realname: "MSNBC", defaultImg: 'http://www.msnbc.com/sites/msnbc/themes/leanforward/images/site-header/msnbc-logo-card.png', domain: "www.msnbc.com", rss: 'http://www.msnbc.com/feeds/latest', lean: -0.53, cache: [], searchable: false},
    {name: "mediamatters", realname: "Media Matters", defaultImg: 'http://static01.mediaite.com/med/wp-content/uploads/2013/08/mediamatters-1347913057_600-e1481030954235.jpg', domain: "www.mediamatters.org", rss: 'http://mediamatters.org/rss/all.rss', lean: -0.6, cache: [], searchable: false},
    {name: "thenation", realname: "The Nation", defaultImg: 'https://donate.thenation.com/image/NAtion-Logo.jpg', domain: "www.thenation.com", rss: 'https://www.thenation.com/feed/?post_type=article', lean: -0.87, cache: [], searchable: true},
    {name: "alternet", realname: "Alternet", defaultImg: 'http://www.alternet.org/sites/all/themes/custom/alternet/logo.png', domain: "www.alternet.org", rss: 'https://feeds.feedblitz.com/alternet', lean: -1.0, cache: [], searchable: false},
    {name: "politico", realname: "Politico", defaultImg: 'https://pbs.twimg.com/profile_images/677177503694237697/y6yTzWn6.png', domain: "www.politico.com", rss: 'http://www.politico.com/rss/politics08.xml', lean: 0, cache: [], searchable: true},
    {name: "thehill", realname: "The Hill", defaultImg: 'http://www.adweek.com/fishbowldc/files/2013/12/the-hill.jpg', domain: "www.thehill.com", rss: 'http://thehill.com/rss/syndicator/19110', lean: 0, cache: [], searchable: false},
    {name: "rollcall", realname: "Roll Call", defaultImg: 'http://data.rollcall.com/pub/layouts/newrc/images/rollcall-index-logo.png', domain: "www.rollcall.com", rss: 'http://www.rollcall.com/rss/tag/rss-feed/all-news', lean: 0, cache: [], searchable: false}
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

function rssContentParser2(content) {

    var re = [];
    re[0] = new RegExp("<[iI]mg(.*?)src=\'(.*?)([^/]\')(.*?)/>");
    re[1] = new RegExp("src=\'.*\'");
    re[2] = new RegExp("\'.*\'");

    var image = content;

    for (var i = 0; i < re.length; i++) {
        image = re[i].exec(image);
        if (image == null) {
            return "";
        }
        else {
		    image = image[0];
        }
    }
    image = image.split('\'')[1];
    if (image == undefined || image == null) {
        image = '';
    }
    return image;
}

function rssContentParser(content) {

    var re = [];
    re[0] = new RegExp("<[iI]mg(.*?)src=\"(.*?)([^/]\")(.*?)>");
    re[1] = new RegExp("src=\".*\"");
    re[2] = new RegExp("\".*\"");

    var image = content;

    for (var i = 0; i < re.length; i++) {
        image = re[i].exec(image);
        if (image == null) {
            return "";
        }
        else {
		    image = image[0];
        }
    }
    image = image.split('\"')[1];
    if (image == undefined || image == null) {
        image = '';
    }
    return image;
}

// works
rssReader["vox"] = function(post) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        ['atom:content', '#']
    ])(post);

    obj.image = rssContentParser(obj.image);
    // console.log(obj);

    return obj;
};

// works
rssReader["cnn"] = createGeneralReader([
    ['title'],
    ['link'],
    ['meta', 'image', 'url']
]);

// works
rssReader["motherjones"] = createGeneralReader([
    ['title'],
    ['link'],
    ['meta', 'image', 'url']
]);

// works very small image, sometimes no image
rssReader["huffingtonpost"] = createGeneralReader([
    ['title'],
    ['link'],
    ['enclosures', 0, 'url']
]);

// works
rssReader["salon"] = function(post) {
    var obj = createGeneralReader([
      ['title'],
      ['link'],
      ['description']
  ])(post);

    obj.image = rssContentParser(obj.image);
    console.log(obj);

    // process.exit();

    return obj;
}

// works no image
rssReader["washingtontimes"] = function(post) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        []
    ])(post);

    obj.image = ''; // webscrape (obj.url)

    return obj;
}

// works
rssReader["wsj"] = createGeneralReader([
    ['title'],
    ['link'],
    ['enclosures', 0, 'url']
]);

// works
rssReader["forbes"] = createGeneralReader([
    ['title'],
    ['link'],
    ['enclosures', 0, 'url']
]);

// works no image
rssReader["realclearpolitics"] = function(post) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        []
    ])(post);

    obj.image = ''; // webscrape (obj.url)

    return obj
}

// works no image
rssReader["usatoday"] = function(post) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        []
    ])(post);

    obj.image = ''; // webscrape (obj.url)

    return obj
}

// works
rssReader["abcnews"] = createGeneralReader([
    ['title'],
    ['link'],
    ['media:thumbnail', 5, '@', 'url'] // alternate ['image', 'url'] small image, but still good size
]);

// works, extremely small image
rssReader["cbsnews"] = createGeneralReader([
    ['title'],
    ['link'],
    ['rss:image', '#']
]);

// works
rssReader["washingtonpost"] = createGeneralReader([
    ['title'],
    ['link'],
    ['image', 'url']
]);

// works
rssReader["time"] = createGeneralReader([
    ['title'],
    ['link'],
    ['image', 'url']
]);

// works, small image, would rather bigger
rssReader["nytimes"] = createGeneralReader([
    ['title'],
    ['link'],
    ['media:content', '@', 'url']
]);

// works
rssReader["npr"] = function(node) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        ['description']
    ])(node);
    obj.image = rssContentParser2(obj.image);
    return obj;
}

// works small image, but good size
rssReader["msnbc"] = createGeneralReader([
    ['title'],
    ['link'],
    ['image', 'url']
]);

// works very rare images
rssReader["mediamatters"] = function(arg) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        ['description']
    ])(arg);

    obj.image = rssContentParser(obj.image);

    return obj;
}

// works, small would like bigger
rssReader["thenation"] = function(arg) {
    var obj = createGeneralReader([
        ['title'],
        ['link'],
        ['description']
    ])(arg);

    obj.image = rssContentParser(obj.image);

    return obj;
}

// works, extremely small image
rssReader["alternet"] = createGeneralReader([
    ['title'],
    ['link'],
    ['enclosures', 0, 'url']
]);

// no image
rssReader["politico"] = createGeneralReader([
    ['title'],
    ['link'],
    []
]);

// no image
rssReader["thehill"] = createGeneralReader([
    ['title'],
    ['link'],
    ['content:encoded', 'p']
]);

// no image
rssReader["rollcall"] = createGeneralReader([
    ['title'],
    ['link'],
    []
]);

// works, no image
rssReader["foxnews"] = function(post) {
    console.log(post);
    var obj = createGeneralReader([
      ['title'],
      ['link'],
      []
    ])(post);

    obj.image = '';

    return obj;
}

function createGeneralReader(arr, flag) {
    if (flag == undefined) {
        flag = true;
    }
    return function(post) {
        var obj = {};
        var cur;

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
            if (obj.image == undefined || obj.image == null) {
                break;
            }
        }

        if (flag && typeof obj.image != 'string') {
            obj.image = '';
        }

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
    console.log('looking for network: ' + newsNetworkName);
    mongodb.MongoClient.connect(url, function(err, db) {
        if (err != null) {
          console.log("error?");
          console.log(err);
        }
        else {
            console.log("Connected successfully to mongo server");
        }

      // check database for cache
      mongodb.findDocument(db, {'name': newsNetworkName},function(result) {
          // if news network is found
          if (1 <= result.length) {
              console.log("network found in database");
              var network = result[0].data;

              // if lastUpdate was less than 1 hour ago
              var hour = 60*60*1000;
              if (network.lastUpdate > Date.now() - hour) {
                  callback(network.cache);
                  db.close();
              }
              else {
                  console.log("updating network");
                  // check rss
                  getCacheFromRssAndUpdate(db, newsNetworkName, callback)
              }

          }
          else {
              console.log("network not found in database");
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
        var set = {"name": newsNetworkName, "data": newsNetwork};
        mongodb.insertDocument(db, set, function(result) {
            console.log("network added to database");
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
            console.log("network updated");
            db.close();
        });
        callback(cache);
    });
}

// DONE
function getCacheFromRss(newsNetworkName, callback) {
    console.log("parsing rss");

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
