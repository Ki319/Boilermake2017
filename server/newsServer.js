var http = require("http");
var request = require("request");
var querystring = require("querystring");
var mongodb = require("./mongodb.js");
var newsNetwork = require("./newsNetwork.js");
var url = require("url");

console.log(newsNetwork.getCache("motherjones"));

function randomInt(min, max) { // [min, max] not [min, max)
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

http.createServer(function (req, res) {
    var body = [];

    console.log("Connection established.");
	
	mongodb.MongoClient.connect('mongodb://localhost:27016/news', function(err, db)
	{
		console.log("Connected to MongoDB");
		
		var user = null;
		
		mongodb.find(db, "users", {'userid' : INSERT_USERID}, function(result) {
				user = result[0];
		});
		
		if(user == null)
		{
			user = {userid : INSERT_USERID, history : []};
			mongodb.insert(db, "users", user, function(result) {
				console.log("SUCCESFULLY CREATE NEW USER");
			});
		}
		
		db.close();
	}

    req.on("data", function (buff) {
        body.push(buff);
    }).on("end", function() {
        body = Buffer.concat(body).toString();

        if (body == null || body == "") {
            console.error("Received no POST data.");
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(""); // null
            return;
        }

        var link = url.parse(body);
        var network = newsNetwork.getNewsNetworkByDomain(link.hostname);

        console.log ("User is reading from '" + network.name + "' with political lean " + network.lean + ".");

        var minlean, maxLean = 0;
        if (network.lean < 0) { // Shift left to right.
            minLean = network.lean + 0.2;
            maxLean = network.lean + 0.5;
        } else if (network.lean > 0) { // Shift right to left.
            minLean = network.lean - 0.2;
            maxLean = network.lean - 0.5;
        } else {
            console.log("Network '" + network.name + "' has no lean, returning null.");
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(""); // null
            return;
        }

        var responseMsg = "";

        var results = newsNetwork.getNewsNetworksByLean(minLean, maxLean);
        if (results.length == 0) {
            console.log("Network '" + network.name + "' has no near-leaning results [" + minLean + ", " + maxLean + "], returning null.");
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(""); // null
            return;
        }
        var selectedNetwork = results[randomInt(0, results.length - 1)];
        if (selectedNetwork.cache.length > 0) {
            var selectedArticle = selectedNetwork.cache[randomInt(0, results.length - 1)];
            console.log("Selected " + selectedArticle.title + " from network '" + selectedNetwork.name + "' with lean " + selectedNetwork.lean + ".");

            var responseMsg = selectedArticle.url + "\n" + selectedArticle.title + "\n" + selectedArticle.image + "\n";
            if (selectedArticle.network != undefined) {
                responseMsg += selectedArticle.network + "\n";
            }
        } else {
            console.log("Selected network '" + selectedNetwork.name + "' with lean " + selectedNetwork.lean + ".");
            responseMsg = selectedNetwork.domain;
        }

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(responseMsg);
    }).on("error", function(err) {
        console.error(err.stack);
    });
}).listen(9090, "0.0.0.0");

console.log("Server running on port 9090.");
