

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


var rssReader = [];

rssReader["vox"] = function(articles, cache) {
    var re = [];
    re[0] = new RegExp("^<img.*src=\".*\" \/>");
    re[1] = new RegExp("src=\".*\"");
    re[2] = new RegExp("\".*\"");
    articles.feed.entries.forEach(function(entry) {
        var obj = {};
        image.title = entry.title;
        image.url = entry.link;

        var image = entry.content;

        for (var i = 0; i < re.length; i++) {
            image = re[i].exec(image);
            if(image != null) {
                image = image[0];
            }
            else {
                break;
            }
        }
        if(image != null) {
            image = image.substring(1, image.length - 1);
        }
        obj.img = image;
        cache.push(obj);
    }, cache, re);
}

function generalReader(articles, cache, entryFunction) {
    articles.feed.entries.forEach(function(entry) {
        var obj = {};
        image.title = entry.title;
        image.url = entry.link;
        entryFunction(obj);
        cache.push(obj);
    }, cache, entryFunction);
}

function scrapeAllRss(callback) {
    parser.parseURL(rssList[2], function(err, parsed) {
        console.log(parsed.feed.title);
        parsed.feed.entries.forEach(function(entry) {
            console.log(entry.title + ':' + entry.link);
        });
        callback(network, parsed.feed);
    });
}

function startFeedReader() {
    var refreshIntervalId = setInterval(function() {
        console.log('intervalSet');
        /*
        scrapeAllRss(function(network, articles) {
            var newsNetwork = getNewsNetwork(network);
            rssReader[network](articles, newsNetwork.cache);
        });
        */
        clearInterval(refreshIntervalId);
    },  1000);
}

module.exports.startFeedReader = startFeedReader;
module.exports.rssList = rssList;
