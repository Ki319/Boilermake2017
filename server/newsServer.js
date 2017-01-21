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

function addHistory(user, lean)
{
	var historyObj = {"lean": lean, "timestamp": Math.round(Date.now() / 60000)};
	user.history.push(historyObj);
	user.history.insert(historyObj)
}

function getUser(uuid, lean, callback)
{
	var user = null;
	mongodb.MongoClient.connect('mongodb://localhost:27016/news', function(err, db)
	{
		console.log("Connected to MongoDB");

        db.users.find({'userid' : uuid}, function(result) {
			if(result.length == 0)
			{
				db.users.insert({"userid" : uuid, "history" : []}, function(result) {
					console.log("SUCCESFULLY CREATE NEW USER");
					user = result[0];
					addHistory(user, lean);
					db.close();
					callback(user);
				});
			}
			else
			{
				user = result[0];
				addHistory(user, lean);
				db.close();
				callback(user);
			}

        });
	});
}

function findNetwork(lean, callback)
{
	
}

http.createServer(function (req, res) {
    var body = [];

    console.log("Connection established.");

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

        data = body.split("\n");
        var uuid = data[0];
        var link = url.parse(data[1]);
        var network = newsNetwork.getNewsNetworkByDomain(link.hostname);

		var user = getUser(uuid, network.lean, function(user) {
			var time = Math.round(Date.now() / 60000);
			var sum = 0;
			var weights = 0;
			var weight = 0;
			for(var obj in user.history)
			{
				weight = Math.pow(Math.E, (obj.timestamp - time) / 1);
				sum += obj.lean * weight;
				weights += weight;
			}
			sum /= weights;
			
			findArticle(network, sum, function(article) {
				var responseMsg = "";
				res.writeHead(200, {"Content_Type" : "text/plain"});
				if(article != null)
				{
					responseMsg = article.url + "\n";
					responseMsg += article.caption + "\n";
					responseMsg += article.imageUrl;
				}
				res.end(responseMsg);
			});
			
		});
    }).on("error", function(err) {
        console.error(err.stack);
    });
}).listen(9090, "0.0.0.0");

console.log("Server running on port 9090.");
