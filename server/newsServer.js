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
    'http://www.salon.com/feed/' // salon
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
