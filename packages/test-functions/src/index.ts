import { registerApiKeySecuritySchema, registerOpenAPI2Handler, registerOpenAPI3Handler, registerSwaggerUIHandler } from '@apvee/azure-functions-openapi';
import { app } from '@azure/functions';

app.setup({
    enableHttpStream: true
});

export const apiKeySecurity = registerApiKeySecuritySchema("code", "query");
const openAPIDefinition = {
    informations: { title: 'My API', version: "1", contact: { name: "Apvee Solutions", email: "hello@apvee.com", url: "https://www.apvee.com" } },
    security: [apiKeySecurity],
    externalDocs: { description: "External Documentation", url: "https://www.apvee.com" },
    tags: [{ name: "My Tag", description: "My Tag Description" }],
}

const documents = [
    registerOpenAPI3Handler(openAPIDefinition, "anonymous", "json"),
    registerOpenAPI3Handler(openAPIDefinition, "anonymous", "yaml"),
    registerOpenAPI2Handler(openAPIDefinition, "anonymous", "json"),
    registerOpenAPI2Handler(openAPIDefinition, "anonymous", "yaml")
];

registerSwaggerUIHandler("anonymous", 'api', documents);