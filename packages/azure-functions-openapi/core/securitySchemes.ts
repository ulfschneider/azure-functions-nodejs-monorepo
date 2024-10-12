import { SecurityRequirementObject } from "./types";
import { registry } from "./registry";

/**
 * Registers an API key security schema.
 *
 * @param {string} name - The name of the API key (e.g., 'X-API-KEY').
 * @param {'header' | 'query' | 'cookie'} input - The location of the API key in the request.
 * @returns {Object} The registered API key security schema.
 */
export function registerApiKeySecuritySchema(name: string, input: 'header' | 'query' | 'cookie'): SecurityRequirementObject {
    registry.registerComponent('securitySchemes', 'ApiKeyAuth', {
        type: 'apiKey',
        name: name,
        in: input,
    });

    return { ApiKeyAuth: [name] };
}