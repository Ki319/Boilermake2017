var newsSites = ["cnn.com", "vox.com", "motherjones.com", "huffingtonpost.com",
		"salon.com", "wnd.com", "breitbart.com", "theblaze.com", "foxnews.com", 
		"washingtontimes.com", "wsj.com", "forbes.com", "realclearpolitics.com",
		"usatoday.com", "abcnews.go.com", "cbsnews.com", "washingtonpost.com",
		"time.com", "nytimes.com", "npr.org", "msnbc.com", "mediamatters.org",
		"thenation.com", "alternet.org", "politico.com", "thehill.com", "rollcall.com"];
		
var newsData = [
	{titleSign : "CNN", endSign : " - CNN", topShift : 125, toTopShift : 50, shiftWait : 90, leftShift : 20, z : 0}, //cnn
	{titleSign : "Vox.com", endSign : " - Vox", topShift : 140, toTopShift : 60, shiftWait : 300, leftShift : 20, z : 0}, //vox
	{titleSign : "Mother Jones", endSign : " | Mother Jones", topShift : 50, toTopShift : 50, shiftWait : 1000, leftShift : 20, z : 0}, //mother jones
	{titleSign : "Breaking News", endSign : " | The Huffington Post", topShift : 130, toTopShift : 70, shiftWait : 400, leftShift : 20, z : 0}, //huffingtonpost
	{titleSign : "Salon", endSign : " - Salon.com", topShift : 70, toTopShift : 70, shiftWait : 1000, leftShift : 20, z : 0}, //salon
	{titleSign : "WND", endSign : "", topShift : 300, toTopShift : 0, shiftWait : 200, leftShift : 20, z : 0}, // wnd
	{titleSign : "Breitbart News Network", endSign : "", topShift : 230, toTopShift : 0, shiftWait : 1300, leftShift : 20, z : 0}, //breitbart
	{titleSign : "TheBlaze", endSign : " - TheBlaze", topShift : 50, toTopShift : 50, shiftWait : 1000, leftShift : 20, z : 1000}, //theblaze
	{titleSign : "Fox News", endSign : " | Fox News", topShift : 150, toTopShift : 0, shiftWait : 500, leftShift : 20, z : 0}, //foxnews
	{titleSign : "Washington Times", endSign : " - Washington Times", topShift : 130, toTopShift : 130, shiftWait : 600, leftShift : 20, z : 1000}, //washington times
	{titleSign : "The Wall Street Journal", endSign : " - WSJ", topShift : 300, toTopShift : 80, shiftWait : 500, leftShift : 20, z : 3}, // wallstreet journal
	{titleSign : "Forbes", endSign : "", topShift : 500, toTopShift : 0, shiftWait : 100, leftShift : 20, z : 10000}, //forbes
	{titleSign : "RealClearPolitics", endSign : " | RealClearPolitics", topShift : 10}, //realclearpolitics
	{titleSign : "USA TODAY", endSign : "", topShift : 120, toTopShift : 50, shiftWait : 300, leftShift : 20, z : 5000}, // usa today
	{titleSign : "ABC News", endSign : " - ABC News", topShift : 50, toTopShift : 50, shiftWait : 600, leftShift : 20, z : 1000038}, //abc news
	{titleSign : "CBS News", endSign : " - CBS News", topShift : 100, toTopShift : 0, shiftWait : 400, leftShift : 10, z : 2147000000}, //cbs news
	{titleSign : "Washington Post", endSign : " - Washington Post", topShift : 75, toTopShift : 0, shiftWait : 600, leftShift : 20, z : 0}, // washingtonpost
	{titleSign : "TIME | ", endSign : " | Time", topShift : 200, toTopShift : 60, shiftWait : 800, leftShift : 20, z : 0}, //time
	{titleSign : "The New York Times", endSign : " - The New York Times", topShift : 130, toTopShift : 50, shiftWait : 500, leftShift : 20, z : 0}, //nytimes
	{titleSign : "NPR", endSign : " : NPR", topShift : 100, toTopShift : 100, shiftWait : 2500, leftShift : 10, z : 0}, //npr
	{titleSign : "MSNBC", endSign : " - NBC News", topShift : 200, toTopShift : 0, shiftWait : 500, leftShift : 20, z : 1000000}, //msnbc
	{titleSign : "Media Matters for America", endSign : "", topShift : 0, toTopShift : 0, shiftWait : 600, leftShift : 10, z : 1000000}, // media matters
	{titleSign : "The Nation", endSign : " | The Nation", topShift : 170, toTopShift : 60, shiftWait : 400, leftShift : 20, z : 0}, //the nation
	{titleSign : "Alternet", endSign : " | Alternet", topShift : 100, toTopShift : 0, shiftWait : 500, leftShift : 20, z : 0}, //alternet
	{titleSign : "Politics, Policy, Politcal News - POLITICO", endSign : " - POLITICO", topShift : 360, toTopShift : 0, shiftWait : 600, leftShift : 20, z : 0},
	{titleSign : "The Hill", endSign : " | TheHill", topShift : 110, toTopShift : 80, shiftWait : 600, leftShift : 20, z : 10000},
	{titleSign : "Roll Call", endSign : "", topShift : 100, toTopShift : 40, shiftWait : 500, leftShift : 20, z : 10}
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
var source;

function getRandomToken() {
	var randomPool = new Uint8Array(32);
	crypto.getRandomValues(randomPool);
	var hex = '';
	for (var i = 0; i < randomPool.length; ++i) {
		hex += randomPool[i].toString(16);
	}
	return hex;
}

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
	context.fillText(source.length < 10 ? source : source.substring(0, 10), canvas.width / 2, canvas.height / 6);
	context.strokeText(source.length < 10 ? source : source.substring(0, 10), canvas.width / 2, canvas.height / 6);
	
	if(img)
	{
		var ratio = img.width / img.height;
	
		var height = canvas.height / 2;
		var width = ratio * height;
		if(width >= canvas.width)
		{
			height = canvas.width / ratio;
			width = canvas.width;
		}
	
		context.drawImage(img, (canvas.width - width) / 2, canvas.height / 5, width, height);	
	}

	
	var currentLine = 0;
	var words = caption.split(" ");
	var text = "";
	
	context.font = "18px Arial Black";
	context.textAlign = 'center';
	context.strokeStyle = 'white';
	context.lineWidth = .5;
	
	for(var i = 0; i < words.length; i++)
	{
		if(text.length + words[i].length > 16 - currentLine * 4)
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
	context.fillText(text, canvas.width / 2, canvas.height * (currentLine ? 4.8 : 4.2) / 5);
	context.strokeText(text, canvas.width / 2, canvas.height * (currentLine ? 4.8 : 4.2) / 5);
	
	context.restore();
}

function scrollCanvas(e)
{
	canvas.style.opacity = "1";
	if(news.topShift - window.scrollY / 2 >= news.toTopShift)
	{
		canvas.style.top = (news.topShift - window.scrollY / 2) + "px";
	}
	else if(window.scrollY - news.topShift * 2 <= news.shiftWait)
	{
		canvas.style.top = news.toTopShift + "px";
	}
	else
	{
		canvas.style.top = (news.toTopShift - (window.scrollY - news.shiftWait - 2 * news.topShift)) + "px";
		canvas.style.opacity = "" + ((150 + (news.toTopShift - (window.scrollY - news.shiftWait - 2 * news.topShift))) / (150 + news.topShift));
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

function loadData(http)
{
	if(http.responseText.length == 0)
		return;
	
	var parsed = http.responseText.split("\n");
	
	//articleLink = "http://vignette1.wikia.nocookie.net/sonnywithachance/images/d/d9/So_Random.png/revision/latest?cb=20110226213549";//parsed[0];
	//caption = "PANDA SLAUGHTERED BY FACE!";//parsed[1];
	articleLink = parsed[0];
	caption = parsed[1];
	source = parsed[2];
	if(parsed[3].length >= 0)
	{
		img = new Image;
		img.src = parsed[3];
		//img.src = "https://vignette1.wikia.nocookie.net/sonnywithachance/images/d/d9/So_Random.png/revision/latest?cb=20110226213549";//parsed[3];
	}
}

function process()
{
	canvas = document.createElement('canvas');
	canvas.id = "a9d9d9djgdj";
	canvas.width = 200;
	canvas.height = 150;
	canvas.style.zIndex   = newsData[index].z;
	canvas.style.position = "fixed";
	canvas.style.left = (window.innerWidth - news.leftShift - canvas.width) + "px";
	scrollCanvas(null);
	canvas.style.cursor = 'pointer';
	canvas.addEventListener('click', clickArticle, false);
	canvas.addEventListener('dblclick', dblClickArticle, false);
	canvas.title = source + " - " + caption;
	
	context = canvas.getContext("2d");
	context.globalAlpha = 0;
	
	document.body.appendChild(canvas);
	
	interval = setInterval(resizeCanvas, 20);
	
	$(window).scroll(scrollCanvas);
}

function wait()
{
	if(caption)
	{
		process();
	}
	else
	{
		setTimeout(wait, 100);
	}
}

var site = location.hostname;
if(site.indexOf(".") < 4)
	site = site.substring(site.indexOf(".") + 1);
index = newsSites.indexOf(site);
if(index > -1 && !document.title.startsWith(newsData[index].titleSign) && !document.title.startsWith("("))
{
	news = newsData[index];
	chrome.storage.sync.get('userid', function(items) 
	{
		$(window).ready(wait);
		var userid = items.userid;
		if (userid)
		{
			userid = getRandomToken();
			chrome.storage.sync.set({'userid': userid});
		}
		var msg = userid + "\n";
		msg += location.href + "\n";
		msg += news.endSign.length == 0 ? document.title : document.title.substring(0, document.title.lastIndexOf(news.endSign));
		chrome.runtime.sendMessage({'msg' : msg}, function(response) {
			alert(response.articleLink + "\n" + response.caption + "\n" + response.source + "\n" + response.img);
		});
		/*httpRequest("http://home.maxocull.tech:9090/", msg, "POST", function(http) {
			loadData(http);
			if(location.hostname === "www.cbsnews.com" || location.hostname === "www.thenation.com")
			{
				process();
			}
		});*/
	});
}