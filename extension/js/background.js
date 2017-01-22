chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	console.log(request);
    if(request.status == "http")
	{
		httpsRequest("https://home.maxocull.tech:9090/", request.msg, "POST", function(http)
		{
			loadData(http);
		});
		callback(articleLink, caption, source, img);
	}
});