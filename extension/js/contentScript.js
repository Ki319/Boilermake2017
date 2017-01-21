var newsSites = [];
var canvas;
var context;
var interval;

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
	r.send();
	return r;
}

function resizeCanvas()
{
	canvas.width += 2;
	canvas.height += 2;
	canvas.style.left -= 2;
	if(canvas.width >= 100)
	{
		clearInterval(interval);
	}
}

function process(http)
{
	canvas = document.createElement('canvas');
	canvas.id     = "CursorLayer";
	canvas.width  = 1;
	canvas.height = 1;
	canvas.style.zIndex   = 100;
	canvas.style.position = "absolute";
	canvas.style.border   = "1px solid";
	canvas.style.left = window.innerWidth - 10;
	canvas.style.top = 10;
	canvas.
	document.body.appendChild(canvas);
	
	interval = setInterval(resizeCanvas, 20);
	//alert(http.status);
	/*chrome.runtime.sendMessage({
		status : "display",
		data : http.responseText
	});*/
}

var site = location.hostname;

var hostname = site;
	
var index = newsSites.indexOf(hostname);
if(index == -1)
{
	//alert("Sent: " + site);
	httpRequest("http://10.186.148.35:9090/", "test", "POST", process);
}
