# @apvee/azure-functions-openapi

## Overview

`@apvee/azure-functions-openapi` is an extension for Azure Functions V4 that simplifies the process of integrating OpenAPI documentation. It automatically generates and serves OpenAPI 3.0 definitions and provides a Swagger UI for your Azure Functions. Built on top of `@asteasolutions/zod-to-openapi`, it uses Zod schemas for type-safe request validation and response handling, ensuring that your API is well-documented and easy to explore.

## Key Features

- **Automatic OpenAPI Specification Generation**: Generate OpenAPI 3.0 definitions for your Azure Functions based on registered schemas and handlers.
- **Integrated Swagger UI**: Serve a Swagger UI interface that dynamically loads and visualizes the OpenAPI definitions.
- **Type-Safe Request and Response Validation**: Leverage Zod schemas to validate request bodies, query parameters, headers, and more.
- **Flexible API Configuration**: Customize security schemas, routes, authentication levels, and request/response handling through simple utility functions.
- **Native Azure Functions Support**: Seamlessly integrates with Azure Functions V4 to enhance your serverless applications with robust API documentation.

## Installation

To install the package and its dependencies, run:

```bash
npm install @apvee/azure-functions-openapi
```

You'll also need the following peer dependencies:

```bash
npm install @azure/functions zod
```

## Exposing OpenAPI and Swagger UI

You can expose OpenAPI documentation and serve a Swagger UI interface using two key functions: `registerOpenAPI3Handler` and `registerSwaggerUIHandler`. These functions can be invoked from the `index.ts` file in the `src` directory of your Azure Functions project, making it easy to configure global behaviors for your functions.

### Expose OpenAPI Documentation

The `registerOpenAPI3Handler` function registers an HTTP GET handler that serves the OpenAPI 3.0 definition (e.g., `openapi.json`).

**Example (index.ts):**

```typescript
import { registerOpenAPI3Handler } from "@apvee/azure-functions-openapi";

registerOpenAPI3Handler({
    informations: {
        title: 'My API',
        version: '1.0.0',
        description: 'This is the API documentation',
    },
    security: [
        {
            ApiKeyAuth: [],
        },
    ],
    tags: [{ name: 'Users', description: 'Operations related to users' }],
    authLevel: 'anonymous',
});
```

This will expose the OpenAPI specification at the route `[routePrefix]/openapi.json`, which can be accessed by external tools like Swagger UI or Postman.

### Serve Swagger UI

The `registerSwaggerUIHandler` function registers an HTTP GET handler that serves a Swagger UI interface where developers can interact with the OpenAPI documentation.

**Example (index.ts):**

```typescript
import { registerSwaggerUIHandler } from "@apvee/azure-functions-openapi";

registerSwaggerUIHandler('anonymous', 'api');
```

This will serve the Swagger UI at the route `[routePrefix]/swagger-ui.html`, which dynamically loads the OpenAPI specification from `/[routePrefix]/openapi.json`.

### Example Workflow (index.ts)

Here’s how to expose both OpenAPI documentation and a Swagger UI interface in your Azure Functions API:

```typescript
import { registerOpenAPI3Handler, registerSwaggerUIHandler } from "@apvee/azure-functions-openapi";

// Expose OpenAPI documentation
registerOpenAPI3Handler({
    informations: {
        title: 'My API',
        version: '1.0.0',
        description: 'API for managing users and operations',
    },
    security: [{ ApiKeyAuth: [] }],
    tags: [{ name: 'Users', description: 'Operations related to users' }],
    authLevel: 'anonymous',
});

// Serve Swagger UI
registerSwaggerUIHandler('anonymous', 'api');
```

In this setup:
- The OpenAPI documentation is accessible at `/api/openapi.json`.
- The Swagger UI is available at `/swagger-ui.html`, allowing developers to explore and interact with the API.

## Usage

The core functionality of this package involves registering Azure Functions with OpenAPI documentation and validation. You can register custom security schemas, type schemas, and serve Swagger UI for easy API exploration.

