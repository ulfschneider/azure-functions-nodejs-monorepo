import { HttpHandler, HttpMethod } from "@azure/functions";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
    ExternalDocumentationObject as OpenAPI3ExternalDocumentationObject,
    InfoObject as OpenAPI3InfoObject,
    OpenAPIObject as OpenAPI3OpenAPIObject,
    SecurityRequirementObject as OpenAPI3SecurityRequirementObject,
    ServerObject as OpenAPI3ServerObject,
    TagObject as OpenAPI3TagObject,
    CallbacksObject as OpenAPI3CallbacksObject,
} from 'openapi3-ts/oas30';
import {
    ExternalDocumentationObject as OpenAPI31ExternalDocumentationObject,
    InfoObject as OpenAPI31InfoObject,
    OpenAPIObject as OpenAPI31OpenAPIObject,
    SecurityRequirementObject as OpenAPI31SecurityRequirementObject,
    ServerObject as OpenAPI31ServerObject,
    TagObject as OpenAPI31TagObject,
    ExampleObject as OpenAPI31ExampleObject,
    CallbacksObject as OpenAPI31CallbacksObject,
} from 'openapi3-ts/oas31';

export type OpenAPIObject = OpenAPI3OpenAPIObject | OpenAPI31OpenAPIObject;
export type InfoObject = OpenAPI3InfoObject | OpenAPI31InfoObject;
export type ServerObject = OpenAPI3ServerObject | OpenAPI31ServerObject;
export type TagObject = OpenAPI3TagObject | OpenAPI31TagObject;
export type SecurityRequirementObject = OpenAPI3SecurityRequirementObject | OpenAPI31SecurityRequirementObject;
export type ExternalDocumentationObject = OpenAPI3ExternalDocumentationObject | OpenAPI31ExternalDocumentationObject;
export type ExampleObject = OpenAPI31ExampleObject;
export type CallbacksObject = OpenAPI3CallbacksObject | OpenAPI31CallbacksObject;

/**
 * Re-exports the `extendZodWithOpenApi` function from the `@asteasolutions/zod-to-openapi` package.
 * 
 * This function extends Zod schemas with OpenAPI metadata, allowing for the generation of OpenAPI documentation
 * from Zod validation schemas.
 * 
 * @module azure-functions-openapi/core/types
 */
export { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

export type OpenAPIObjectConfig = Omit<OpenAPIObject, 'paths' | 'components' | 'webhooks' | 'openapi'>;

/**
 * Configuration for an Azure Function route.
 * 
 * This type extends `RouteConfig` by omitting the `method`, `path`, and `summary` properties,
 * and adds additional properties specific to Azure Functions.
 * 
 * @property {HttpHandler} handler - The handler function for the route.
 * @property {HttpMethod[]} methods - An array of HTTP methods supported by the route.
 * @property {'anonymous' | 'function' | 'admin'} authLevel - The authorization level required for the route.
 * @property {string} azureFunctionRoutePrefix - The prefix for the Azure Function route.
 * @property {string} route - The route path.
 */
export type FunctionRouteConfig = Omit<RouteConfig, 'method' | 'path' | 'summary'> & {
    handler: HttpHandler,
    methods: HttpMethod[];
    authLevel: 'anonymous' | 'function' | 'admin',
    azureFunctionRoutePrefix: string,
    route: string
};

/**
 * Represents the basic information of an OpenAPI document.
 *
 * @typedef OpenAPIDocumentInfo
 * @property {string} title - The title of the OpenAPI document.
 * @property {string} url - The URL where the OpenAPI document can be accessed.
 */
export type OpenAPIDocumentInfo = {
    title: string;
    url: string;
}