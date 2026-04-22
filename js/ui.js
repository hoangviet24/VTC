// ui.js — Cập nhật giao diện người dùng

import { audioPlayer, toggleBtn, playListCounter, totalSong } from './dom.js';
import { playList, currentPlayingSong } from './state.js';

export function updatePlayButtons() {
    const isPaused = audioPlayer.paused;
    const icon = isPaused ? '▶' : '⏸';
    const text = isPaused ? 'Play' : 'Pause';

    if (toggleBtn) toggleBtn.textContent = text;

    const mainPlayBtn = document.getElementById('mainPlayBtn');
    if (mainPlayBtn) mainPlayBtn.textContent = icon;

    updateListButtons();
}

export function updateListButtons() {
    const allBtns = document.querySelectorAll('.btn-play-song');
    allBtns.forEach(btn => {
        const rowName = btn.closest('.song-item').querySelector('.song-name').textContent;
        if (currentPlayingSong && rowName === currentPlayingSong.name) {
            btn.textContent = audioPlayer.paused ? 'Play' : 'Pause';
            btn.style.background = audioPlayer.paused ? 'var(--green)' : '#ff4444';
        } else {
            btn.textContent = 'Play';
            btn.style.background = 'var(--green)';
        }
    });
}

export function updateStats() {
    const total = playList.length;
    const favorites = playList.filter(s => s.isFavorite).length;

    if (playListCounter) playListCounter.innerText = `${total} bài hát`;
    if (totalSong) totalSong.innerText = total;

    const favDisplay = document.getElementById('totalFavorites');
    if (favDisplay) favDisplay.innerText = favorites;
}
