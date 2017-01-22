function httpRequest(address, data, reqType, asyncProc) 
{
	var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	if (asyncProc) 
	{
		r.onreadystatechange = function () { 
			if (this.readyState == 4) asyncProc(this); 
		};
	}
	else
	{
		r.timeout = 4000;  // Reduce default 2mn-like timeout to 4 s if synchronous
	}
	r.open(reqType, address, !(!asyncProc));
	r.send(data);
	return r;
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	httpResponse("http://home.maxocull.tech:9090/", message.msg, "POST", function(http) {
		var parsed = http.responseText.split("\n");
		var article = parsed[0];
		var caption = parsed[1];
		var source = parsed[2];
		var img = null;
		if(parsed[3].length > 0)
		{
			img = new Image;
			img.src = parsed[3];
		}
		sendResponse({articleLink : article, caption : caption, source : source, img : img});
	});
});