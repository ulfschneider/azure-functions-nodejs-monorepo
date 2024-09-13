import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { app, HttpHandler, HttpMethod } from "@azure/functions";
import { registry } from "./registry";

/**
 * Registers an Azure Function with the given name and options into the Azure Functions application and the OpenAPI registry.
 * 
 * @param name - The name of the function.
 * @param options - Configuration options for the function.
 * @param options.handler - The HTTP handler for the function.
 * @param options.authLevel - The authorization level for the function ('anonymous', 'function', or 'admin').
 * @param options.route - The route configuration for the function.
 */
export function registerFunction(
    name: string,
    options: {
        handler: HttpHandler,
        authLevel: 'anonymous' | 'function' | 'admin',
        routePrefix: string,
        route: RouteConfig
    }) {

    app.http(name, {
        methods: [mapHttpMethod(options.route.method)],
        authLevel: options.authLevel,
        handler: options.handler,
        route: options.route.path
    });

    // Add the route to the OpenAPI registry, with the route prefix if it exists
    options.route.path = (options.routePrefix) ? `/${options.routePrefix}/${options.route.path}` : options.route.path;

    registry.registerPath(options.route);
}

function mapHttpMethod(method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace'): HttpMethod {
    switch (method) {
        case 'get': return 'GET';
        case 'post': return 'POST';
        case 'put': return 'PUT';
        case 'delete': return 'DELETE';
        case 'patch': return 'PATCH';
        case 'head': return 'HEAD';
        case 'options': return 'OPTIONS';
        case 'trace': return 'TRACE';
    }
}
