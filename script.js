const songs = [
    { title: "أقارب",    artist: "Wegz",          image: "images/img1.png",   audio: "audio/wegz.mp3" },
    { title: "بطل عالم", artist: "Marwan Moussa",  image: "images/mousa.webp", audio: "audio/mousa.mp3" },
    { title: "مش فارق",  artist: "Ramy Sabry",     image: "images/mosh.webp",  audio: "audio/mosh.mp3" },
    { title: "اه لو لعبت يزهر",  artist: "Sheeba",        image: "images/sheba.webp", audio: "audio/shebaa.mp3" },
];

const audio         = document.getElementById("audio");
const albumArt      = document.getElementById("albumArt");
const songTitle     = document.getElementById("songTitle");
const songArtist    = document.getElementById("songArtist");
const currentTime   = document.getElementById("currentTime");
const totalTime     = document.getElementById("totalTime");
const progressRange = document.getElementById("progressRange");
const volumeRange   = document.getElementById("volumeRange");
const volVal        = document.getElementById("volVal");
const muteBtn       = document.getElementById("muteBtn");
const playPauseBtn  = document.getElementById("playPauseBtn");
const playIcon      = document.getElementById("playIcon");
const forwardBtn    = document.getElementById("forwardBtn");
const backwardBtn   = document.getElementById("backwardBtn");
const stopBtn       = document.getElementById("stopBtn");
const songList      = document.getElementById("songList");
const searchInput   = document.getElementById("searchInput");

let currentIndex = 0;
let isPlaying = false;

function fmt(s) {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return (m < 10 ? "0" + m : m) + ":" + (sec < 10 ? "0" + sec : sec);
}

function loadSong(index, play = false) {
    currentIndex = index;
    const s = songs[index];
    audio.src = s.audio;
    albumArt.src = s.image;
    songTitle.textContent = s.title;
    songArtist.textContent = s.artist;
    progressRange.value = 0;
    currentTime.textContent = "00:00";
    totalTime.textContent = "00:00";
    renderList();
    if (play) { audio.play(); setPlaying(true); }
    else { setPlaying(false); }
}

function setPlaying(val) {
    isPlaying = val;
    playIcon.className = val ? "fa-solid fa-pause" : "fa-solid fa-play";
    albumArt.className = val ? "album-art playing" : "album-art";
    document.querySelectorAll(".song-item").forEach((el, i) => {
        el.classList.toggle("active", songs.indexOf(songs.find((_, idx) => idx === currentIndex)) === currentIndex);
    });
    renderList();
}

function renderList(filter = "") {
    songList.innerHTML = "";
    const filtered = songs.filter(s =>
        s.title.toLowerCase().includes(filter.toLowerCase()) ||
        s.artist.toLowerCase().includes(filter.toLowerCase())
    );
    if (!filtered.length) {
        songList.innerHTML = '<div class="no-results">No songs found 🎵</div>';
        return;
    }
    filtered.forEach((s) => {
        const realIndex = songs.indexOf(s);
        const div = document.createElement("div");
        div.className = "song-item" + (realIndex === currentIndex ? " active" : "");
        div.innerHTML = `
            <img class="song-item-img" src="${s.image}" alt="">
            <div class="song-item-info">
                <div class="song-item-title">${s.title}</div>
                <div class="song-item-artist">${s.artist}</div>
            </div>
            <div class="playing-wave">
                <span></span><span></span><span></span><span></span>
            </div>
            <div class="song-item-dur">—</div>
        `;
        div.addEventListener("click", () => loadSong(realIndex, true));
        songList.appendChild(div);
    });
}

// Events
playPauseBtn.addEventListener("click", () => {
    if (isPlaying) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
});

stopBtn.addEventListener("click", () => {
    audio.pause(); audio.currentTime = 0; setPlaying(false);
});

forwardBtn.addEventListener("click", () => loadSong((currentIndex + 1) % songs.length, isPlaying));
backwardBtn.addEventListener("click", () => loadSong((songs.length + currentIndex - 1) % songs.length, isPlaying));

audio.addEventListener("ended", () => loadSong((currentIndex + 1) % songs.length, true));

audio.addEventListener("loadedmetadata", () => {
    totalTime.textContent = fmt(audio.duration);
    progressRange.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    currentTime.textContent = fmt(audio.currentTime);
    progressRange.value = audio.currentTime;
});

progressRange.addEventListener("input", () => { audio.currentTime = progressRange.value; });

volumeRange.addEventListener("input", () => {
    audio.volume = volumeRange.value;
    volVal.textContent = Math.floor(audio.volume * 100);
    muteBtn.className = audio.volume == 0 ? "fa-solid fa-volume-xmark"
                      : audio.volume < 0.5 ? "fa-solid fa-volume-low"
                      : "fa-solid fa-volume-high";
});

muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.className = audio.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
    volumeRange.value = audio.muted ? 0 : audio.volume;
    volVal.textContent = audio.muted ? 0 : Math.floor(audio.volume * 100);
});

searchInput.addEventListener("input", () => renderList(searchInput.value));

// Init
loadSong(0);