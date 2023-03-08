const { createConnection, TextDocuments, ProposedFeatures } = require('vscode-languageserver');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

documents.onDidChangeContent((change) => {
    const document = change.document;
    // Do something with the updated document content
});

documents.onDidClose((event) => {
    const document = event.document;
    // Clean up any resources associated with the closed document
});

connection.onInitialize((params) => {
    console.log("Starting")
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            completionProvider: {
                triggerCharacters: ['P', 'O']
            }
        }
    };
});

connection.onCompletion((params) => {
    const { textDocument, position } = params;
    const line = documents.get(textDocument.uri).getText().split(/\r?\n/g)[position.line];
    const word = line.substring(0, position.character).split(/\s+/).pop();

    if (word === 'PO') {
        return {
            isIncomplete: false,
            items: [{
                label: 'POKE',
                kind: 14 // This corresponds to "method" in the VSCode UI
            }]
        };
    } else {
        return null;
    }
});

connection.listen();