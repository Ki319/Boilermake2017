var http = require("http");
var request = require("request");
var querystring = require("querystring");
var parser = require("rss-parser");
var newsNetwork = require("./newsNetwork.js");

newsNetwork.startFeedReader();

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
