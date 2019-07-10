"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const k8s = require("vscode-kubernetes-tools-api");
let kubectl = undefined;
let clusterExplorer = undefined;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const clusterExplorerAPI = yield k8s.extension.clusterExplorer.v1;
        const kubectlAPI = yield k8s.extension.kubectl.v1;
        if (!clusterExplorerAPI.available || !kubectlAPI.available) {
            vscode.window.showErrorMessage("Unable to access Kubernetes extension");
            return;
        }
        clusterExplorer = clusterExplorerAPI.api;
        kubectl = kubectlAPI.api;
        const subscriptions = [
            vscode.commands.registerCommand('vshydrate.hydrateCluster', hydrateCluster),
        ];
        context.subscriptions.push(...subscriptions);
    });
}
exports.activate = activate;
function hydrateCluster() {
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map