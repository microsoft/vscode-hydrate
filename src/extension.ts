import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';

import { existsSync } from 'fs';
import { getKubeConfig } from './kubeconfig';
import { HydrateInput } from './hydrateInput';

const IMAGE_NAME = 'mcr.microsoft.com/k8s/bedrock/hydrate:1.0';

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
		vscode.commands.registerCommand('vshydrate.hydrateCluster', hydrateCluster)
	];

	context.subscriptions.push(...subscriptions);
}


export async function hydrateCluster () {
	const kubeconfig = getKubeConfig();
	let isErr = false;

	if (!existsSync(kubeconfig)) {
		vscode.window.showErrorMessage(`The kubeconfig file ${kubeconfig} does not exist.`);
		return;
	}


	const input = new HydrateInput();
	const inputEntered = await input.get();

	if (inputEntered) {
		const term = vscode.window.createTerminal('hydrate');
		const dockerPull = `docker pull ${IMAGE_NAME}`;

		let dockerRun = `docker run -v ${kubeconfig}:/config -v ${input.outputPath}:/app/out ${IMAGE_NAME} -k /config`;

		input.args.forEach(function (arg) {
			dockerRun = dockerRun.concat(arg);
		});

		term.show();
		term.sendText(dockerPull);
		term.sendText(dockerRun);
	}
	
}



export function deactivate() {}
