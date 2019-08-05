import * as vscode from 'vscode';
import * as path from 'path';
import {homedir} from 'os';

const HOME = homedir();

export function getKubeConfig () : string {
	let kubeConfig = vscode.workspace.getConfiguration("vs-kubernetes")["vs-kubernetes.kubeconfig"];
	if (!kubeConfig) {
		kubeConfig = process.env.KUBECONFIG;
	}

	if (!kubeConfig) {
		kubeConfig = `${HOME}${path.sep}.kube${path.sep}config`; // default kubeconfig value
	}

	return kubeConfig;	
}