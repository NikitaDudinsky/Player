const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume span"),
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause span"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
wrapper = container.querySelector(".wrapper");
let timer;
var doc = window.document;
var docEl = document.getElementById("container");
var docVi = document.querySelector("#video");
  
var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;

var userDeviceArray = [
    {device: 1, platform: /Android/},
    {device: 2, platform: /iPhone/},
    {device: 3, platform: /iPad/},
    {device: 4, platform: /Symbian/},
    {device: 5, platform: /Windows Phone/},
    {device: 6, platform: /Tablet OS/},
    {device: 7, platform: /Linux/},
    {device: 8, platform: /Windows NT/},
    {device: 9, platform: /Macintosh/}
];

var platform = navigator.userAgent;

function getPlatform() {
    for (var i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(platform)) {
            return userDeviceArray[i].device;
        }
    }
    return 'Неизвестная платформа!' + platform;
}

if (getPlatform() == 8){
	console.log("saaaaaaaaas")
}

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("volume-icon")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("mute-icon", "volume-icon");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("volume-icon", "mute-icon");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("volume-icon", "mute-icon");
    }
    volumeBtn.classList.replace("mute-icon", "volume-icon");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

if (getPlatform() == 2){
  docVi.setAttribute("controls", "");
  wrapper.classList.add("hidden");
  container.classList.add("hidden");
}

fullScreenBtn.addEventListener("click", () => {
  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);  
}
});

document.addEventListener("fullscreenchange", (event) => {
	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
	
	fullScreenBtn.classList.replace("fa-compress", "fa-expand");
	container.classList.remove("fullscreen");
	mainVideo.classList.remove("fullscreen");
	
  }
  else {
	fullScreenBtn.classList.replace("fa-expand", "fa-compress");
	container.classList.add("fullscreen");
	mainVideo.classList.add("fullscreen");
  }
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("play-icon", "pause-icon"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("pause-icon", "play-icon"));
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));