# Hydrate Extension for Visual Studio Code
[![Build Status](https://dev.azure.com/epicstuff/vscode-hydrate/_apis/build/status/madelineliao.vscode-hydrate?branchName=master)](https://dev.azure.com/epicstuff/vscode-hydrate/_build/latest?definitionId=103&branchName=master)
## Overview
This is the Visual Studio Code Hydrate extension, which builds upon the [VSCode Kubernetes Extension](https://github.com/Azure/vscode-kubernetes-tools). It allows developers to use [Hydrate](https://github.com/microsoft/hydrate) within VSCode, which crawls a Kubernetes cluster and generates a high level description in a `component.yaml` file for its deployments.

Instead of running Hydrate from the command line and entering flags and options manually, this extension will allow users to select a Kubernetes cluster and input options in VSCode.
 
## Test Out the Extension!
First, make sure that you have the [VSCode Kubernetes Extension](https://github.com/Azure/vscode-kubernetes-tools) installed on VSCode and that you have cloned [Hydrate](https://github.com/microsoft/hydrate) into your home directory (currently, the extension uses the home directory as the default path to the Hydrate clone).

Next, clone this repo, and open it in VSCode by running `code ./vscode-hydrate` from its parent directory. Once the window opens, press `F5` to open the Extension Development Host. 

A new window will open running the VSCode Hydrate extension. Click the Kubernetes extension icon in the sidebar, then right-click the cluster you would like to Hydrate and click `Hydrate Cluster`. The Hydrate output can be seen in the Debug Console in the original window, and a `component.yaml` file will be generated in your home directory!

Note: all clusters displayed in the sidebar are associated with the same `kubeconfig` file. To test out a different kubeconfig, click the "options" icon (the three dots) in the Kubernetes extension cluster explorer and click `Set Kubeconfig` to change the current `kubeconfig` file used. Then, you can run Hydrate on the newly displayed clusters with the new kubeconfig. 


## Dependencies
* [VSCode Kubernetes Tools and its dependencies](https://github.com/Azure/vscode-kubernetes-tools)
* [Hydrate](https://github.com/microsoft/hydrate) and its dependencies

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
