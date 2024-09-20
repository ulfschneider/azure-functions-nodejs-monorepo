import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OpenAPI3ExternalDocumentationObject, OpenAPI3InfoObject, OpenAPI3OpenAPIObject, OpenAPI3SecurityRequirementObject, OpenAPI3ServerObject, OpenAPI3TagObject } from "../core/exports";
import { registry } from "./../core/registry";
import { stringify as yamlStringify } from 'yaml'

/**
 * Registers an OpenAPI3 handler.
 *
 * @param informations - The OpenAPI3 information object.
 * @param security - The OpenAPI3 security requirement objects.
 * @param externalDocs - The OpenAPI3 external documentation object.
 * @param tags - The OpenAPI3 tag objects.
 * @param authLevel - The authentication level. Default is 'anonymous'.
 */
export function registerOpenAPI3Handler(params: {
    informations: OpenAPI3InfoObject,
    security: OpenAPI3SecurityRequirementObject[],
    externalDocs?: OpenAPI3ExternalDocumentationObject,
    tags?: OpenAPI3TagObject[],
    authLevel: 'anonymous' | 'function' | 'admin'
}) {

    const fxJsonHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Invoking OpenAPI handler for url "${request.url}"`);

        const openApiDefinition = buildOpenAPI3Definition(
            params.informations,
            params.security,
            [{ url: `${new URL(request.url).origin}` }],
            params.externalDocs,
            params.tags
        );

        if (openApiDefinition) {
            context.log(`OpenAPI definition generated successfully`);
            return {
                status: 200,
                jsonBody: openApiDefinition
            };
        } else {
            context.error(`Unable to generate the OpenAPI definition`);
            return {
                status: 500,
                body: `Unable to retrive the OpenAPI definition`
            };
        }
    };

    const fxYamlHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Invoking OpenAPI handler for url "${request.url}"`);

        const openApiDefinition = buildOpenAPI3Definition(
            params.informations,
            params.security,
            [{ url: `${new URL(request.url).origin}` }],
            params.externalDocs,
            params.tags
        );

        if (openApiDefinition) {
            context.log(`OpenAPI definition generated successfully`);
            return {
                status: 200,
                body: yamlStringify(openApiDefinition)
            };
        } else {
            context.error(`Unable to generate the OpenAPI definition`);
            return {
                status: 500,
                body: `Unable to retrive the OpenAPI definition`
            };
        }
    };

    app.http('HandlerJsonOpenAPIHandler', {
        methods: ['GET'],
        authLevel: params.authLevel,
        handler: fxJsonHandler,
        route: `openapi.json`
    });

    app.http('HandlerYamlOpenAPIHandler', {
        methods: ['GET'],
        authLevel: params.authLevel,
        handler: fxYamlHandler,
        route: `openapi.yaml`
    });
}

/**
 * Builds an OpenAPI 3 definition.
 * 
 * @param informations - The information object for the OpenAPI definition.
 * @param security - The security requirements for the OpenAPI definition.
 * @param servers - The server objects for the OpenAPI definition.
 * @param externalDocs - The external documentation object for the OpenAPI definition (optional).
 * @param tags - The tag objects for the OpenAPI definition (optional).
 * @returns The generated OpenAPI 3 definition.
 */
function buildOpenAPI3Definition(
    informations: OpenAPI3InfoObject,
    security: OpenAPI3SecurityRequirementObject[],
    servers: OpenAPI3ServerObject[],
    externalDocs?: OpenAPI3ExternalDocumentationObject,
    tags?: OpenAPI3TagObject[]): OpenAPI3OpenAPIObject {
    const config: OpenAPIObjectConfig = {
        openapi: '3.0.3',
        info: informations,
        security: security,
        servers: servers,
        externalDocs: externalDocs,
        tags: tags,
    }

    return new OpenApiGeneratorV3(registry.definitions).generateDocument(config);
}