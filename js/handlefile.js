// handlefile.js — Điểm khởi chạy chính, kết nối tất cả các module

import { audioPlayer, toggleBtn, repeatBtn } from './dom.js';
import { repeatMode, setRepeatMode } from './state.js';
import { initProgressBar } from './progressBar.js';
import { initPlayerEvents, changeSong, playSong } from './player.js';
import { initPlaylistEvents } from './playlist.js';
import { updatePlayButtons } from './ui.js';

// --- Nút Play/Pause chính ---
toggleBtn.onclick = () => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
};

document.getElementById('mainPlayBtn').onclick = () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById('mainPlayBtn').innerHTML = '⏸';
    } else {
        audioPlayer.pause();
        document.getElementById('mainPlayBtn').textContent = '▶';
    }
};

// --- Nút Repeat ---
repeatBtn.addEventListener('click', () => {
    setRepeatMode((repeatMode + 1) % 3);
    switch (repeatMode) {
        case 0:
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            repeatBtn.style.color = 'white';
            break;
        case 1:
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            repeatBtn.style.color = 'var(--green)';
            break;
        case 2:
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i><span style="font-size: 10px; position: absolute;">1</span>';
            repeatBtn.style.color = 'var(--green)';
            break;
    }
});

// --- Khởi tạo tất cả module ---
initProgressBar();
initPlayerEvents();
initPlaylistEvents();
