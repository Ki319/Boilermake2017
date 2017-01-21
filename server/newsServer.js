var http = require("http");

http.createServer(function (req, res) {
    var body = [];

    req.on("data", function (buff) {
        body.push(buff);
    }).on("end", function() {
        body = Buffer.concat(body).toString();

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(JSON.stringify(req.headers) + "\n# POST DATA:\n" + body + "\n");

        body = [];
    }).on("error", function(err) {
        console.error(err.stack);
    });

}).listen(8080, "127.0.0.1");

console.log("Server running on port 8080.");
