import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const openCommand = vscode.commands.registerCommand("FSO-webview.openWebview", () => {
    new FSOWebview(context);
  });

  context.subscriptions.push();
  context.subscriptions.push(openCommand);
}

export function deactivate() {}

class FSOWebview {
  public static readonly viewType = "FSO-webview.FSOWebview";

  private _webviewPanel?: vscode.WebviewPanel;
  private _FSOUrl: string;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._FSOUrl =
      vscode.workspace.getConfiguration("FSO-webview").get("FSOUrl") ??
      "https://fullstackopen.com/en";
    this.createWebviewPanel(context);
  }

  private createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const webviewPanel = vscode.window.createWebviewPanel(
      FSOWebview.viewType,
      "FSO Webview",
      vscode.ViewColumn.Two,
      {

        enableScripts: true,
        retainContextWhenHidden: true,
        enableFindWidget: true,
      }
    );

    webviewPanel.webview.html = this.getWebviewContent();

    webviewPanel.onDidDispose(
      () => {
        this._webviewPanel = undefined;
      },
      null,
      this.context.subscriptions
    );

    return webviewPanel;
  }

  private getWebviewContent(): string {
    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>FSO Webview</title>
			<style>
				html, body {
					height: 100%;
					background-color: white;
				}

				#frame {
					width: 100%;
					height: 100%;
				}
			</style>
		</head>
		<body>
    <iframe id="x-frame-bypass" src="${this._FSOUrl}" width="100%" height="100%" frameborder="0"     sandbox="allow-scripts allow-same-origin">
    ></iframe>
		</body>

    // <script src="https://unpkg.com/@ungap/custom-elements-builtin"></script>
    // <script type="module" src="https://unpkg.com/x-frame-bypass"></script>

		</html>`;
  }
}
