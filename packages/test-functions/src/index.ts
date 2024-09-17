import { registerApiKeySecuritySchema, registerOpenAPI3Handler, registerSwaggerUIHandler } from '@apvee/azure-functions-openapi';
import { app } from '@azure/functions';

app.setup({
    enableHttpStream: true
});

export const apiKeySecurity = registerApiKeySecuritySchema("code", "query");

registerOpenAPI3Handler({
    informations: { title: 'My API', version: "1", contact: { name: "Apvee Solutions", email: "hello@apvee.com", url: "https://www.apvee.com" } },
    security: [apiKeySecurity],
    externalDocs: { description: "External Documentation", url: "https://www.apvee.com" },
    tags: [{ name: "My Tag", description: "My Tag Description" }],
    authLevel: "anonymous"
});
registerSwaggerUIHandler("anonymous", 'api');