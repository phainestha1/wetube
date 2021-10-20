const video = document.querySelector("video");
const playBtn = document.getElementById("play_icon");
const muteBtn = document.getElementById("mute_icon");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volumeRange");
const timeline = document.getElementById("timeLine");
const fullscreenBtn = document.getElementById("fullscreen_icon");
const videoContainer = document.querySelector(".video_container");
const videoControls = document.querySelector(".video_controls");

let controlsTimeout = null;
let controlsMovementTimeOut = null;
let volumeValue = 0.3;
if (video) {
  video.volume = volumeValue;
  video.play();
  playBtn.className = "fas fa-pause";
}

// Functions
const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.className = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.className = video.muted ? "fas fa-volume-up" : "fas fa-volume-mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = (event) => {
  const { value } = event.target;
  if (video.muted) {
    video.muted = false;
    muteBtn.className = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (sec) => new Date(sec * 1000).toISOString().substr(14, 5);
const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
const handleTimelineChange = (event) => {
  const { value } = event.target;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenBtn.className = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtn.className = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.add("hidden");
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeOut) {
    clearTimeout(controlsMovementTimeOut);
    controlsMovementTimeOut = null;
  }
  videoControls.classList.remove("hidden");
  controlsMovementTimeOut = setTimeout(hideControls, 3500);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "post",
  });
};

// Event Listeners
if (video) {
  video.addEventListener("click", handlePlayBtn);
  video.addEventListener("loadedmetadata", handleLoadedMetaData);
  video.addEventListener("timeupdate", handleTimeUpdate);
  video.addEventListener("ended", handleEnded);
  playBtn.addEventListener("click", handlePlayBtn);
  muteBtn.addEventListener("click", handleMuteBtn);
  volumeRange.addEventListener("input", handleVolumeChange);
  timeline.addEventListener("input", handleTimelineChange);
  fullscreenBtn.addEventListener("click", handleFullscreen);
  videoContainer.addEventListener("mousemove", handleMouseMove);
  videoContainer.addEventListener("mouseleave", handleMouseLeave);
}
