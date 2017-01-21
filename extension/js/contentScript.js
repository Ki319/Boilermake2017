var newsSites = ["cnn", "vox", "motherjones", "huffingtonpost",
		"salon", "wnd", "breitbart", "theblaze", "foxnews", 
		"washingtontimes", "wsj", "forbes", "realclearpolitics",
		"usatoday", "abcnews", "cbsnews", "washingtonpost",
		"time", "nytimes", "npr", "msnbc", "mediamatters",
		"thenation", "alternet", "politico", "thehill", "rollcall"];
var canvas;
var context;
var interval;

var img;
var articleLink;
var caption;

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

function resizeCanvas()
{
	context.globalAlpha = context.globalAlpha + (1 - context.globalAlpha) / 10 + .001;
	if(context.globalAlpha >= 1)
	{
		context.globalAlpha = 1;
		clearInterval(interval);
	}
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.font = "28px Arial Black";
	context.fillStyle = 'black';
	context.textAlign = 'center';
	context.strokeStyle = 'white';
	context.lineWidth = .75;
	context.fillText("CNN", canvas.width / 2, canvas.height / 6);
	context.strokeText("CNN", canvas.width / 2, canvas.height / 6);
	
	var ratio = img.width / img.height;
	
	var height = canvas.height * 7 / 10;
	var width = ratio * height;
	
	context.drawImage(img, (canvas.width - width) / 2, canvas.height / 5, width, height);
}

function scrollCanvas(e)
{
	if(50 - window.scrollY / 2 >= 0)
	{
		canvas.style.top = (50 - window.scrollY / 2) + "px";
	}
	else if(50 - window.scrollY / 2 >= -50)
	{
		canvas.style.top = 0 + "px";
	}
	else
	{
		canvas.style.top = (50 - (window.scrollY - 150)) + "px";
	}
}

function process(http)
{
	var parsed = http.responseText.split("\n");
	
	img = new Image;
	
	img.src = parsed[0];
	articleLink = parsed[1];
	caption = parsed[2];
	
	canvas = document.createElement('canvas');
	canvas.id = "a9d9d9djgdj";
	canvas.width = 200;
	canvas.height = 150;
	canvas.style.zIndex   = 999999;
	canvas.style.position = "fixed";
	canvas.style.left = (window.innerWidth - 30 - canvas.width) + "px";
	canvas.style.top = (50) + "px";
	
	context = canvas.getContext("2d");
	context.globalAlpha = 0;
	
	document.body.appendChild(canvas);
	
	interval = setInterval(resizeCanvas, 20);
	
	$(window).scroll(scrollCanvas);
}

$(document).ready(function(e)
{
	var index = newsSites.indexOf(location.hostname);
	if(index == -1)
	{
		httpRequest("http://home.maxocull.tech:9090/", location.url, "POST", process);
	}
});
