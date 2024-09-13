import { ResponseConfig, RouteConfig, ZodRequestBody } from "@asteasolutions/zod-to-openapi";
import { app, HttpHandler, HttpMethod } from "@azure/functions";
import { registry } from "./registry";
import { RouteParameter } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import { ZodType } from "zod";

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
        methods: HttpMethod[];
        authLevel: 'anonymous' | 'function' | 'admin',
        routePrefix: string,
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
            method: mapHttpMethod(method),
            // Add the route to the OpenAPI registry, with the route prefix if it exists
            path: (options.routePrefix) ? `/${options.routePrefix}/${options.route}` : options.route,
            request: options.request,
            responses: options.responses
        };
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
