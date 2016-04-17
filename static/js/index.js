// Constants
var YOUTUBE_BASE_URL = 'http://www.youtube.com/embed/<id>?autoplay=1&enablejsapi=1';
var API_KEY = "";	// Set on page load with setApiKey(key)
var SEARCH_API_BASE_URL = 
	"https://www.googleapis.com/youtube/v3/search?part=snippet&q=<q>&key=<key>";
var PLAYER_HEIGHT = '195';
var PLAYER_WIDTH = '320';

// Globals
var player;				// Information about Youtube embedded player
var playlist = [];
var isPlaying = true;	// True if Youtube video is currently playing
var currentIndex = null;	// Playlist index of current song playing
var songCount = 0;		// Keep track of how many songs added, used for songIds	

class SongInfo {
	constructor(name, local, path) {
		this.name_ = name;
		this.local_ = local;
		this.path_ = path;
		songCount += 1;
		this.songId_ = songCount;
	}

	get name() {
		return this.name_;
	}

	get isLocal() {
		return this.local_;
	}

	get path() {
		return this.path_;
	}

	get songId() {
		return this.songId_;
	}
}


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
		height: PLAYER_HEIGHT,
		width: PLAYER_WIDTH,
		videoId: 'M7lc1UVf-VE',
	});
}

// Toggles player between playing and paused
function changeState() {
	button = document.getElementById('playerControl');
	if (isPlaying) {
		player.pauseVideo();
		button.innerHTML = 'Play';
	} else {
		player.playVideo();
		button.innerHTML = 'Pause';
	}
	isPlaying = !isPlaying;
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
	// loadVideo(items[0].id.videoId);
	// addSong(items[0]);
	var id = items[0].id.videoId;
	var title = items[0].snippet.title;
	var song = new SongInfo(title, false, id);
	playlist.push(song);
	var index = document.getElementById('playlist-table').children.length;
	addSongToHTML(song, index);
}

// Load's the specified video (by index)
function loadVideo(index) {
	if (currentIndex != null)
		document.getElementById(currentIndex + "_indicator").style.display = "none";
	var song = playlist[index];

	// Youtube song
	if (!song.local) {
		var url = YOUTUBE_BASE_URL.replace('<id>', song.path);
		player.loadVideoById(song.path);
	}

	currentIndex = index;
	document.getElementById(currentIndex + "_indicator").style.display = "inline";
}

function addSongToHTML(song, index) {
	var tr = document.createElement("tr");
	var td_songName = document.createElement("td");
	var td_indicator = document.createElement("td");
	var a_songName = document.createElement("a");
	var p_indicator = document.createElement("p");

	p_indicator.innerHTML = ">\t";
	p_indicator.style.display = "none"
	p_indicator.id = index + "_indicator";
	p_indicator.className = "indicator";
	td_indicator.appendChild(p_indicator);

	// TODO: Alter for local files
	a_songName.innerHTML = song.name;
	a_songName.href = "javascript:;";
	a_songName.setAttribute("onClick", "loadVideo('" + index + "');");
	td_songName.appendChild(a_songName);

	tr.appendChild(td_indicator);
	tr.appendChild(td_songName);
	document.getElementById('playlist-table').appendChild(tr);
}

function togglePlayerVisibility() {
	var checked = document.getElementById('show_player_checkbox').checked;
	if (checked) {
		document.getElementById('player').style.display = '';
	} else {
		document.getElementById('player').style.display = 'none';
	}
}