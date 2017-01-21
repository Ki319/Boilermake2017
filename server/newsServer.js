var http = require("http");
var request = require("request");
var querystring = require("querystring");
var parser = require("rss-parser");
var cheerio = require("cheerio");

var rssList = [
    'http://www.vox.com/rss/index.xml', // vox
    'http://rss.cnn.com/rss/cnn_topstories.rss', // cnn
    'http://feeds.feedburner.com/motherjones/main', // motherjones
    'http://www.huffingtonpost.com/feeds/index.xml', // huffington
    'http://www.salon.com/feed/', // salon
    'http://www.wnd.com/feed/', // wnd
    'https://feeds.feedburner.com/breitbart', // breitbart
    'http://www.theblaze.com/rss', // the blaze
    'http://feeds.foxnews.com/foxnews/latest', // fox news
    'http://www.washingtontimes.com/rss/headlines/news/', // washington times
    'http://www.wsj.com/xml/rss/3_7085.xml', // wall street journal (world news)
    'https://www.forbes.com/real-time/feed2/', // forbes
    'https://feeds.feedburner.com/realclearpolitics/qlMj', // real clear politics
    'http://rssfeeds.usatoday.com/usatoday-NewsTopStories', // usa today
    'http://feeds.abcnews.com/abcnews/topstories', // abc news
    'http://www.cbsnews.com/latest/rss/main', // cbs news
    'http://feeds.washingtonpost.com/rss/politics', // washington post
    'http://time.com/feed/', // time
    'http://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', // ny times
    'http://www.npr.org/rss/rss.php?id=1001', // npr (top stories)
    'http://www.msnbc.com/feeds/latest', // msnbc
    'http://mediamatters.org/rss/all.rss', // media matters
    'https://www.thenation.com/feed/?post_type=article', // the nation
    'https://feeds.feedblitz.com/alternet', // alternet
    'http://www.politico.com/rss/politics08.xml', //politico
    'http://thehill.com/rss/syndicator/19110', // the hill
    'http://www.rollcall.com/rss/tag/rss-feed/all-news' // roll call
]

parser.parseURL(rssList[2], function(err, parsed) {
    console.log(parsed.feed.title);
    parsed.feed.entries.forEach(function(entry) {
        console.log(entry.title + ':' + entry.link);
    });
});

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
