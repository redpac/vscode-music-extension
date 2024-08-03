(function() {
    const vscode = acquireVsCodeApi();
    let currentTrack = 0;
    let isPlaying = false;
    const audioPlayer = document.getElementById('audio-player');
    const tracks = Array.from(document.querySelectorAll('.track'));

    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('prev').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);

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
            document.getElementById('play-pause').textContent = 'Play';
        } else {
            playTrack();
        }
    }

    function playTrack() {
        const track = tracks[currentTrack];
        const trackUri = track.dataset.uri;
        console.log('Playing track:', trackUri);
        audioPlayer.src = trackUri;
        audioPlayer.play().then(() => {
            isPlaying = true;
            document.getElementById('play-pause').textContent = 'Pause';
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

    // Initialize
    if (tracks.length > 0) {
        playTrack();
    }
})();