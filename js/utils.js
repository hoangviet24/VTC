// utils.js — Các hàm tiện ích dùng chung

import { randomCovers } from './listImage.js';

export const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function getRamdomCover() {
    const randomIndex = Math.floor(Math.random() * randomCovers.length);
    return randomCovers[randomIndex];
}
