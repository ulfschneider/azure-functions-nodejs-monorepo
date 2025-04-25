import { registerFunction } from "azure-functions-openapi";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { apiKeySecurity } from "..";
import { ErrorResponse, ErrorResponseSchema } from "../models/errors";
import { NewTodoSchema, TodoSchema } from "../models/todo";
import { TodoService } from "../services/TodoService";

/**
 * Handles the addition of a new to-do item.
 *
 * @param request - The HTTP request object containing the to-do data.
 * @param context - The invocation context for the Azure Function.
 * @returns A promise that resolves to an HTTP response indicating the result of the operation.
 *
 * The function processes the incoming request, validates the to-do data against the `NewTodoSchema`,
 * and if valid, adds the new to-do item using the `toDoService`. If the data is invalid, it returns
 * a 400 status with a detailed error message.
 */
export async function AddToDo(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const body = NewTodoSchema.safeParse(await request.json());

  if (body.success) {
    const newTodo = await TodoService.addToDo(body.data);
    return { status: 200, jsonBody: newTodo };
  }

  return {
    status: 400,
    jsonBody: {
      code: 400,
      message: body.error.errors
        .map((err) => `'${err.path}': ${err.message}`)
        .join(", "),
    } as ErrorResponse,
  };
}

registerFunction("AddToDo", "Add a new todo", {
  handler: AddToDo,
  methods: ["POST"],
  authLevel: "anonymous",
  security: [apiKeySecurity],
  azureFunctionRoutePrefix: "api",
  route: "todos",
  request: {
    body: {
      content: {
        "application/json": {
          schema: NewTodoSchema,
        },
      },
      description: "Object contains the new todo item",
      required: true,
    },
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: TodoSchema,
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
  tags: ["Todos"],
  description: "Add a new todo item",
  operationId: "addTodo",
  deprecated: false,
});
