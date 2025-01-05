const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const songTitle = document.getElementById('song-title');
const songCover = document.getElementById('song-cover');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const songList = document.getElementById('song-list');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');

let isPlaying = false;
let songIndex = 0;

const songs = [
  { title: 'Millionaire Honey Singh', src: './honey.mp3', cover: './mill.jpg' },
  { title: 'Tere Vaste', src: './vaste.mp3', cover: './vaste.jpg' },
  { title: 'Aankhe', src: './ankh.mp3', cover: './ankh.jpg' }
];

// Load song details
function loadSong(song) {
  songTitle.textContent = song.title;
  audio.src = song.src;
  songCover.src = song.cover;
  
  // Reset time displays when loading a new song
  currentTimeDisplay.textContent = '0:00';
  totalDurationDisplay.textContent = '0:00';
}

// Format time to mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Play and Pause functionality
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.innerHTML = '<span class="fas fa-play"></span>'; // Show play icon
  } else {
    audio.play();
    playPauseBtn.innerHTML = '<span class="fas fa-pause"></span>'; // Show pause icon
  }
  isPlaying = !isPlaying;
}

// Update progress bar and time display
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  
  currentTimeDisplay.textContent = formatTime(currentTime);
  totalDurationDisplay.textContent = formatTime(duration);
}

// Set progress bar click functionality
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Next and previous song logic
function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  if (isPlaying) {
    audio.play();  // Play only if the song is currently playing
  }
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  if (isPlaying) {
    audio.play();  // Play only if the song is currently playing
  }
}

// Open and close sidebar
menuBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});

// Load the song list in the sidebar
function loadSongList() {
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = 'song-item'; // Add class for styling
    li.innerHTML = `<i class="fas fa-music mr-2"></i> ${song.title}`; // Add icon to song title
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      if (isPlaying) {
        audio.play();  // Play only if the user has clicked play
      }
      sidebar.classList.remove('active'); // Close sidebar on song select
    });
    songList.appendChild(li);
  });
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
audio.addEventListener('timeupdate', updateProgress);

// Fix for NaN issue: Update total duration when metadata is loaded
audio.addEventListener('loadedmetadata', () => {
  totalDurationDisplay.textContent = formatTime(audio.duration);
});

progressContainer.addEventListener('click', setProgress);
document.getElementById('next').addEventListener('click', nextSong);
document.getElementById('prev').addEventListener('click', prevSong);

// Load first song and song list
loadSong(songs[songIndex]);
loadSongList();
