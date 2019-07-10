// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';

let kubectl: k8s.KubectlV1 | undefined = undefined;
let clusterExplorer: k8s.ClusterExplorerV1 | undefined = undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate (context: vscode.ExtensionContext) {
	const clusterExplorerAPI = await k8s.extension.clusterExplorer.v1;
	const kubectlAPI = await k8s.extension.kubectl.v1;

    if (!clusterExplorerAPI.available ||  !kubectlAPI.available) {
        vscode.window.showErrorMessage("Unable to access Kubernetes extension");
        return;
    }

    clusterExplorer = clusterExplorerAPI.api;
	kubectl = kubectlAPI.api;
	
	const subscriptions = [
		vscode.commands.registerCommand('vshydrate.hydrateCluster', hydrateCluster),
    ];

    context.subscriptions.push(...subscriptions);
}


function hydrateCluster () {

}

// this method is called when your extension is deactivated
export function deactivate() {}
