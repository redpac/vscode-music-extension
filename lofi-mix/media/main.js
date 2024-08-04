(function() {
    const vscode = acquireVsCodeApi();
    let currentTrack = 0;
    let isPlaying = false;
    const audioPlayer = document.getElementById('audio-player');
    const tracks = Array.from(document.querySelectorAll('.track'));
    const progressBar = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');

    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('prev').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);
    document.getElementById('progress-bar').addEventListener('click', seek);

    tracks.forEach(track => {
        track.addEventListener('click', () => {
            currentTrack = parseInt(track.dataset.index);
            playTrack();
        });
    });

    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            document.querySelector('#play-pause i').classList.replace('fa-pause', 'fa-play');
        } else {
            playTrack();
        }
    }

    function playTrack() {
        const track = tracks[currentTrack];
        const trackUri = track.dataset.uri;
        audioPlayer.src = trackUri;
        audioPlayer.play().then(() => {
            isPlaying = true;
            document.querySelector('#play-pause i').classList.replace('fa-play', 'fa-pause');
            updatePlayingIndicator();
        }).catch(error => {
            console.error('Error playing audio:', error);
            vscode.postMessage({ type: 'error', message: 'Failed to play audio: ' + error.message });
        });
    }

    function playPrevious() {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        playTrack();
    }

    function playNext() {
        currentTrack = (currentTrack + 1) % tracks.length;
        playTrack();
    }

    function updatePlayingIndicator() {
        tracks.forEach((track, index) => {
            if (index === currentTrack) {
                track.classList.add('playing');
            } else {
                track.classList.remove('playing');
            }
        });
    }

    function seek(e) {
        const percent = e.offsetX / this.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }

    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // Initialize
    if (tracks.length > 0) {
        playTrack();
    }
})();