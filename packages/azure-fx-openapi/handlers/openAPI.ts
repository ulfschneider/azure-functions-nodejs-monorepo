import { app, HttpMethod, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { buildOpenAPI3Definition } from "../core/buildOpenAPIDefinition";
import { OpenAPI3ExternalDocumentationObject, OpenAPI3InfoObject, OpenAPI3SecurityRequirementObject, OpenAPI3TagObject } from "../core/exports";

/**
 * Registers an OpenAPI3 handler.
 *
 * @param informations - The OpenAPI3 information object.
 * @param security - The OpenAPI3 security requirement objects.
 * @param externalDocs - The OpenAPI3 external documentation object.
 * @param tags - The OpenAPI3 tag objects.
 * @param methods - The HTTP methods to be handled. Default is ['GET'].
 * @param authLevel - The authentication level. Default is 'anonymous'.
 * @param routePrefix - The route prefix. Default is 'api'.
 */
export function registerOpenAPI3Handler(
    informations: OpenAPI3InfoObject,
    security: OpenAPI3SecurityRequirementObject[],
    externalDocs?: OpenAPI3ExternalDocumentationObject,
    tags?: OpenAPI3TagObject[],
    methods: HttpMethod[] = ['GET'],
    authLevel: 'anonymous' | 'function' | 'admin' = 'anonymous') {

    const fxHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Invoking OpenAPI handler for url "${request.url}"`);

        const openApiDefinition = buildOpenAPI3Definition(
            informations,
            security,
            [{ url: `${new URL(request.url).origin}` }],
            externalDocs,
            tags
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

    app.http('HandlerOpenAPIHandler', {
        methods: methods,
        authLevel: authLevel,
        handler: fxHandler,
        route: `openapi.json`
    });
}