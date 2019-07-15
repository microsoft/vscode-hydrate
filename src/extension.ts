import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';
import * as path from 'path';

import {existsSync} from 'fs';
import {homedir} from 'os';
import {spawn} from 'child_process';

const HOME = homedir();
let kubectl: k8s.KubectlV1 | undefined = undefined;
let clusterExplorer: k8s.ClusterExplorerV1 | undefined = undefined;


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
	const kubeconfig = getKubeConfig();
	let isErr = false;

	if (!existsSync(kubeconfig)) {
		vscode.window.showErrorMessage(`The kubeconfig file ${kubeconfig} does not exist.`);
		return;
	}

	console.log('Hydrating...');

	const subprocess = spawn('python3', ['-W ignore', '-m', 'hydrate.hydrate', '-k', kubeconfig, 'run'], {
		cwd: HOME
	});
	
	// outputs stdout of the Hydrate subprocess
	subprocess.stdout.on('data', function (data: any) {
		if (!isErr) {
			console.log(data.toString());
			console.log('Done!');
		}
	});

	// outputs errors
	subprocess.stderr.on('data', function (data: any) {
		let err = data.toString();
		console.log(err);
		isErr = true;
	});

}

function getKubeConfig () : string {
	let kubeConfig = vscode.workspace.getConfiguration("vs-kubernetes")["vs-kubernetes.kubeconfig"];
	if (!kubeConfig) {
		kubeConfig = process.env.KUBECONFIG;
	}

	if (!kubeConfig) {
		kubeConfig = `${HOME}${path.sep}.kube${path.sep}config`; // default kubeconfig value
	}

	return kubeConfig;	
}


export function deactivate() {}
