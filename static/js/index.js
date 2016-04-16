var YOUTUBE_BASE_URL = 'http://www.youtube.com/embed/<id>?autoplay=1&enablejsapi=1';
var API_KEY = "";
var SEARCH_API_BASE_URL = 
	"https://www.googleapis.com/youtube/v3/search?part=snippet&q=<q>&key=<key>";
var player;
var playing = true;


// Sets the Youtube list api key, necessary to send search requests
function setApiKey(key) {
	API_KEY = key;
}

// Loads Youtube's Iframe Api
function loadYoutubeIFrame() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Called when Youtube iframe api is finished loading, creates player
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'M7lc1UVf-VE',
	});
}

// Toggles player between playing and paused
function changeState() {
	button = document.getElementById('playerControl');
	if (playing) {
		player.pauseVideo();
		button.innerHTML = 'Play';
	} else {
		player.playVideo();
		button.innerHTML = 'Pause';
	}
	playing = !playing;
}

// Sends search query over Youtube's API. Load's first result
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

// Load's the specified video (by id)
function loadVideo(id) {
	var url = YOUTUBE_BASE_URL.replace('<id>', id);
	player.loadVideoById(id);
}