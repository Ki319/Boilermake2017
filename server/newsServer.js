var http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello world!\n");
}).listen(9090, "127.0.0.1");

console.log("Server running on port 9090.");
