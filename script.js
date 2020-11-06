// Dynamic Elements
const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-button');
const bigPlayBtn = document.getElementById('play-button-large');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const speed = document.querySelector('.player-speed');

// Play & Pause ----------------------------------- //

function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title','Play');
    bigPlayBtn.style.opacity = 1;

}

function togglePlay() {
    if(video.paused){
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title','Pause');
        bigPlayBtn.style.opacity = 0;
    }else{
        video.pause();
        showPlayIcon();
    }
}

// On Video End Show Play Icon
video.addEventListener('ended',showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
    // Calculate display for duration
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
}

// Update Progress Bar
function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.innerText = `${displayTime(video.currentTime)} /`;
    duration.innerText = `${displayTime(video.duration)}`;
}

//Sets progress based on click on bar
function seekProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;
let muted = false;

function setVolumeIcon(vol) {
    volumeIcon.className = '';
    if (muted === false) {
        if (vol > 0.7) {
            volumeIcon.classList.add('fas','fa-volume-up');
        } else if (vol < 0.7 && vol > 0) {
            volumeIcon.classList.add('fas','fa-volume-down');
        } else if (vol === 0) {
            volumeIcon.classList.add('fas','fa-volume-off');
        }
        volumeIcon.setAttribute('title','Mute');
    }else {
        volumeIcon.classList.add('fas','fa-volume-mute');
        volumeIcon.setAttribute('title','Unmute')
    }
}

// Volume Bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    
    //Rounding volume up or down
    if (volume < 0.1) {
        volume = 0;
    }
    if(volume > 0.9){
        volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;

    // automatically unmutes if the user picks a new volume
    if (volume > 0.1){
        muted = false;
    }
    
    setVolumeIcon(volume);

    lastVolume = volume;
}

// mute/unmute
function toggleMute() {
    if (muted === false){
        if(video.volume) {
            lastVolume = video.volume;
            video.volume = 0;
            volumeBar.style.width = 0;
        }
        muted = true;

    }else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        muted = false;
    }
    
    setVolumeIcon(video.volume);
}






// Change Playback Speed -------------------- //

function changeSpeed() {
    video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

//   video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }

//   video.classList.remove('video-fullscreen');
}

let fullscreen = false;

//Toggle fullscreen
function toggleFullScreen(){
    !fullscreen ? openFullscreen(player) : closeFullscreen();
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
bigPlayBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress); // setInterval(updateProgress, 1000) for longer videos so it only fires every second
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', seekProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullScreen);

document.addEventListener('fullscreenchange', (event) => {
  if(document.fullscreenElement != null){
    fullscreen = true;
  }else{
      fullscreen = false;
  }
});