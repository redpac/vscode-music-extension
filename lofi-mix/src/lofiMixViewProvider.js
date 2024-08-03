const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class LofiMixViewProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
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
            </head>
            <body>
                <h1>Lofi Mix</h1>
                <div id="track-list">
                    ${tracks.map((track, index) => `
                        <div class="track" data-index="${index}" data-uri="${trackUris[index]}">
                            <span class="track-name">${track.replace('.mp3', '')}</span>
                        </div>
                    `).join('')}
                </div>
                <div id="player-controls">
                    <button id="prev">Previous</button>
                    <button id="play-pause">Play</button>
                    <button id="next">Next</button>
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