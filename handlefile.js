import { randomCovers } from './listImage.js';
const fileInput = document.getElementById('fileInput');
const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');
const playListCounter = document.getElementById('playListCount');
const totalSong = document.getElementById('totalSong');
const currentSongName = document.getElementById('currentSongName');
const bottomCurrentSong = document.getElementById('bottomCurrentSong');
const toggleBtn = document.getElementById('togglePlayBtn');
const coverImg = document.querySelector('.fake-cover img');
let playList = [];

fileInput.addEventListener('change',function(e) {
    const files = e.target.files;
    if(files.length > 0) {
        const emptyText = document.querySelector('.empty-text');
        if(emptyText) emptyText.remove();

        Array.from(files).forEach(file => {
            const songData = {
                name: file.name,
                url: URL.createObjectURL(file),
                cover: getRamdomCover()
            };
            playList.push(songData);
            addSongToUI(songData);
        });
        updateStats();
    }
});

toggleBtn.addEventListener('click', function() {
    if(playList.length === 0) return;
    if(audioPlayer.paused) {
        audioPlayer.play();
        toggleBtn.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        toggleBtn.textContent = 'Play';
    }
});

function addSongToUI(song) {
    audioPlayer.src = song.url;
    audioPlayer.play();
    currentSongName.textContent = song.name;
    bottomCurrentSong.textContent = song.name;
    coverImg.src = song.cover;    
    if(toggleBtn) toggleBtn.textContent = 'Pause';
}

function updateStats() {
    const count = playList.length;
    console.log("Biến playListCounter hiện tại là:", playListCounter);
    playListCounter.innerText = `${count} bài hát`;
    totalSong.innerText = count;
}

function getRamdomCover(){
    const randomIndex = Math.floor(Math.random() * randomCovers.length);
    return randomCovers[randomIndex];
}