import { registerApiKeySecuritySchema, registerOpenAPI3Handler, registerSwaggerUIHandler } from '@apvee/azure-fx-openapi';
import { app } from '@azure/functions';

app.setup({
    enableHttpStream: true
});

registerOpenAPI3Handler(
    { title: 'My API', version: "1", contact: { name: "Apvee Solutions", email: "hello@apvee.com", url: "https://www.apvee.com" } },
    [registerApiKeySecuritySchema("code", "query")],
    { description: "External Documentation", url: "https://www.apvee.com" },
    [{ name: "My Tag", description: "My Tag Description" }],
    ["GET"],
    "anonymous"
);
registerSwaggerUIHandler(["GET"], "anonymous", 'api');