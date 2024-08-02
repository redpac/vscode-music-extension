(function() {
    try {
    const vscode = acquireVsCodeApi();

    let currentTrack = 0;
    let isPlaying = false;
    const audio = new Audio();

    document.getElementById('play-pause').addEventListener('click', togglePlayPause);
    document.getElementById('prev').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);

    document.querySelectorAll('.track').forEach(track => {
        track.addEventListener('click', () => {
            currentTrack = parseInt(track.dataset.index);
            playTrack();
        });
    });

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            document.getElementById('play-pause').textContent = 'Play';
        } else {
            playTrack();
        }
    }

    function playTrack() {
        const tracks = document.querySelectorAll('.track');
        const trackName = tracks[currentTrack].querySelector('.track-name').textContent;
        audio.src = `${vscode.getState().extensionUri}/media/tracks/${trackName}.mp3`;
        audio.play();
        isPlaying = true;
        document.getElementById('play-pause').textContent = 'Pause';
    }

    function playPrevious() {
        currentTrack = (currentTrack - 1 + document.querySelectorAll('.track').length) % document.querySelectorAll('.track').length;
        playTrack();
    }

    function playNext() {
        currentTrack = (currentTrack + 1) % document.querySelectorAll('.track').length;
        playTrack();
    }

    // Initialize state
    vscode.setState({ extensionUri: document.body.dataset.extensionUri });
}
catch (error) {
    console.error('Error in main.js', error);
}
})();