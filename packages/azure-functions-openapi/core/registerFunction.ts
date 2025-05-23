import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { app, HttpMethod } from "@azure/functions";
import { registry } from "./registry";
import { FunctionRouteConfig } from "./types";

/**
 * Registers a function with the specified configuration.
 *
 * @param {string} name - The name of the function.
 * @param {string} summary - A summary of the function.
 * @param {FunctionRouteConfig} options - Configuration options for the function.
 * @param {Function} options.handler - The HTTP handler for the function.
 * @param {HttpMethod[]} options.methods - An array of HTTP methods supported by the function.
 * @param {'anonymous' | 'function' | 'admin'} options.authLevel - The authorization level required to access the function.
 * @param {Array} [options.security] - An array of security requirements for the function.
 * @param {string} options.azureFunctionRoutePrefix - The route prefix for the Azure Function.
 * @param {string} options.route - The route for the function.
 * @param {Object} [options.request] - An object defining the request parameters, including body, params, query, cookies, and headers.
 * @param {Object} options.responses - An object defining the possible responses from the function, keyed by status code.
 * @param {string} [options.description] - A detailed description of the function.
 * @param {Array} [options.tags] - An array of tags associated with the function.
 * @param {string} [options.operationId] - A unique identifier for the operation.
 * @param {boolean} [options.deprecated] - A boolean indicating whether the function is deprecated.
 * @param {Object} [options.externalDocs] - External documentation for the function.
 * @param {Object} [options.callbacks] - Callback objects for the function.
 * @param {Array} [options.parameters] - Parameters for the function.
 * @param {Object} [options.requestBody] - Request body configuration for the function.
 * @param {Array} [options.servers] - Server configurations for the function.
 */
export function registerFunction(
    name: string,
    summary: string,
    options: FunctionRouteConfig) {

    registerPath(name, summary, false, options);
}

/**
 * Registers a webhook function with the specified configuration.
 *
 * @param name - The name of the webhook.
 * @param summary - A summary of the webhook.
 * @param options - Configuration options for the webhook function.
 * 
 * @remarks
 * The `options` parameter should include the following properties:
 * - `handler`: The HTTP handler for the webhook.
 * - `methods`: An array of HTTP methods supported by the webhook.
 * - `authLevel`: The authorization level required to access the webhook ('anonymous', 'function', or 'admin').
 * - `security` (optional): An array of security requirements for the webhook.
 * - `azureFunctionRoutePrefix`: The route prefix for the Azure Function.
 * - `route`: The route for the webhook.
 * - `request` (optional): An object defining the request parameters, including body, params, query, cookies, and headers.
 * - `responses`: An object defining the possible responses from the webhook, keyed by status code.
 * - `description` (optional): A detailed description of the webhook.
 * - `tags` (optional): An array of tags associated with the webhook.
 * - `operationId` (optional): A unique identifier for the operation.
 * - `deprecated` (optional): A boolean indicating whether the webhook is deprecated.
 * - `externalDocs` (optional): External documentation for the webhook.
 * - `callbacks` (optional): Callback objects for the webhook.
 * - `parameters` (optional): Parameters for the webhook.
 * - `requestBody` (optional): Request body configuration for the webhook.
 * - `servers` (optional): Server configurations for the webhook.
 */
export function registerWebHook(
    name: string,
    summary: string,
    options: FunctionRouteConfig) {

    registerPath(name, summary, true, options);
}

/**
 * Registers a webhook function with the specified configuration.
 *
 * @param {string} name - The name of the webhook.
 * @param {string} summary - A summary of the webhook.
 * @param {FunctionRouteConfig} options - Configuration options for the webhook function.
 * @param {Function} options.handler - The HTTP handler for the webhook.
 * @param {HttpMethod[]} options.methods - An array of HTTP methods supported by the webhook.
 * @param {'anonymous' | 'function' | 'admin'} options.authLevel - The authorization level required to access the webhook.
 * @param {Array} [options.security] - An array of security requirements for the webhook.
 * @param {string} options.azureFunctionRoutePrefix - The route prefix for the Azure Function.
 * @param {string} options.route - The route for the webhook.
 * @param {Object} [options.request] - An object defining the request parameters, including body, params, query, cookies, and headers.
 * @param {Object} options.responses - An object defining the possible responses from the webhook, keyed by status code.
 * @param {string} [options.description] - A detailed description of the webhook.
 * @param {Array} [options.tags] - An array of tags associated with the webhook.
 * @param {string} [options.operationId] - A unique identifier for the operation.
 * @param {boolean} [options.deprecated] - A boolean indicating whether the webhook is deprecated.
 * @param {Object} [options.externalDocs] - External documentation for the webhook.
 * @param {Object} [options.callbacks] - Callback objects for the webhook.
 * @param {Array} [options.parameters] - Parameters for the webhook.
 * @param {Object} [options.requestBody] - Request body configuration for the webhook.
 * @param {Array} [options.servers] - Server configurations for the webhook.
 */
function registerPath(
    name: string,
    summary: string,
    isWebHook: boolean,
    options: FunctionRouteConfig) {

    app.http(name, {
        methods: options.methods,
        authLevel: options.authLevel,
        handler: options.handler,
        route: options.route
    });

    options.methods.forEach(method => {
        const routeConfig: RouteConfig = {
            summary: summary,
            method: mapHttpMethod(method),
            // Add the route to the OpenAPI registry, with the route prefix if it exists
            path: (options.azureFunctionRoutePrefix) ? `/${options.azureFunctionRoutePrefix}/${options.route}` : options.route,
            security: options.security,
            request: options.request,
            responses: options.responses,
            description: options.description,
            tags: options.tags,
            operationId: options.operationId,
            deprecated: options.deprecated,
            externalDocs: options.externalDocs,
            callbacks: options.callbacks,
            parameters: options.parameters,
            requestBody: options.requestBody,
            servers: options.servers
        };

        if (isWebHook)
            registry.registerWebhook(routeConfig);
        else
            registry.registerPath(routeConfig);
    });
}

function mapHttpMethod(method: HttpMethod): 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace' {
    switch (method) {
        case 'GET': return 'get';
        case 'POST': return 'post';
        case 'PUT': return 'put';
        case 'DELETE': return 'delete';
        case 'PATCH': return 'patch';
        case 'HEAD': return 'head';
        case 'OPTIONS': return 'options';
        case 'TRACE': return 'trace';
        default: return 'get'
    }
}