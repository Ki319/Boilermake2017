var http = require("http");
var mongodb = require("./mongodb.js");
var newsNetwork = require("./newsNetwork.js");
var url = require("url");
var scraper = require("./scraper.js");

newsNetwork.getCache("thenation", function(cache) {
    console.log("ITS DONE!");
    console.log(cache[0]);
});

function randomInt(min, max) { // [min, max] not [min, max)
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addHistory(db, user, lean)
{
	var historyObj = {"lean": lean, "timestamp": Math.round(Date.now() / 60000)};

    //console.log(user);
    //console.log(user.history);

    var set = {$push : {"history": historyObj} };
    mongodb.update(db, "users", {"userid": user.userid}, set, function(result) {
        // console.log(result);
    });
}

function getUser(uuid, lean, callback)
{
	var user = null;
	mongodb.MongoClient.connect('mongodb://localhost:27017/news', function(err, db)
	{
        if (err) {
            console.log(err);
        }

		console.log("Connected to MongoDB");
        //console.log(db.collection("users"));
        mongodb.find(db, "users", {'userid' : uuid}, function(result) {
			if(result.length == 0)
			{
                mongodb.insert(db, "users", {'userid' : uuid, history: []}, function(result) {
				//db.users.insert({"userid" : uuid, "history" : []}, function(result) {
                    //console.log(result);

					console.log("Successfully created a new user.");
                    user = result.ops[0];
                    addHistory(db, user, lean);
                    db.close();
                    callback(user);
				});
			}
			else
			{
				user = result[0];
				addHistory(db, user, lean);
				db.close();
				callback(user);
			}

        });
	});
}

/*function findArticle(network, lean, callback) {
	findNewNetwork(network, lean, function(newNetwork) {
        callback(newNetwork.cache[randomInt(0, newNetwork.cache.length - 1)]);
	});
}*/

function findNewNetwork(network, lean, callback) {
    var newLean = lean - (lean / Math.abs(lean)) * (randomInt(30, 100)) / 400;
    console.log("lean " + newLean);
    newsNetwork.getNewsNetworkByLean(newLean, function(newNetwork) {
        callback(newNetwork);
    });
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
        var title = data[2];
        console.log(body, uuid, link, title);
        console.log("Connection from user: " + uuid);
        var network = newsNetwork.getNewsNetworkByDomain(link.hostname);
        if (network == undefined) {
            console.error("Network could not be determined from '" + link + "'.");
        }

		//scraper.scrape(network, title, function(scrapeData) {
			getUser(uuid, network.lean, function(user) {
				var time = Math.round(Date.now() / 60000);
				var sum = 0;
				var weights = 0;
				var weight = 0;
				var cleanList = [];
				for(var i = 0; i < user.history.length; i++)
				{
					var obj = user.history[i];
					weight = Math.pow(Math.E, (obj.timestamp - time) / 1);
					if(weight < .001)
					{
						cleanList.push(obj);
					}
					sum += obj.lean * weight;
					weights += weight;
				}
				sum /= weights;

                findNewNetwork(network, sum, function(newNet) {
                    scraper.scrape(newNet, title, function(scrapeData) {
                        var responseMsg = "";
                        if (!scrapeData) {
                            console.log("Resorting to RSS.");
                            newsNetwork.getCache(newNet.name, function(arr) {
                                article = arr[randomInt(0, arr.length - 1)];
                                console.log(article);
                                if (article != null) {
                                    responseMsg = article.url + "\n";
            						responseMsg += article.title + "\n";
                                    responseMsg += newNet.realname + "\n";
            						responseMsg += article.image;
                                }

                                console.log("POST data:", responseMsg);
                                res.writeHead(200, {"Content_Type" : "text/plain"});
                                res.end(responseMsg);
                            });
                        } else {
                            responseMsg = scrapeData.url + "\n";
                            responseMsg += scrapeData.title + "\n";
                            responseMsg += newNet.realname + "\n";
                            if (scrapeData.img != null) {
                                responseMsg += scrapeData.img;
                            } else {
                                responseMsg += "";
                            }
                            console.log("POST data:", responseMsg);
                            res.writeHead(200, {"Content_Type" : "text/plain"});
                            res.end(responseMsg);
                        }
                    });
                });
			});
		//});
    }).on("error", function(err) {
        console.error(err.stack);
    });
}).listen(9090, "0.0.0.0");

console.log("Server running on port 9090.");
