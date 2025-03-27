import { convertHttpRequestParamsToObject, registerFunction } from "@apvee/azure-functions-openapi";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { apiKeySecurity } from "..";
import { ErrorResponse, ErrorResponseSchema } from "../models/errors";
import { TodoParamIDSchema, TodoSchema, UpdateTodoSchema } from "../models/todo";
import { TodoService } from "../services/TodoService";

/**
 * Handles the HTTP request to update a ToDo item.
 * 
 * @param request - The HTTP request object containing the request details.
 * @param context - The invocation context providing information about the function execution.
 * @returns A promise that resolves to an HTTP response with the updated ToDo item or an error message.
 * 
 * The function performs the following steps:
 * 1. Logs the request URL and method.
 * 2. Extracts and validates the request parameters using `ToDoParamIDSchema`.
 * 3. Parses and validates the request body using `UpdateTodoSchema`.
 * 4. If both the parameters and body are valid, it updates the ToDo item using `toDoService.updateTodo`.
 * 5. Returns a 200 status with the updated ToDo item if successful.
 * 6. Returns a 400 status with an error message if validation fails.
 */
export async function UpdateTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}" and method "${request.method}"`);

    const params = TodoParamIDSchema.safeParse(convertHttpRequestParamsToObject(request.params));
    const body = UpdateTodoSchema.safeParse(await request.json());

    if (params.success && body.success) {
        const todo = await TodoService.updateTodo(params.data.id, body.data);

        return { status: 200, jsonBody: todo };
    }

    return {
        status: 400, jsonBody: {
            code: 400,
            message: `${params.error?.errors.map(err => `'${err.path}': ${err.message}`).join(', ')}, ${body.error?.errors.map(err => `'${err.path}': ${err.message}`).join(', ')}`
        } as ErrorResponse
    };
};

registerFunction(
    'UpdateTodo',
    'Update Single Todo',
    {
        handler: UpdateTodo,
        methods: ['PUT', 'PATCH'],
        authLevel: 'anonymous',
        security: [apiKeySecurity],
        azureFunctionRoutePrefix: 'api',
        route: 'todos/{id}',
        request: {
            params: TodoParamIDSchema,
            body: {
                content: {
                    'application/json': {
                        schema: UpdateTodoSchema,
                    },
                },
                description: 'Object contains the todo item to update',
                required: true
            }
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
        description: 'Update single todo',
        operationId: 'UpdateTodo',
        deprecated: false
    })