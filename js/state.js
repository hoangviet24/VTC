// state.js — Trạng thái toàn cục của ứng dụng

export let playList = [];
export let currentPlayingSong = null;
export let isShowingFavorites = false;
export let repeatMode = 0;

export function setPlayList(list) {
    playList = list;
}

export function setCurrentPlayingSong(song) {
    currentPlayingSong = song;
}

export function setIsShowingFavorites(value) {
    isShowingFavorites = value;
}

export function setRepeatMode(value) {
    repeatMode = value;
}
