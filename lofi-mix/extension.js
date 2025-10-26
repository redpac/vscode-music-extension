// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const LofiMixViewProvider = require('./src/lofiMixViewProvider');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "music-player" is now active!!');

	const lofiMixViewProvider = new LofiMixViewProvider(context.extensionUri, context)

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("FrutigerPlayer", lofiMixViewProvider),
		vscode.window.registerWebviewViewProvider("FrutigerPlayer2", lofiMixViewProvider)
	)
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('lofi-mix.startSession', function () {
		// The code you place here will be executed every time your command is executed
		vscode.commands.executeCommand('FrutigerPlayer.focus');
		vscode.commands.executeCommand('FrutigerPlayer2.focus');

	});

	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
