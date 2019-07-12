// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';
import * as path from 'path';
// let {PythonShell} = require('python-shell');

const {spawn} = require('child_process');
const homedir = require('os').homedir();

let kubectl: k8s.KubectlV1 | undefined = undefined;
let clusterExplorer: k8s.ClusterExplorerV1 | undefined = undefined;

// Method called when extension is activated
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

/**
 * This method spawns a subprocess that calls Hydrate, which creates a Fabrikate 
 * component.yaml file in the same directory as the Hydrate clone.
 * 
 * It currently uses the default values for all Hydrate options.
 */
function hydrateCluster () {
	console.log('Hydrating...');
	let isErr = false;

	const subprocess = spawn('python3', ['-m', 'hydrate.hydrate', 'run'], {
		cwd: homedir
	});
	
	// outputs stdout of the Hydrate subprocess
	subprocess.stdout.on('data', function (data: any) {
		if (!isErr) {
			console.log(data.toString());
			console.log('Done!');
		}
	});

	// outputs errors of subprocess
	subprocess.stderr.on('data', function (data: any) {
		let err = data.toString();
		console.log(err);
		isErr = true;
	});

}

// This method is called when extension is deactivated
export function deactivate() {}
