const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class LofiMixViewProvider {
    constructor(extensionUri, context) {
        this._extensionUri = extensionUri;
        this._context = context;
        this._view = null;
        this._audioState = this._context.globalState.get('audioState', {
            currentTrack: 0,
            currentTime: 0,
            isPlaying: false
        })
    }

    resolveWebviewView(webviewView) {
        console.log('Resolving webview view');
        try {
            this._view = webviewView;

            webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [this._extensionUri]
            };

            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

            this._setWebviewMessageListener(webviewView.webview);
        }
        catch (error) {
            console.error('Error resolving webview view', error);
        }
    }
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'error':
                        vscode.window.showErrorMessage(message.message);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }

    _getHtmlForWebview(webview) {
        console.log('Getting HTML for webview');
        try {
            const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
            const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css'));

            // Get the list of track files
            const tracksDir = path.join(this._extensionUri.fsPath, 'media', 'tracks');
            const tracks = fs.readdirSync(tracksDir).filter(file => file.endsWith('.mp3'));

            // Create URIs for each track
            const trackUris = tracks.map(track =>
                webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'tracks', track))
            );

            return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lofi Mix</title>
            <link href="${styleUri}" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
        </head>
        <body>
            <h1>Musiquita</h1>
            <div id="track-list">
                ${tracks.map((track, index) => `
                    <div class="track" data-index="${index}" data-uri="${trackUris[index]}">
                        <span class="track-name">${track.replace('.mp3', '')}</span>
                    </div>
                `).join('')}
            </div>
            <div id="player-controls">
                <div id="progress-bar">
                    <div id="progress"></div>
                </div>
                <div id="time-display">
                    <span id="current-time">00:00</span>
                    <span id="total-time">00:00</span>
                </div>
                <div id="control-buttons">
                    <button id="prev"><i class="fas fa-step-backward"></i></button>
                    <button id="play-pause"><i class="fas fa-play"></i></button>
                    <button id="next"><i class="fas fa-step-forward"></i></button>
                </div>
            </div>
            <audio id="audio-player"></audio>
            <script src="${scriptUri}"></script>
        </body>
        </html>
    `;
        }
        catch (error) {
            console.error('Error getting HTML for webview', error);
            return '<html><body>Error loading content</body></html>';
        }
    }

    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }
}

module.exports = LofiMixViewProvider;