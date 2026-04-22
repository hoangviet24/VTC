// player.js — Logic phát nhạc, chuyển bài, lặp lại

import { audioPlayer, toggleBtn, currentSongName, bottomCurrentSong,coverImg } from './dom.js';
import {
    playList, currentPlayingSong, isShowingFavorites, repeatMode,
    setCurrentPlayingSong
} from './state.js';
import { updateListButtons, updatePlayButtons } from './ui.js';

export function getActiveList() {
    return isShowingFavorites ? playList.filter(s => s.isFavorite) : playList;
}

export function playSong(song) {
    if (currentPlayingSong !== song) {
        setCurrentPlayingSong(song);
        audioPlayer.src = song.url;
        audioPlayer.play();
        coverImg.src = song.cover;

        const songNameEl = document.getElementById('bottomCurrentSong');
        const songNameCloneEl = document.getElementById('bottomCurrentSongClone');

        if (songNameEl && songNameCloneEl) {
            songNameEl.textContent = song.name;
            songNameCloneEl.textContent = song.name;

            const wrapper = document.querySelector('.marquee-wrapper');
            if (wrapper) {
                wrapper.style.animation = 'none';
                wrapper.offsetHeight; // trigger reflow
                wrapper.style.animation = 'seamlessLoop 10s linear infinite';
                wrapper.style.animationDelay = '3s';
            }
        }

        // Hiện footer khi có nhạc
        const mainFooter = document.getElementById('mainFooter');
        if (mainFooter) mainFooter.style.display = 'grid';

        // Hiện khung ảnh
        const miniCoverContainer = document.getElementById('miniCoverContainer');
        if (miniCoverContainer) miniCoverContainer.classList.add('active');

        // Cập nhật thông tin
        const bottomCover = document.getElementById('bottomCover');
        if (bottomCover) bottomCover.src = song.cover;

        if (currentSongName) currentSongName.textContent = song.name;
        if (bottomCurrentSong) bottomCurrentSong.textContent = song.name;

        if (toggleBtn) toggleBtn.textContent = 'Pause';
        const mainPlayBtn = document.getElementById('mainPlayBtn');
        if (mainPlayBtn) mainPlayBtn.textContent = '⏸';
    } else {
        if (audioPlayer.paused) audioPlayer.play();
        else audioPlayer.pause();
    }

    updateListButtons();
}

export function changeSong(next = true) {
    const list = getActiveList();
    if (list.length === 0) return;

    let index = list.findIndex(s => s.url === currentPlayingSong?.url);
    if (next) {
        index = (index + 1) % list.length;
    } else {
        index = (index - 1 + list.length) % list.length;
    }
    playSong(list[index]);
}

export function playNextSong() {
    if (playList.length === 0) return;

    const currentList = isShowingFavorites
        ? playList.filter(s => s.isFavorite)
        : playList;

    if (currentList.length === 0) return;

    let currentIndex = currentList.findIndex(s => s.url === currentPlayingSong?.url);
    let nextIndex = (currentIndex + 1) % currentList.length;

    playSong(currentList[nextIndex]);
}

export function playPrevSong() {
    if (playList.length === 0) return;

    const currentList = isShowingFavorites
        ? playList.filter(s => s.isFavorite)
        : playList;

    if (currentList.length === 0) return;

    let currentIndex = currentList.findIndex(s => s.url === currentPlayingSong?.url);
    let prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;

    playSong(currentList[prevIndex]);
}

export function initPlayerEvents() {
    audioPlayer.addEventListener('play', updatePlayButtons);
    audioPlayer.addEventListener('pause', updatePlayButtons);

    // Tự động chuyển bài khi kết thúc
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else if (repeatMode === 1) {
            changeSong(true);
        } else {
            const list = getActiveList();
            let index = list.findIndex(s => s.url === currentPlayingSong?.url);
            if (index < list.length - 1) {
                changeSong(true);
            } else {
                if (toggleBtn) toggleBtn.textContent = 'Play';
            }
        }
    });

    document.getElementById('nextBtn').onclick = () => changeSong(true);
    document.getElementById('prevBtn').onclick = () => changeSong(false);
}
