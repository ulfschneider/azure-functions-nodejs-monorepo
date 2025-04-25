import { registerTypeSchema } from "@ulfschneider/azure-functions-openapi";
import { z } from "zod";

export const TodoSchema = z.object({
    id: z.string().uuid().describe("UUID of the todo item"),
    title: z.string().describe("Title of the todo item"),
    description: z.string().describe("Description of the todo item"),
    isDone: z.boolean().describe("Is the todo item done"),
}).describe("The todo item");
export type Todo = z.infer<typeof TodoSchema>;
registerTypeSchema('Todo', TodoSchema);

export const TodoListSchema = z.array(TodoSchema).describe("List of todo items");
export type TodoList = z.infer<typeof TodoListSchema>;
registerTypeSchema('TodoList', TodoListSchema);

export const TodoParamIDSchema = z.object({
    id: z.string().uuid().describe("UUID of the todo item"),
}).describe("The todo item id");

export const NewTodoSchema = z.object({
    title: z.string().describe("Title of the todo item"),
    description: z.string().describe("Description of the todo item"),
}).describe("The todo item");
export type NewTodo = z.infer<typeof NewTodoSchema>;
registerTypeSchema('NewTodo', NewTodoSchema);

export const UpdateTodoSchema = z.object({
    isDone: z.boolean().describe("Is the todo item done"),
}).merge(NewTodoSchema).describe("The todo item");
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
registerTypeSchema('UpdateTodo', UpdateTodoSchema);
