import { OpenApiGeneratorV3, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OpenAPI3ExternalDocumentationObject, OpenAPI3InfoObject, OpenAPI3OpenAPIObject, OpenAPI3SecurityRequirementObject, OpenAPI3ServerObject, OpenAPI3TagObject } from "../core/exports";
import { stringify as yamlStringify } from 'yaml'
import { IOpenAPI3Definition, IOpenAPIDocument } from "../core/types";
import { registry } from "../core";

/**
 * Registers an OpenAPI 3.0 handler for an Azure Function.
 *
 * @param definition - The OpenAPI 3.0 definition object.
 * @param authLevel - The authorization level required to access the endpoint. Can be 'anonymous', 'function', or 'admin'.
 * @param documentFormat - The format of the OpenAPI document. Can be 'json' or 'yaml'.
 * @param documentRoute - Optional custom route for the OpenAPI document. If not provided, defaults to 'openapi-3.json' or 'openapi-3.yaml' based on the documentFormat.
 * @returns An object containing the title and URL of the registered OpenAPI document.
 */
export function registerOpenAPI3Handler(
    definition: IOpenAPI3Definition,
    authLevel: 'anonymous' | 'function' | 'admin',
    documentFormat: 'json' | 'yaml',
    documentRoute?: string,
): IOpenAPIDocument {
    const openapi = '3.0.3';
    const route = documentRoute || (documentFormat === "json") ? `openapi-${openapi}.json` : `openapi-${openapi}.yaml`;
    const functionName = `OpenAPI30${documentFormat === 'json' ? 'Json' : 'Yaml'}Handler`;

    app.http(functionName, {
        methods: ['GET'],
        authLevel: authLevel,
        handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
            context.log(`Invoking OpenAPI ${openapi} ${documentFormat} definition handler for url "${request.url}"`);

            const openAPIDefinition: OpenAPI3OpenAPIObject = new OpenApiGeneratorV3(registry.definitions)
                .generateDocument({
                    openapi: openapi,
                    info: definition.informations,
                    security: definition.security,
                    servers: definition.servers || [],
                    externalDocs: definition.externalDocs,
                    tags: definition.tags,
                });

            return {
                status: 200,
                headers: { 'Content-Type': documentFormat === 'json' ? 'application/json' : 'application/x-yaml' },
                body: (documentFormat === 'yaml') ? yamlStringify(openAPIDefinition) : undefined,
                jsonBody: (documentFormat === 'json') ? openAPIDefinition : undefined,
            };
        },
        route: route
    });

    return { title: `${definition.informations.title} (${documentFormat === 'json' ? 'Json' : 'Yaml'} - OpenAPI ${openapi})`, url: route };
}