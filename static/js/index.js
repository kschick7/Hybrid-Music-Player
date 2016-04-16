var YOUTUBE_BASE_URL = 'http://www.youtube.com/embed/<id>?autoplay=1&enablejsapi=1';
// var API_KEY = document.getElementById('api_key').innerHTML;
var API_KEY = "";
var SEARCH_API_BASE_URL = 
	"https://www.googleapis.com/youtube/v3/search?part=snippet&q=<q>&key=<key>";
var player;
var playing = true;

function setApiKey(key) {
	API_KEY = key;
}

function createPlayer() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'M7lc1UVf-VE',
		// events: {
		// 	'onReady': onPlayerReady,
		// 	'onStateChange': onPlayerStateChange
		// }
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(stopVideo, 6000);
		done = true;
	}
}
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
	player.loadVideoById(id);
}

// function pauseVideo() {
// 	alert(document.getElementById('player_iframe').contentWindow);
// }

// function toggleVideo(state) {
//	 // if state == 'hide', hide. Else: show video
//	 var div = document.getElementById("video_player");
//	 var iframe = document.getElementById("player_iframe").contentWindow;
//	 div.style.display = state == 'hide' ? 'none' : '';
//	 func = state == 'hide' ? 'pauseVideo' : 'playVideo';
//	 iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
// }