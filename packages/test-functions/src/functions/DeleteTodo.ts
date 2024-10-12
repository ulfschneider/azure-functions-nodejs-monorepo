import { convertHttpRequestParamsToObject, registerFunction } from "@apvee/azure-functions-openapi";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { apiKeySecurity } from "..";
import { ErrorResponse, ErrorResponseSchema } from "../models/errors";
import { TodoParamIDSchema, TodoSchema } from "../models/todo";

/**
 * Handles the deletion of a ToDo item.
 *
 * @param request - The HTTP request object containing the parameters for the ToDo item to be deleted.
 * @param context - The invocation context which provides logging and other context-specific information.
 * @returns A promise that resolves to an HTTP response indicating the result of the deletion operation.
 *
 * The function processes the request URL and validates the parameters using `ToDoParamIDSchema`.
 * If the parameters are valid, it returns a 200 status code.
 * If the parameters are invalid, it returns a 400 status code with a JSON body containing error details.
 */
export async function DeleteTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const params = TodoParamIDSchema.safeParse(convertHttpRequestParamsToObject(request.params));

    if (params.success) {
        return { status: 200 };
    }

    return { status: 400, jsonBody: { code: 400, message: params.error.errors.map(err => `'${err.path}': ${err.message}`).join(', ') } as ErrorResponse };
};

registerFunction(
    'DeleteTodo',
    'Delete Single Todo',
    {
        handler: DeleteTodo,
        methods: ['DELETE'],
        authLevel: 'anonymous',
        security: [apiKeySecurity],
        azureFuntionRoutePrefix: 'api',
        route: 'todos/{id}',
        request: {
            params: TodoParamIDSchema
        },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: TodoSchema,
                    }
                }
            },
            400: {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema
                    }
                }
            },
            404: {
                description: 'Not Found',
                content: {
                    'application/json': {
                        schema: ErrorResponseSchema
                    }
                }
            }
        },
        tags: ['Todos'],
        description: 'Delete single todo',
        operationId: 'DeleteTodo',
        deprecated: false
    })