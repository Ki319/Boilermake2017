var newsSites = ["cnn.com", "vox.com", "motherjones.com", "huffingtonpost.com",
		"salon.com", "wnd.com", "breitbart.com", "theblaze.com", "foxnews.com", 
		"washingtontimes.com", "wsj.com", "forbes.com", "realclearpolitics.com",
		"usatoday.com", "abcnews.go.com", "cbsnews.com", "washingtonpost.com",
		"time.com", "nytimes.com", "npr.org", "msnbc.com", "mediamatters.org",
		"thenation.com", "alternet.org", "politico.com", "thehill.com", "rollcall.com",
		"drudgereport.com"];
		
var newsData = [
	{topShift : 50, toTopShift : 50, shiftWait : 150, leftShift : 20}, //cnn
	{topShift : 50, toTopShift : 0, shiftWait : 250} //vox
];

var news;

var leftShift = [];

var canvas;
var context;
var interval = null;
var index;

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
		alert('done')
	}
	
	drawCanvas();
}

function drawCanvas()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.save();
	
	context.shadowColor = 'rgba(0,0,0,.1)';
	context.shadowBlur = 5;
	context.shadowOffsetX = 5;
	context.shadowOffsetY = 5;
	
	context.font = "28px Arial Black";
	context.fillStyle = 'black';
	context.textAlign = 'center';
	context.strokeStyle = 'white';
	context.lineWidth = .75;
	context.fillText("CNN", canvas.width / 2, canvas.height / 6);
	context.strokeText("CNN", canvas.width / 2, canvas.height / 6);
	
	var ratio = img.width / img.height;
	
	var height = canvas.height / 2;
	var width = ratio * height;
	if(width >= canvas.width)
	{
		height = canvas.width / ratio;
		width = canvas.width;
	}
	
	context.drawImage(img, (canvas.width - width) / 2, canvas.height / 5, width, height);
	
	var currentLine = 0;
	var words = caption.split(" ");
	var text = "";
	
	context.font = "18px Arial Black";
	context.textAlign = 'center';
	context.strokeStyle = 'white';
	context.lineWidth = .5;
	
	for(var i = 0; i < words.length; i++)
	{
		if(text.length + words[i].length > 20)
		{
			if(currentLine == 0)
			{
				currentLine++;
				context.fillText(text, canvas.width / 2, canvas.height * 4.2 / 5);
				context.strokeText(text, canvas.width / 2, canvas.height * 4.2 / 5);
				text = words[i] + " ";
			}
			else
			{
				text += "...";
				break;
			}
		}
		else
		{
			text += words[i] + " ";
		}
	}
	context.fillText(text, canvas.width / 2, canvas.height * (currentLine ? 5 : 4.2) / 5);
	context.strokeText(text, canvas.width / 2, canvas.height * (currentLine ? 5 : 4.2) / 5);
	
	context.restore();
}

function scrollCanvas(e)
{
	if(news.topShift - window.scrollY / 2 >= news.toTopShift)
	{
		canvas.style.top = (news.topShift - window.scrollY / 2) + "px";
	}
	else if(news.topShift - window.scrollY / 2 >= -(news.shiftWait))
	{
		canvas.style.top = news.toTopShift + "px";
	}
	else
	{
		canvas.style.top = (news.toTopShift - (window.scrollY - 2 * (news.shiftWait + news.toTopShift))) + "px";
	}
}

function clickArticle(e)
{
	setTimeout(function(e) {
		window.open(articleLink);
		if(interval != null)
			clearInterval(interval);
		canvas.parentNode.removeChild(canvas);
	}, 400);
}

function dblClickArticle(e)
{
	window.open(articleLink,"_self")
}

function process(http)
{
	if(http.responseText.length == 0)
		return;
	
	var parsed = http.responseText.split("\n");
	
	img = new Image;
	
	img.src = parsed[0];
	articleLink = parsed[1];
	caption = parsed[2];
	
	canvas = document.createElement('canvas');
	canvas.id = "a9d9d9djgdj";
	canvas.width = 200;
	canvas.height = 150;
	canvas.style.zIndex   = 0;
	canvas.style.position = "fixed";
	canvas.style.left = (window.innerWidth - news.leftShift - canvas.width) + "px";
	canvas.style.top = news.topShift + "px";
	canvas.style.cursor = 'pointer';
	canvas.addEventListener('click', clickArticle, false);
	canvas.addEventListener('dblclick', dblClickArticle, false);
	
	context = canvas.getContext("2d");
	context.globalAlpha = 0;
	
	document.body.appendChild(canvas);
	
	interval = setInterval(resizeCanvas, 20);
	
	$(window).scroll(scrollCanvas);
}

$(document).ready(function(e)
{
	var site = location.hostname;
	if(site.indexOf(".") < 5)
		site = site.substring(site.indexOf(".") + 1);
	index = newsSites.indexOf(site);
	if(index > -1)
	{
		news = newsData[index];
		httpRequest("http://home.maxocull.tech:9090/", location.url, "POST", process);
	}
});
