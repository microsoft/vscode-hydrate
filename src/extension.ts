import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';

import {existsSync} from 'fs';
import {getKubeConfig} from './kubeconfig';
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


export function hydrateCluster () {
	const kubeconfig = getKubeConfig();
	let isErr = false;

	if (!existsSync(kubeconfig)) {
		vscode.window.showErrorMessage(`The kubeconfig file ${kubeconfig} does not exist.`);
		return;
	}

	const term = vscode.window.createTerminal('hydrate');
	term.show();
	term.sendText(`cd && python3 -W ignore -m hydrate.hydrate -k ${kubeconfig} run`);
	
}

export function deactivate() {}
