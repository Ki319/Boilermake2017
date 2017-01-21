var http = require("http");
var request = require("request");
var querystring = require("querystring");
var parser = require("rss-parser");

var rssList = [
    {name: "vox", rss: 'http://www.vox.com/rss/index.xml', lean: -0.67, cache: []},
    {name: "cnn", rss: 'http://rss.cnn.com/rss/cnn_topstories.rss', lean: -0.067, cache: []},
    {name: "motherjones", rss: 'http://feeds.feedburner.com/motherjones/main', lean: -0.93, cache: []},
    {name: "huffington post", rss: 'http://www.huffingtonpost.com/feeds/index.xml', lean: -0.8, cache: []},
    {name: "salon", rss: 'http://www.salon.com/feed/', lean: -0.73, cache: []},
    {name: "wnd", rss: 'http://www.wnd.com/feed/', lean: 1.0, cache: []},
    {name: "breitbart", rss: 'https://feeds.feedburner.com/breitbart', lean: 0.93, cache: []},
    {name: "the blaze", rss: 'http://www.theblaze.com/rss', lean: 0.8, cache: []},
    {name: "fox news", rss: 'http://feeds.foxnews.com/foxnews/latest', lean: 0.53, cache: []},
    {name: "washington times", rss: 'http://www.washingtontimes.com/rss/headlines/news/', lean: 0.47, cache: []},
    {name: "wsj", rss: 'http://www.wsj.com/xml/rss/3_7085.xml', lean: 0.4, cache: []}, // (world news)
    {name: "forbes", rss: 'https://www.forbes.com/real-time/feed2/', lean: 0.33, cache: []},
    {name: "real clear politics", rss: 'https://feeds.feedburner.com/realclearpolitics/qlMj', lean: 0.2, cache: []},
    {name: "usa today", rss: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories', lean: 0, cache: []},
    {name: "abc news", rss: 'http://feeds.abcnews.com/abcnews/topstories', lean: -0.13, cache: []},
    {name: "cbs news", rss: 'http://www.cbsnews.com/latest/rss/main', lean: -0.2, cache: []},
    {name: "washington post", rss: 'http://feeds.washingtonpost.com/rss/politics', lean: -0.27, cache: []},
    {name: "time", rss: 'http://time.com/feed/', lean: -0.33, cache: []},
    {name: "ny times", rss: 'http://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', lean: -0.4, cache: []},
    {name: "npr", rss: 'http://www.npr.org/rss/rss.php?id=1001', lean: -0.47, cache: []}, // (top stories)
    {name: "msnbc", rss: 'http://www.msnbc.com/feeds/latest', lean: -0.53, cache: []},
    {name: "media matters", rss: 'http://mediamatters.org/rss/all.rss', lean: -0.6, cache: []},
    {name: "the nation", rss: 'https://www.thenation.com/feed/?post_type=article', lean: -0.87, cache: []},
    {name: "alternet", rss: 'https://feeds.feedblitz.com/alternet', lean: -1.0, cache: []},
    {name: "politico", rss: 'http://www.politico.com/rss/politics08.xml', lean: 0, cache: []},
    {name: "the hill", rss: 'http://thehill.com/rss/syndicator/19110', lean: 0, cache: []},
    {name: "roll call", rss: 'http://www.rollcall.com/rss/tag/rss-feed/all-news', lean: 0, cache: []}
]

function getNewsNetwork(network) {
    for (var i = 0; i < rssList.length; i++) {
        if (rssList[i].name == network) {
            return rssList[i];
        }
    }
}

setInterval(function() {
    scrapeAllRss(function(network, articles) {
        var newNetwork = getNewsNetwork(network);
        rssReader[network](articles);
        if (network == "vox") {
            articles.feed.entries.forEach(function(entry) {
                console.log(entry.title);
                console.log(entry.link);
                var re = new RegExp("^<img.*src=\".*\" \/>");
                var image = re.exec(entry.content);
                re = new RegExp("^<img.*src=\".*\" \/>");
                if(image != null) {
                    console.log(image);
                }
            });
        }
        else {
            articles.feed.entries.forEach(function(entry) {
                console.log(entry.title);
                console.log(entry.link);
            });
        }
    });
}, 60 * 60 * 1000);

var rssReader = [];

rssReader["vox"] = function(articles) {
    var cache = [];
    articles.feed.entries.forEach(function(entry) {
        console.log(entry.title);
        console.log(entry.link);
        var re = new RegExp("^<img.*src=\".*\" \/>");
        var image = re.exec(entry.content);
        re = new RegExp("^<img.*src=\".*\" \/>");
        if(image != null) {
            console.log(image);
        }
    }, cache);
}

var info = {
    "title": "",
    "title": "",
    "url": "",
    "image": "",
    "title": "",
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

/*
var sources = [];

sources["cnn"] = function (article) {
    var query = querystring.stringify({query: article});
    request("http://www.cnn.com/search/?text=" + query, function(error, response, html) {
        if (error) {
            console.error(error);
            return null;
        } else {
            var $ = cheerio.load(html);
            var href = $(".cd__headline-text").first().parent();
        }
    });
}
*/

function scrapeSource(source, article) {
    console.log("Scraping " + source + " for '" + article + "'.")
    sources[source](article);
}


http.createServer(function (req, res) {
    var body = [];

    console.log("Connection established.");

    req.on("data", function (buff) {
        body.push(buff);
    }).on("end", function() {
        body = Buffer.concat(body).toString();

        url = body; // Might need parsing later.



        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("http://hmpg.net/downloadwww.gif\nhttp://hmpg.net/\nThis is the Trump era.\n");

        body = [];
    }).on("error", function(err) {
        console.error(err.stack);
    });
}).listen(9090, "0.0.0.0");

console.log("Server running on port 9090.");
