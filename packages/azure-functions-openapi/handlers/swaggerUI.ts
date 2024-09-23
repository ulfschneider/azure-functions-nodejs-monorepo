import { app, HttpMethod, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { IOpenAPIDocument } from "../core/types";

/**
 * Registers a SwaggerUI handler for Azure Functions.
 * 
 * @param authLevel - The authentication level required for the handler. Default is 'anonymous'.
 * @param azureFuntionRoutePrefix - The Azure Function route prefix for the handler. Default is 'api'.
 */
export function registerSwaggerUIHandler(authLevel: 'anonymous' | 'function' | 'admin' = 'anonymous', azureFuntionRoutePrefix: string | null = 'api', openAPIDocuments: IOpenAPIDocument[]): void {
    const fxHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Invoking SwaggerUI handler for url "${request.url}"`);

        const urls = openAPIDocuments.map(doc => {
            return {
                url: `/${azureFuntionRoutePrefix}/${doc.url}`,
                name: doc.title
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
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js" crossorigin></script>
            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js" crossorigin></script>
        </head>
        <body>
        <div id="swagger-ui"></div>
        <div id="swagger-ui"></div>
        <script>
            window.swaggerUI = SwaggerUIBundle({
                urls: ${JSON.stringify(urls)},
                dom_id: '#swagger-ui',
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
                "Content-Type": "text/html"
            }
        };
    };

    app.http('HandlerSwaggerUI', {
        methods: ['GET'],
        authLevel: authLevel,
        handler: fxHandler,
        route: `swagger-ui.html`
    });
}