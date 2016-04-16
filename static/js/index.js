var YOUTUBE_BASE_URL = 'http://www.youtube.com/embed/<id>?autoplay=0';
// var API_KEY = document.getElementById('api_key').innerHTML;
var API_KEY = "";
var SEARCH_API_BASE_URL = 
	"https://www.googleapis.com/youtube/v3/search?part=snippet&q=<q>&key=<key>";

function setApiKey(key) {
	API_KEY = key;
}

function search() {
	var query = document.getElementById('search_query').value;
	var url = SEARCH_API_BASE_URL.replace('<q>', query);
	url = url.replace('<key>', API_KEY);
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.setRequestHeader(
		"Content-type",
		"application/json"
	);
	req.send(null);
	var items = JSON.parse(req.responseText)['items'];

	loadVideo(items[0].id.videoId);
}

function getURL(id) {
	return YOUTUBE_BASE_URL.replace('<id>', id);
}

function loadVideo(id) {
	var url = getURL(id);
	document.getElementById('video_player').src = url;
	document.getElementById('video_player').style.display = "";
}