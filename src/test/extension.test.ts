import * as assert from 'assert';
import * as sinon from 'sinon';
import * as Extension from '../extension';
import * as KubeConfig from '../kubeconfig';
import * as KubeHelpers from '../getKubeHelpers';
import * as vscode from 'vscode';


teardown(sinon.restore);

suite("Test hydrateCluster", function () {

    suite("With bad kubeconfig", function () {
        test('VSCode should show error message', function () {
            sinon.stub(KubeConfig, 'getKubeConfig').returns('bad kube config');

            const hydrateClusterSpy = sinon.spy(Extension, 'hydrateCluster');
            const showErrorMessage = sinon.spy(vscode.window, 'showErrorMessage');
            
            hydrateClusterSpy();

            assert(hydrateClusterSpy.calledOnce);
            assert(showErrorMessage.calledOnce);
        });
    });

    suite('With good kubeconfig', function () {
        test('VSCode should create a terminal named \'hydrate\'', function () {
            const hydrateClusterSpy = sinon.spy(Extension, 'hydrateCluster');
            const createTerminal = sinon.spy(vscode.window, 'createTerminal');

            hydrateClusterSpy();

            assert(createTerminal.called);
            assert(vscode.window.terminals[0].name === 'hydrate');
        });

    });

});

suite("Test getKubeConfig", function () {
    

    suite('If getVSCodeKubeConfig returns undefined', function () {
        
        test('Should return either the env kubeconfig or the default config', function () {
            sinon.stub(KubeHelpers, 'getVscodeKubeConfig').returns(undefined);
            const kubeconfig = KubeConfig.getKubeConfig();

            assert(kubeconfig === KubeHelpers.getEnvKubeConfig() || kubeconfig === KubeHelpers.getDefaultKubeConfig());

            sinon.restore();
        });

    });

    suite('If getVSCodeKubeConfig returns a string', function () {
       
        test('Should return the VSCode kubeconfig', function () {
            sinon.stub(KubeHelpers, 'getVscodeKubeConfig').returns('./resources/config');
            const kubeconfig = KubeConfig.getKubeConfig();

            assert(kubeconfig === KubeHelpers.getVscodeKubeConfig());

            sinon.restore();
        });

    });
    
    suite('If both the VSCode kubeconfig and the env kubeconfig are undefined', function () {

        test('Should return the default kubeconfig', function () {
            sinon.stub(KubeHelpers, 'getVscodeKubeConfig').returns(undefined);
            sinon.stub(KubeHelpers, 'getEnvKubeConfig').returns(undefined);
            
            const kubeconfig = KubeConfig.getKubeConfig();

            assert(kubeconfig === KubeHelpers.getDefaultKubeConfig());

            sinon.restore();
        });

    });
    
});