### Registering an Azure Function

```typescript
import { z } from "zod";
import { registerFunction } from "@apvee/azure-functions-openapi";

// Define and register a function with OpenAPI documentation
registerFunction("myFunction", "Processes user data", {
    handler: async (req, ctx) => {
        const { name, age } = req.body;
        return {
            status: 200,
            jsonBody: { message: `User ${name} processed successfully` },
        };
    },
    methods: ['POST'],
    authLevel: 'anonymous',
    azureFunctionRoutePrefix: 'api',
    route: 'process-user',
    request: {
        body: { content: { "application/json": { schema: z.object({ name: z.string(), age: z.number() }) } } }
    },
    responses: {
        200: { description: "Success", content: { "application/json": { schema: z.object({ message: z.string() }) } } }
    }
});
```

## API Documentation

### `registerOpenAPI3Handler`

This function registers an HTTP GET handler in an Azure Function to serve the OpenAPI 3.0 definition (`openapi.json`).

**Parameters:**
- `informations`: Metadata for the OpenAPI document, such as the title, version, and description.
- `security`: Security requirements (e.g., API keys or OAuth).
- `externalDocs` (optional): Links to external documentation.
- `tags` (optional): Tags to group API operations.
- `authLevel`: Authentication level (`'anonymous'`, `'function'`, or `'admin'`).

**Example:**

```typescript
registerOpenAPI3Handler({
    informations: {
        title: 'My API',
        version: '1.0.0',
        description: 'This is my API documentation',
    },
    security: [{ apiKeyAuth: [] }],
    tags: [{ name: 'Users', description: 'Operations related to users' }],
    authLevel: 'anonymous',
});
```

### `registerSwaggerUIHandler`

This function registers an HTTP handler to serve the Swagger UI at `swagger-ui.html`.

**Parameters:**
- `authLevel`: Defines access level for Swagger UI (`'anonymous'`, `'function'`, or `'admin'`).
- `azureFunctionRoutePrefix`: The route prefix (defaults to `'api'`).

**Example:**

```typescript
registerSwaggerUIHandler('anonymous', 'api');
```

### `registerApiKeySecuritySchema`

This function registers an API key security schema for OpenAPI 3.0 documentation.

**Parameters:**
- `name`: The name of the API key (e.g., `X-API-KEY`).
- `input`: The location of the API key in the request (`'header'`, `'query'`, or `'cookie'`).

**Example:**

```typescript
const securityRequirement = registerApiKeySecuritySchema('X-API-KEY', 'header');
```

### `registerTypeSchema`

This function registers Zod schemas as named types in the OpenAPI registry.

**Parameters:**
- `typeName`: The name to register the schema under.
- `schema`: The Zod schema defining the structure.

**Example:**

```typescript
const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
});
registerTypeSchema('User', UserSchema);
```

### `registerFunction`

This function registers an Azure Function with OpenAPI documentation, including HTTP methods, request validation, and response handling.

**Parameters:**
- `name`: The name of the Azure Function.
- `description`: A description for the OpenAPI documentation.
- `options`: Configuration for the handler, HTTP methods, request validation, and responses.

**Example:**

```typescript
registerFunction("myFunction", "Processes user data", {
    handler: async (req, ctx) => {
        const { name, age } = req.body;
        return {
            status: 200,
            jsonBody: { message: `User ${name} processed successfully` },
        };
    },
    methods: ['POST'],
    authLevel: 'anonymous',
    azureFunctionRoutePrefix: 'api',
    route: 'process-user',
    request: {
        body: { content: { "application/json": { schema: z.object({ name: z.string(), age: z.number() }) } } }
    },
    responses: {
        200: { description: "Success", content: { "application/json": { schema: z.object({ message: z.string() }) } } }
    }
});
```

## Scripts

- **build**: Compiles TypeScript files to JavaScript.
- **clean**: Removes the `dist` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.