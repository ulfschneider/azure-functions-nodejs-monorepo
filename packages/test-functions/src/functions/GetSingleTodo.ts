import { convertHttpRequestParamsToObject, registerFunction } from "@apvee/azure-functions-openapi";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { apiKeySecurity } from "..";
import { ErrorResponse, ErrorResponseSchema } from "../models/errors";
import { TodoParamIDSchema, TodoSchema } from "../models/todo";
import { TodoService } from "../services/TodoService";

/**
 * Handles an HTTP request to retrieve a single Todo item by its ID.
 *
 * @param request - The HTTP request object containing parameters and other request data.
 * @param context - The invocation context providing logging and other context-specific functionality.
 * @returns A promise that resolves to an HTTP response object. The response contains:
 * - A status code of 200 and the requested Todo item in the body if found.
 * - A status code of 404 and an error message if the Todo item is not found.
 * - A status code of 400 and an error message if the request parameters are invalid.
 */
export async function GetSingleTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const params = TodoParamIDSchema.safeParse(convertHttpRequestParamsToObject(request.params));

    if (params.success) {
        const todos = await TodoService.getToDoList();
        const todo = todos.find(todo => todo.id === params.data.id);

        if (!todo) {
            return { status: 404, jsonBody: { code: 404, message: 'Todo not found' } as ErrorResponse };
        } else {
            return { status: 200, jsonBody: todo };
        }
    }

    return { status: 400, jsonBody: { code: 400, message: params.error.errors.map(err => `'${err.path}': ${err.message}`).join(', ') } as ErrorResponse };
};

registerFunction(
    'GetSingleTodo',
    'Get Single Todo',
    {
        handler: GetSingleTodo,
        methods: ['GET'],
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
        description: 'Get single todo',
        operationId: 'GetSingleTodo',
        deprecated: false
    })