var http = require("http");

http.createServer(function (req, res) {
    //var body = [];

    /*req.on("data", function (buff) {
        body.push(buff);
    }).on("end", function() {
        body = Buffer.concat(body).toString();

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(JSON.stringify(req.headers) + "\n# POST DATA:\n" + body + "\n");

        body = [];
    }).on("error", function(err) {
        console.error(err.stack);
    });*/

    console.log("Connection established.");

    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Connection established.\n");


}).listen(9090, "0.0.0.0");

console.log("Server running on port 9090.");
