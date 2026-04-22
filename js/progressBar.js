// progressBar.js — Thanh tiến trình, buffer và tua nhạc

import { audioPlayer, mainBar, currentLine, bufferedLine } from './dom.js';
import { formatTime } from './utils.js';

export function initProgressBar() {
    // Cập nhật thanh tiến trình & thời gian
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', (e) => {
            const { currentTime, duration } = e.target;
            if (duration) {
                const progressWidth = (currentTime / duration) * 100;
                if (currentLine) currentLine.style.width = `${progressWidth}%`;
                document.getElementById('currentTime').innerText = formatTime(currentTime);
                document.getElementById('duration').innerText = formatTime(duration);
            }
        });
    }

    // Cập nhật thanh buffer
    if (audioPlayer) {
        audioPlayer.addEventListener('progress', () => {
            if (audioPlayer.duration > 0) {
                for (let i = 0; i < audioPlayer.buffered.length; i++) {
                    if (audioPlayer.buffered.start(i) < audioPlayer.currentTime) {
                        const bufferedWidth = (audioPlayer.buffered.end(i) / audioPlayer.duration) * 100;
                        if (bufferedLine) bufferedLine.style.width = `${bufferedWidth}%`;
                    }
                }
            }
        });
    } else {
        console.error('audioPlayer element not found in the DOM.');
    }

    // Tua nhạc khi click vào thanh
    if (mainBar) {
        mainBar.parentElement.addEventListener('click', (e) => {
            const bWidth = mainBar.parentElement.clientWidth;
            const clickX = e.offsetX;
            audioPlayer.currentTime = (clickX / bWidth) * audioPlayer.duration;
        });
    }
}
