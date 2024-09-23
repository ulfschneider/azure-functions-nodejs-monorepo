import { OpenAPI3ExternalDocumentationObject, OpenAPI3InfoObject, OpenAPI3SecurityRequirementObject, OpenAPI3ServerObject, OpenAPI3TagObject } from "./exports";

export interface IOpenAPIDocument {
    title: string;
    url: string;
}

export interface IOpenAPI3Definition {
    informations: OpenAPI3InfoObject,
    security: OpenAPI3SecurityRequirementObject[],
    servers?: OpenAPI3ServerObject[],
    externalDocs?: OpenAPI3ExternalDocumentationObject,
    tags?: OpenAPI3TagObject[]
};