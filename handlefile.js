import { randomCovers } from './js/listImage.js';
const fileInput = document.getElementById('fileInput');
const songList = document.getElementById('songlist');
const audioPlayer = document.getElementById('audioPlayer');
const playListCounter = document.getElementById('playListCount');
const totalSong = document.getElementById('totalSongs');
const currentSongName = document.getElementById('currentSongName');
const bottomCurrentSong = document.getElementById('bottomCurrentSong');
const toggleBtn = document.getElementById('togglePlayBtn');
const coverImg = document.querySelector('.fake-cover img');
const emptyText = document.querySelector('.empty-text');
const mainBar = document.querySelector(".progress-bar");
const currentLine = document.querySelector(".current-line");
const bufferedLine = document.querySelector(".buffered-line");
const speedSelect = document.getElementById("speedSelect");
let repeatMode = 0;
const repeatBtn = document.getElementById('repeatBtn');
let currentPlayingSong = null;

let playList = [];
let isShowingFavorites = false;
const playFavoritesBtn = document.getElementById('playFavoritesBtn');
const shuffleFavoritesBtn = document.getElementById('shuffleFavoritesBtn');
audioPlayer.addEventListener('play', updatePlayButtons);
audioPlayer.addEventListener('pause', updatePlayButtons);
toggleBtn.onclick = () => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
};

document.getElementById("mainPlayBtn").onclick = () => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
};
// Wrap in a check to ensure the element exists
if (speedSelect) {
    speedSelect.addEventListener("change", () => {
        audioPlayer.playbackRate = parseFloat(speedSelect.value);
    });
} else {
    console.error("Element #speedSelect not found in the DOM.");
}
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
// 2. Cập nhật thanh tiến trình & Buffer
if (audioPlayer) {
    audioPlayer.addEventListener("timeupdate", (e) => {
        const { currentTime, duration } = e.target;
        if (duration) {
            let progressWidth = (currentTime / duration) * 100;
            if (currentLine) currentLine.style.width = `${progressWidth}%`;
            document.getElementById("currentTime").innerText = formatTime(currentTime);
            document.getElementById("duration").innerText = formatTime(duration);
        }
    });
}

if (audioPlayer) {
    audioPlayer.addEventListener("progress", () => {
        if (audioPlayer.duration > 0) {
            for (let i = 0; i < audioPlayer.buffered.length; i++) {
                if (audioPlayer.buffered.start(i) < audioPlayer.currentTime) {
                    let bufferedWidth = (audioPlayer.buffered.end(i) / audioPlayer.duration) * 100;
                    bufferedLine.style.width = `${bufferedWidth}%`;
                }
            }
        }
    });
} else {
    console.error("audioPlayer element not found in the DOM.");
}

// 3. Tua nhạc khi click vào thanh
mainBar.parentElement.addEventListener("click", (e) => {
    let bWidth = mainBar.parentElement.clientWidth;
    let clickX = e.offsetX;
    audioPlayer.currentTime = (clickX / bWidth) * audioPlayer.duration;
});

// 4. Điều hướng Bài tiếp theo / Bài trước đó
function getActiveList() {
    return isShowingFavorites ? playList.filter(s => s.isFavorite) : playList;
}

function changeSong(next = true) {
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
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    switch (repeatMode) {
        case 0:
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            repeatBtn.style.color = 'white';
            break;
        case 1:
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>'; // Icon lặp lại thường dùng chung fa-repeat
            repeatBtn.style.color = 'var(--green)';
            break;
        case 2:
            // Lưu ý: FontAwesome Free dùng 'fa-repeat' kèm số 1 hoặc class 'fa-one' tùy phiên bản
            repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i><span style="font-size: 10px; position: absolute;">1</span>'; 
            repeatBtn.style.color = 'var(--green)';
            break;
    }
});
document.getElementById("mainPlayBtn").onclick = () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById("mainPlayBtn").innerHTML = "⏸";
    } else {
        audioPlayer.pause();
        document.getElementById("mainPlayBtn").textContent = "▶";
    }
};
document.getElementById("nextBtn").onclick = () => changeSong(true);
document.getElementById("prevBtn").onclick = () => changeSong(false);
audioPlayer.onended = () => {
    if (repeatMode === 2) {
        // Chế độ lặp lại 1 bài
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else if (repeatMode === 1) {
        // Chế độ lặp lại cả danh sách
        changeSong(true);
    } else {
        // Không lặp: Chỉ chuyển bài nếu chưa phải bài cuối
        const list = getActiveList();
        let index = list.findIndex(s => s.url === currentPlayingSong?.url);
        if (index < list.length - 1) {
            changeSong(true);
        } else {
            toggleBtn.textContent = 'Play'; // Hết danh sách thì dừng
        }
    }
};

shuffleFavoritesBtn.addEventListener('click', () => {
    // Lọc ra danh sách các bài đã thích
    const favSongs = playList.filter(s => s.isFavorite);

    if (favSongs.length === 0) {
        alert("Bạn chưa có bài hát yêu thích nào để Shuffle!");
        return;
    }

    // Chọn ngẫu nhiên một bài trong danh sách yêu thích
    const randomIndex = Math.floor(Math.random() * favSongs.length);
    const randomSong = favSongs[randomIndex];

    // Phát bài đó
    playSong(randomSong);
});
playFavoritesBtn.addEventListener('click', () => {
    if (isShowingFavorites) {
        playFavoritesBtn.textContent = 'Show All';
        playFavoritesBtn.classList.add('btn-primary'); // Làm nổi bật nút khi đang lọc
    } else {
        playFavoritesBtn.textContent = 'Favorites';
        playFavoritesBtn.classList.remove('btn-primary');
    }

    renderPlaylist(); // Vẽ lại danh sách dựa trên bộ lọc
});

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
        e.target.value = ''
    }
});

