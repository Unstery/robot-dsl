import { addMonacoStyles, defineUserServices, MonacoEditorLanguageClientWrapper } from './bundle/index.js';
import { configureWorker } from './setup.js';

addMonacoStyles('monaco-editor-styles');

export const setupConfigExtended = () => {
    const extensionFilesOrContents = new Map();
    const languageConfigUrl = new URL('../language-configuration.json', window.location.href);
    const textmateConfigUrl = new URL('../syntaxes/robot-dsl.tmLanguage.json', window.location.href);
    extensionFilesOrContents.set('/language-configuration.json', languageConfigUrl);
    extensionFilesOrContents.set('/robot-dsl-grammar.json', textmateConfigUrl);

    return {
        wrapperConfig: {
            serviceConfig: defineUserServices(),
            editorAppConfig: {
                $type: 'extended',
                languageId: 'robot-dsl',
                code: `// RobotDSL is running in the web!`,
                useDiffEditor: false,
                extensions: [{
                    config: {
                        name: 'robot-dsl-web',
                        publisher: 'generator-langium',
                        version: '1.0.0',
                        engines: {
                            vscode: '*'
                        },
                        contributes: {
                            languages: [{
                                id: 'robot-dsl',
                                extensions: [
                                    '.robot-dsl'
                                ],
                                configuration: './language-configuration.json'
                            }],
                            grammars: [{
                                language: 'robot-dsl',
                                scopeName: 'source.robot-dsl',
                                path: './robot-dsl-grammar.json'
                            }]
                        }
                    },
                    filesOrContents: extensionFilesOrContents,
                }],                
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': 'Default Dark Modern',
                        'editor.semanticHighlighting.enabled': true
                    })
                }
            }
        },
        languageClientConfig: configureWorker()
    };
};

export const executeExtended = async (htmlElement) => {
    const userConfig = setupConfigExtended();
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.start(userConfig, htmlElement);
};
