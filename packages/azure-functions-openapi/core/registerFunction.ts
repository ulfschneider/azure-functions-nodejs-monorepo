import { ResponseConfig, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { app, HttpHandler, HttpMethod } from "@azure/functions";
import { ZodType } from "zod";
import { OpenAPI3SecurityRequirementObject, RouteParameter, ZodRequestBody } from "./exports";
import { registry } from "./registry";

/**
 * Registers an Azure Function with the specified configuration.
 *
 * @param name - The name of the function to register.
 * @param options - The configuration options for the function.
 * @param options.handler - The HTTP handler for the function.
 * @param options.methods - An array of HTTP methods that the function responds to.
 * @param options.authLevel - The authorization level for the function. Can be 'anonymous', 'function', or 'admin'.
 * @param options.azureFuntionRoutePrefix - The route prefix for the Azure Function.
 * @param options.route - The specific route for the function.
 * @param options.request - Optional request configuration.
 * @param options.request.body - Optional schema for the request body.
 * @param options.request.params - Optional schema for route parameters.
 * @param options.request.query - Optional schema for query parameters.
 * @param options.request.cookies - Optional schema for cookies.
 * @param options.request.headers - Optional schema for headers.
 * @param options.responses - A mapping of response status codes to their configurations.
 * @returns void
 */
export function registerFunction(
    name: string,
    description: string,
    options: {
        handler: HttpHandler,
        methods: HttpMethod[];
        authLevel: 'anonymous' | 'function' | 'admin',
        security?: OpenAPI3SecurityRequirementObject[],
        azureFuntionRoutePrefix: string,
        route: string,
        request?: {
            body?: ZodRequestBody;
            params?: RouteParameter;
            query?: RouteParameter;
            cookies?: RouteParameter;
            headers?: RouteParameter | ZodType<unknown>[];
        };
        responses: {
            [statusCode: string]: ResponseConfig;
        };
    }) {

    app.http(name, {
        methods: options.methods,
        authLevel: options.authLevel,
        handler: options.handler,
        route: options.route
    });

    options.methods.forEach(method => {
        const routeConfig: RouteConfig = {
            summary: description,
            security: options.security,
            method: mapHttpMethod(method),
            // Add the route to the OpenAPI registry, with the route prefix if it exists
            path: (options.azureFuntionRoutePrefix) ? `/${options.azureFuntionRoutePrefix}/${options.route}` : options.route,
            request: options.request,
            responses: options.responses
        };

        routeConfig.security

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