// playlist.js — Quản lý danh sách phát (render, thêm, xóa, favorite)

import { songList, playListCounter, audioPlayer, currentSongName, fileInput, coverImg } from './dom.js';
import {
    playList, currentPlayingSong, isShowingFavorites,
    setPlayList, setCurrentPlayingSong, setIsShowingFavorites
} from './state.js';
import { getRamdomCover } from './utils.js';
import { playSong } from './player.js';
import { updateStats, updateListButtons } from './ui.js';

export function renderPlaylist() {
    songList.innerHTML = '';

    const filteredList = isShowingFavorites
        ? playList.filter(s => s.isFavorite)
        : playList;

    if (filteredList.length === 0) {
        songList.innerHTML = `<p class="empty-text">Chưa có bài hát nào trong danh sách này.</p>`;
    } else {
        filteredList.forEach(song => addSongToUI(song));
    }

    updateStats();
    playListCounter.innerText = `${filteredList.length} bài hát`;
}

export function addSongToUI(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';
    songItem.innerHTML = `
        <div class="song-info">
            <div class="song-thumb">
                <img src="${song.cover}" alt="cover">
            </div>
            <div class="song-details">
                <p class="song-name">${song.name}</p>
            </div>
        </div>
        <div class="song-actions">
            <button class="btn-play-song">Play</button>
            <button class="btn-favorite ${song.isFavorite ? 'active' : ''}" title="Favorite">♥</button>
            <button class="btn-remove" title="Remove">×</button>
        </div>
    `;

    // Phát nhạc
    songItem.querySelector('.btn-play-song').addEventListener('click', () => {
        playSong(song);
    });

    // Yêu thích
    const favBtn = songItem.querySelector('.btn-favorite');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        song.isFavorite = !song.isFavorite;
        favBtn.classList.toggle('active');
        updateStats();

        if (isShowingFavorites && !song.isFavorite) {
            renderPlaylist();
        }
    });

    // Xóa bài
    songItem.querySelector('.btn-remove').addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentPlayingSong && currentPlayingSong.url === song.url) {
            audioPlayer.pause();
            audioPlayer.src = '';
            coverImg.src = '';
            setCurrentPlayingSong(null);

            const mainFooter = document.getElementById('mainFooter');
            if (mainFooter) mainFooter.style.display = 'none';

            if (currentSongName) currentSongName.textContent = 'Chưa có bài hát nào được chọn';
        }

        URL.revokeObjectURL(song.url);
        setPlayList(playList.filter(s => s.url !== song.url));

        renderPlaylist();
        updateStats();
    });

    songList.appendChild(songItem);
}

export function initPlaylistEvents() {
    // Tải file từ máy
    fileInput.addEventListener('change', function (e) {
        const files = e.target.files;
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const isDuplicate = playList.some(song => song.name === file.name);
                if (isDuplicate) {
                    confirm(`Bài hát "${file.name}" đã có trong danh sách.`);
                    return;
                }
                const songData = {
                    name: file.name,
                    url: URL.createObjectURL(file),
                    cover: getRamdomCover(),
                    isFavorite: false,
                };
                playList.push(songData);
            });
            renderPlaylist();
            e.target.value = '';
        }
    });

    // Nút Favorites / Show All
    const playFavoritesBtn = document.getElementById('playFavoritesBtn');
    playFavoritesBtn.addEventListener('click', () => {
        setIsShowingFavorites(!isShowingFavorites);

        if (isShowingFavorites) {
            playFavoritesBtn.textContent = 'Show All';
            playFavoritesBtn.classList.add('btn-primary');
        } else {
            playFavoritesBtn.textContent = 'Favorites';
            playFavoritesBtn.classList.remove('btn-primary');
        }

        renderPlaylist();
    });

    // Shuffle Favorites
    const shuffleFavoritesBtn = document.getElementById('shuffleFavoritesBtn');
    shuffleFavoritesBtn.addEventListener('click', () => {
        const favSongs = playList.filter(s => s.isFavorite);
        if (favSongs.length === 0) {
            alert('Bạn chưa có bài hát yêu thích nào để Shuffle!');
            return;
        }
        const randomIndex = Math.floor(Math.random() * favSongs.length);
        playSong(favSongs[randomIndex]);
    });
}
