import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { OpenAPI3ExternalDocumentationObject, OpenAPI3InfoObject, OpenAPI3OpenAPIObject, OpenAPI3SecurityRequirementObject, OpenAPI3ServerObject, OpenAPI3TagObject } from "./exports";

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
export function buildOpenAPI3Definition(
    informations: OpenAPI3InfoObject,
    security: OpenAPI3SecurityRequirementObject[],
    servers: OpenAPI3ServerObject[],
    externalDocs?: OpenAPI3ExternalDocumentationObject,
    tags?: OpenAPI3TagObject[]): OpenAPI3OpenAPIObject {
    const config: OpenAPIObjectConfig = {
        openapi: '3.0.0',
        info: informations,
        security: security,
        servers: servers,
        externalDocs: externalDocs,
        tags: tags,
    }

    return new OpenApiGeneratorV3(registry.definitions).generateDocument(config);
}