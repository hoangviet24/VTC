import { randomCovers } from './listImage.js';
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


let currentPlayingSong = null;

let playList = [];
let isShowingFavorites = false;
const playFavoritesBtn = document.getElementById('playFavoritesBtn');

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
    if (!audioPlayer.src) return;
    if (playList.length === 0) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        toggleBtn.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        toggleBtn.textContent = 'Play';
    }
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
        URL.revokeObjectURL(song.url);
        playList = playList.filter(s => s.url !== song.url);
        renderPlaylist(); // Vẽ lại danh sách sau khi xóa
    });

    songList.appendChild(songItem);
}
function playSong(song) {
    if (currentPlayingSong !== song) {
        currentPlayingSong = song;
        audioPlayer.src = song.url;
        audioPlayer.play();
        currentSongName.textContent = song.name;
        bottomCurrentSong.textContent = song.name;
        coverImg.src = song.cover;
        toggleBtn.textContent = "Pause";
    }
    else {
        if (audioPlayer.paused) {
            audioPlayer.play();
            toggleBtn.textContent = "Pause";
        }
        else {
            audioPlayer.pause();
            toggleBtn.textContent = "Play";
        }
    }
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
    if(playListCounter) playListCounter.innerText = `${total} bài hát`;
    if(totalSong) totalSong.innerText = total;
    
    const favDisplay = document.getElementById('totalFavorites');
    if(favDisplay) favDisplay.innerText = favorites;
}

function getRamdomCover() {
    const randomIndex = Math.floor(Math.random() * randomCovers.length);
    return randomCovers[randomIndex];
}