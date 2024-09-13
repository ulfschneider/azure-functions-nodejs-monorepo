import { app, HttpMethod, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Registers a SwaggerUI handler for Azure Functions.
 * 
 * @param methods - The HTTP methods to allow for the handler. Default is ['GET'].
 * @param authLevel - The authentication level required for the handler. Default is 'anonymous'.
 * @param routePrefix - The route prefix for the handler. Default is 'api'.
 */
export function registerSwaggerUIHandler(methods: HttpMethod[] = ['GET'], authLevel: 'anonymous' | 'function' | 'admin' = 'anonymous', routePrefix: string | null = 'api') {
    const fxHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Invoking SwaggerUI handler for url "${request.url}"`);

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="SwaggerUI" />
            <title>SwaggerUI</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css" />
        </head>
        <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js" crossorigin></script>
        <script src="https://unpkg.com/swagger-ui-dist@latest/swagger-ui-standalone-preset.js" crossorigin></script>
        <script>
            window.onload = () => {
                window.ui = SwaggerUIBundle({
                    url: '/${routePrefix}/openapi.json',
                    dom_id: '#swagger-ui',
                    presets: [ SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset ],
                    layout: "StandaloneLayout"
                });
            };
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
        methods: methods,
        authLevel: authLevel,
        handler: fxHandler,
        route: `swagger-ui.html`
    });
}