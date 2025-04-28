import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { OpenAPIDocumentInfo, SwaggerUIConfig } from "../core/types";
import path from "path";

/**
 * Registers a Swagger UI handler for an Azure Function.
 *
 * @param {'anonymous' | 'function' | 'admin'} authLevel - The authorization level required to access the Swagger UI.
 * @param {string} azureFunctionRoutePrefix - The route prefix for the Azure Function. Defaults to 'api'.
 * @param {OpenAPIDocumentInfo[]} openAPIDocuments - An array of OpenAPI document information objects to be included in the Swagger UI.
 * @param {SwaggerUIConfig} swaggerUIConfig - The settings for the Swagger UI. Defaults to { location: 'https://unpkg.com/swagger-ui-dist/', route: 'swagger-ui.html' }.
 *
 * This function sets up an HTTP GET handler that serves a Swagger UI page, which lists the provided OpenAPI documents.
 * The Swagger UI is configured to use the provided URLs and titles for the OpenAPI documents.
 */
export function registerSwaggerUIHandler(
  authLevel: "anonymous" | "function" | "admin" = "anonymous",
  azureFunctionRoutePrefix: string | null = "api",
  openAPIDocuments: OpenAPIDocumentInfo[],
  swaggerUIConfig?: SwaggerUIConfig
): void {
  const defaultSwaggerUIConfig: SwaggerUIConfig = {
    location: "https://unpkg.com/swagger-ui-dist/",
    route: "swagger-ui.html",
    validatorUrl: "https://validator.swagger.io/validator",
  };
  const swaggerConfig = Object.assign(defaultSwaggerUIConfig, swaggerUIConfig);

  const fxHandler = async (
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> => {
    context.log(`Invoking SwaggerUI handler for url "${request.url}"`);

    if (swaggerConfig.location && !swaggerConfig.location.endsWith("/")) {
      swaggerConfig.location += "/";
    }

    const urls = openAPIDocuments.map((doc) => {
      return {
        url: `/${azureFunctionRoutePrefix}/${doc.url}`,
        name: doc.title,
      };
    });

    const html = `
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="SwaggerUI" />
            <title>SwaggerUI</title>
            <link rel="stylesheet" type="text/css" href="${
              swaggerConfig.location
            }swagger-ui.css" />
            <script src="${
              swaggerConfig.location
            }swagger-ui-bundle.js" crossorigin></script>
            <script src="${
              swaggerConfig.location
            }swagger-ui-standalone-preset.js" crossorigin></script>
        </head>
        <body>
        <div id="swagger-ui"></div>
        <div id="swagger-ui"></div>
        <script>
            window.swaggerUI = SwaggerUIBundle({
                urls: ${JSON.stringify(urls)},
                dom_id: '#swagger-ui',
                validatorUrl : '${
                  swaggerConfig.validatorUrl
                    ? swaggerConfig.validatorUrl
                    : "none"
                }',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                layout: "StandaloneLayout"
            });
        </script>
        </body>
        </html>`;

    context.log(`SwaggerUI generated successfully`);

    return {
      status: 200,
      body: html,
      headers: {
        "Content-Type": "text/html",
      },
    };
  };

  app.http("X_HandlerSwaggerUI", {
    methods: ["GET"],
    authLevel: authLevel,
    handler: fxHandler,
    route: swaggerConfig.route,
  });
}
