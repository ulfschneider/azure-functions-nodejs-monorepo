import { OpenAPIObjectConfig, registerApiKeySecuritySchema, registerOpenAPIHandler, registerSwaggerUIHandler } from '@apvee/azure-functions-openapi';
import { app } from '@azure/functions';

app.setup({
    enableHttpStream: true
});

export const apiKeySecurity = registerApiKeySecuritySchema("code", "query");
const openAPIConfig: OpenAPIObjectConfig = {
    info: {
        title: 'Simple Todo REST API',
        version: "1",
        contact: {
            name: "Apvee Solutions",
            email: "hello@apvee.com",
            url: "https://www.apvee.com"
        }
    },
    security: [apiKeySecurity],
    externalDocs: {
        description: "External Documentation",
        url: "https://www.apvee.com"
    },
    tags: [{
        name: "Todos",
        description: "My Tag Description",
        externalDocs: {
            description: "External Documentation",
            url: "https://www.apvee.com"
        }
    }]
}

const documents = [
    registerOpenAPIHandler("anonymous", openAPIConfig, "3.1.0", "json"),
    registerOpenAPIHandler("anonymous", openAPIConfig, "3.1.0", "yaml"),
    registerOpenAPIHandler("anonymous", openAPIConfig, "3.0.3", "json"),
    registerOpenAPIHandler("anonymous", openAPIConfig, "3.0.3", "yaml"),
    registerOpenAPIHandler("anonymous", openAPIConfig, "2.0", "json"),
    registerOpenAPIHandler("anonymous", openAPIConfig, "2.0", "yaml")
];

registerSwaggerUIHandler("anonymous", 'api', documents);