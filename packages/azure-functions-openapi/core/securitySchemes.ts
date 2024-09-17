import { OpenAPI3SecurityRequirementObject } from "./exports";
import { registry } from "./registry";

/**
 * Registers a security schema for API key authentication.
 * 
 * @param name - The name of the security schema.
 * @param input - The location of the API key in the request ('header', 'query', or 'cookie').
 */
export function registerApiKeySecuritySchema(name: string, input: 'header' | 'query' | 'cookie'): OpenAPI3SecurityRequirementObject {
    registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
        type: 'apiKey',
        name: name,
        in: input,
    });

    return { ApiKeyAuth: [name] };
}