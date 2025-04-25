import { convertURLSearchParamsToObject, registerFunction } from "@ulfschneider/azure-functions-openapi";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { apiKeySecurity } from "..";
import { ErrorResponse, ErrorResponseSchema } from "../models/errors";
import { FilterParamsSchema } from "../models/params";
import { TodoListSchema } from "../models/todo";
import { TodoService } from "../services/TodoService";

/**
 * Handles HTTP requests to retrieve a list of todos.
 *
 * @param request - The HTTP request object containing query parameters.
 * @param context - The invocation context providing logging and other utilities.
 * @returns A promise that resolves to an HTTP response with the list of todos or an error message.
 *
 * The function processes the request URL and extracts query parameters to filter the list of todos.
 * If the query parameters are valid, it retrieves the todo list from the service and returns a subset
 * based on the provided skip and limit parameters. If the query parameters are invalid, it returns
 * a 400 status with an error message.
 */
export async function GetAllTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    console.log('request.query', request.query);
    const filterParams = FilterParamsSchema.safeParse(convertURLSearchParamsToObject(request.query));

    if (filterParams.success) {
        const todos = await TodoService.getToDoList();
        const actualSkip = filterParams.data.skip ?? 0;
        const actualLimit = filterParams.data.limit ?? todos.length;
        const result = todos.slice(actualSkip, Math.min(todos.length, actualSkip + actualLimit));


        console.log('filterParams.data.skip', filterParams.data.skip);
        console.log('filterParams.data.limit', filterParams.data.limit);

        console.log('actualSkip', actualSkip);
        console.log('actualLimit', actualLimit);
        console.log('result', result);

        return { status: 200, jsonBody: result };
    }

    return { status: 400, jsonBody: { code: 400, message: filterParams.error.errors.map(err => `'${err.path}': ${err.message}`).join(', ') } as ErrorResponse };
};

registerFunction(
    'GetAllTodos',
    'Get All Todos',
    {
        handler: GetAllTodos,
        methods: ['GET'],
        authLevel: 'anonymous',
        security: [apiKeySecurity],
        azureFunctionRoutePrefix: 'api',
        route: 'todos',
        request: {
            query: FilterParamsSchema
        },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: TodoListSchema,
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
            }
        },
        tags: ['Todos'],
        description: 'Get all todos',
        operationId: 'GetAllTodos',
        deprecated: false
    })