toggleBtn.addEventListener('click', function () {
    if (!audioPlayer.src || playList.length === 0) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        toggleBtn.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        toggleBtn.textContent = 'Play';
    }
    updateListButtons();
});

function addSongToUI(song) {
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
        <div class="song-actions">
            <button class="btn-favorite ${song.isFavorite ? 'active' : ''}" title="Add to Favorite">♥</button>
            <button class="btn-play-song">Play</button>
            <button class="btn-remove" title="Remove">×</button>
        </div>
    </div>   
`
    songItem.querySelector('.btn-play-song').addEventListener('click', () => {
        playSong(song);
    });

    // Sự kiện Favorite
    const favBtn = songItem.querySelector('.btn-favorite');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        song.isFavorite = !song.isFavorite;
        favBtn.classList.toggle('active');
        updateStats();

        if (isShowingFavorites && !song.isFavorite) {
            renderPlaylist(); // Nếu đang lọc mà bỏ thích thì ẩn luôn
        }
    });

    // Sự kiện Xóa
    songItem.querySelector('.btn-remove').addEventListener('click', (e) => {
        e.stopPropagation();

        if (currentPlayingSong && currentPlayingSong.url === song.url) {
            audioPlayer.pause();
            audioPlayer.src = "";
            currentPlayingSong = null;

            // Ẩn footer đi theo ý Việt
            const mainFooter = document.getElementById('mainFooter');
            if (mainFooter) {
                mainFooter.style.display = 'none';
            }

            // Reset lại tên bài hát trên header (nếu cần)
            if (currentSongName) currentSongName.textContent = "Chưa có bài hát nào được chọn";
        }

        // 2. Thu hồi bộ nhớ và lọc danh sách
        URL.revokeObjectURL(song.url);
        playList = playList.filter(s => s.url !== song.url);

        // 3. Cập nhật lại giao diện và thống kê
        renderPlaylist();
        updateStats();
    });

    songList.appendChild(songItem);
}
function playSong(song) {
    if (currentPlayingSong !== song) {
        currentPlayingSong = song;
        audioPlayer.src = song.url;
        audioPlayer.play();
        const songNameEl = document.getElementById('bottomCurrentSong');
        const songNameCloneEl = document.getElementById('bottomCurrentSongClone');

        if (songNameEl && songNameCloneEl) {
            songNameEl.textContent = song.name;
            songNameCloneEl.textContent = song.name; 

            // Reset animation trên cái WRAPPER
            const wrapper = document.querySelector('.marquee-wrapper');
            if (wrapper) {
                wrapper.style.animation = 'none';
                wrapper.offsetHeight; /* trigger reflow */
                wrapper.style.animation = 'seamlessLoop 10s linear infinite';
                wrapper.style.animationDelay = '3s';
            }
        }
        // 1. HIỆN FOOTER KHI CÓ NHẠC
        const mainFooter = document.getElementById('mainFooter');
        if (mainFooter) {
            mainFooter.style.display = 'grid'; // Hiện footer bằng kiểu grid
        }

        // 2. HIỆN KHUNG ẢNH (Vì Việt muốn ảnh cũng ẩn hiện)
        const miniCoverContainer = document.getElementById('miniCoverContainer');
        if (miniCoverContainer) {
            miniCoverContainer.classList.add('active');
        }

        // 3. CẬP NHẬT THÔNG TIN
        const bottomCover = document.getElementById('bottomCover');
        if (bottomCover) bottomCover.src = song.cover;

        currentSongName.textContent = song.name;
        bottomCurrentSong.textContent = song.name; // Tên bài hát giờ ở trên thanh progress

        toggleBtn.textContent = "Pause";
        document.getElementById("mainPlayBtn").textContent = "⏸";
    }
    else {
        if (audioPlayer.paused) audioPlayer.play();
        else audioPlayer.pause();
    }
    updateListButtons();
}
function updatePlayButtons() {
    const isPaused = audioPlayer.paused;
    const icon = isPaused ? "▶" : "⏸";
    const text = isPaused ? "Play" : "Pause";

    // Cập nhật nút ở Main Panel
    if (toggleBtn) toggleBtn.textContent = text;

    // Cập nhật nút ở Footer
    const mainPlayBtn = document.getElementById("mainPlayBtn");
    if (mainPlayBtn) mainPlayBtn.textContent = icon;

    // Cập nhật các nút nhỏ trong danh sách (nếu Việt có làm)
    updateListButtons();
}
function renderPlaylist() {
    // Xóa trắng danh sách hiện tại trên UI
    songList.innerHTML = '';

    // Lọc danh sách nếu đang ở chế độ Favorite
    const filteredList = isShowingFavorites
        ? playList.filter(s => s.isFavorite)
        : playList;

    if (filteredList.length === 0) {
        songList.innerHTML = `<p class="empty-text">Chưa có bài hát nào trong danh sách này.</p>`;
    } else {
        filteredList.forEach(song => {
            addSongToUI(song); // Dùng lại hàm cũ của bạn để vẽ từng dòng
        });
    }
    updateStats();
    // Cập nhật số lượng hiển thị trên tiêu đề Playlist
    playListCounter.innerText = `${filteredList.length} bài hát`;
}
playFavoritesBtn.addEventListener('click', () => {
    isShowingFavorites = !isShowingFavorites; // Đảo trạng thái

    if (isShowingFavorites) {
        playFavoritesBtn.textContent = 'Show All';
        playFavoritesBtn.classList.add('btn-primary'); // Làm nổi bật nút khi đang lọc
    } else {
        playFavoritesBtn.textContent = 'Favorites';
        playFavoritesBtn.classList.remove('btn-primary');
    }

    renderPlaylist(); // Vẽ lại danh sách dựa trên bộ lọc
});
function updateListButtons() {
    const allBtns = document.querySelectorAll('.btn-play-song');
    allBtns.forEach(btn => {
        // Tìm xem nút này có thuộc về bài đang phát không (so sánh tên hoặc URL)
        const rowName = btn.closest('.song-item').querySelector('.song-name').textContent;
        if (currentPlayingSong && rowName === currentPlayingSong.name) {
            btn.textContent = audioPlayer.paused ? 'Play' : 'Pause';
            btn.style.background = audioPlayer.paused ? 'var(--green)' : '#ff4444'; // Đổi màu cho máu lửa
        } else {
            btn.textContent = 'Play';
            btn.style.background = 'var(--green)';
        }
    });
}

function updateStats() {
    const total = playList.length;
    const favorites = playList.filter(s => s.isFavorite).length;

    // Cập nhật số lượng trên header và các thẻ thống kê
    if (playListCounter) playListCounter.innerText = `${total} bài hát`;
    if (totalSong) totalSong.innerText = total;

    const favDisplay = document.getElementById('totalFavorites');
    if (favDisplay) favDisplay.innerText = favorites;
}

function getRamdomCover() {
    const randomIndex = Math.floor(Math.random() * randomCovers.length);
    return randomCovers[randomIndex];
}

// Hàm tìm bài tiếp theo
function playNextSong() {
    if (playList.length === 0) return;

    // Xác định danh sách đang hiển thị (Tất cả hoặc chỉ Favorite)
    const currentList = isShowingFavorites
        ? playList.filter(s => s.isFavorite)
        : playList;

    if (currentList.length === 0) return;

    // Tìm index của bài đang phát
    let currentIndex = currentList.findIndex(s => s.url === currentPlayingSong?.url);

    // Tính index tiếp theo (nếu là bài cuối thì quay lại bài đầu)
    let nextIndex = (currentIndex + 1) % currentList.length;

    playSong(currentList[nextIndex]);
}

// Hàm quay lại bài trước
function playPrevSong() {
    if (playList.length === 0) return;

    const currentList = isShowingFavorites ? playList.filter(s => s.isFavorite) : playList;
    if (currentList.length === 0) return;

    let currentIndex = currentList.findIndex(s => s.url === currentPlayingSong?.url);

    // Nếu ở bài đầu thì quay xuống bài cuối
    let prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;

    playSong(currentList[prevIndex]);
}

// TỰ ĐỘNG CHUYỂN BÀI KHI KẾT THÚC
audioPlayer.addEventListener('ended', () => {
    playNextSong();
});
