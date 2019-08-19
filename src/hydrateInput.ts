import { MultiStepInput } from "./multiStepInput";
import * as vscode from 'vscode';

export class HydrateInput {
    readonly TITLE: string = 'Enter Hydrate Arguments';
    readonly FLAGS: vscode.QuickPickItem[] = [
        {label: 'Dry Run', description: '(only prints component.yaml to terminal)'},
        {label: 'Verbose Mode', description: '(prints verbose output logs)'}];
    readonly TOTAL_STEPS: number = 4;

    componentName: string;
    outputPath: string;
    dryRun: boolean;
    verbose: boolean;
    args: string[];

    constructor() {
        this.componentName = '';
        this.outputPath = '';
        this.dryRun = false;
        this.verbose = false;
        this.args = [];
    }

    async get () {
        if (!(await MultiStepInput.run(input => this.setComponentName(input)))) {
            // command cancelled
            return false;
        }
        return true;
    }

    async setComponentName(input: MultiStepInput) {
        this.componentName = await input.showInputBox({
            title: this.TITLE,
            step: input.CurrentStepNumber,
            totalSteps: this.TOTAL_STEPS,
            prompt: 'What you want to name the component',
            placeholder: 'default: hydratedCluster',
            ignoreFocusOut: true,
            value: (typeof this.componentName === 'string') ? this.componentName : '',
            validate: async (value) => ''
        });

        if (this.componentName) {
            this.args.push(` -n ${this.componentName}`);
        }

        return (input: MultiStepInput) => this.setOutputPath(input);
    }

    async setOutputPath (input: MultiStepInput) {
        await input.showInputBox({
            title: this.TITLE,
            step: input.CurrentStepNumber,
            totalSteps: this.TOTAL_STEPS,
            prompt: 'In the next step, choose an output location for the component.yaml',
            placeholder: 'Any input + ENTER to continue.',
            ignoreFocusOut: true,
            value: '',
            validate: async (value) => ''
        });

        const file = await vscode.window.showOpenDialog({
            canSelectFiles: false, 
            canSelectFolders: true, 
            canSelectMany: false,
            defaultUri: (typeof this.outputPath === 'string') ? vscode.Uri.file(this.outputPath) : vscode.Uri.file('')
        });

        if (file) {
            this.outputPath = file[0].fsPath;
        }

        return (input: MultiStepInput) => this.setFlags(input);
    }

    async setFlags (input: MultiStepInput) {
        const flags = await input.showQuickPick({
            title: this.TITLE,
            step: input.CurrentStepNumber,
            items: this.FLAGS,
            totalSteps: this.TOTAL_STEPS,
            placeholder: 'Select output options',
            canPickMany: true,
            ignoreFocusOut: true,
            convert: async (value: vscode.QuickPickItem) => value.label
        });

        if (flags) {
            this.dryRun = flags.includes('Dry Run');
            this.verbose = flags.includes('Verbose Mode');
            if (this.dryRun) {
                this.args.push(' -d');
            }
            if (this.verbose) {
                this.args.push(' -v');
            }
        }

    }
}