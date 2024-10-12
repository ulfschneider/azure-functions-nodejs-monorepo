import { randTextRange, randUuid } from '@ngneat/falso';
import { NewTodo, Todo, UpdateTodo } from '../models/todo';


/**
 * Fake Service to manage Todo items.
**/
export const TodoService = {
    addToDo: async (toDo: NewTodo): Promise<Todo> => {
        return Promise.resolve({
            id: randUuid(),
            ...toDo,
            isDone: false
        } as Todo);
    },
    updateTodo: async (id: string, todo: UpdateTodo): Promise<Todo> => {
        const todos = await TodoService.getToDoList();
        const oldTodo = todos.find(todo => todo.id === id);

        return Promise.resolve({
            ...oldTodo,
            ...todo,
        } as Todo
        );
    },
    getToDoList: async (): Promise<Todo[]> => {
        return Promise.resolve(
            [
                {
                    "id": "a11d5114-f15d-458b-979d-d5efebb70fe0",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "5a993fb8-5d4b-4735-8233-bbdab629048c",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "fa385b12-b7ac-42a2-a24b-552408fe2786",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": false
                },
                {
                    "id": "ed5197ec-3fe8-4f0c-ab8f-f5493632d386",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "fa1f3837-1f85-4063-b768-69468076df0f",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "7f96e799-9e2b-4210-9de0-e8cdef4518e5",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "432c61da-74da-4c23-8987-8a1bb5f2df04",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": true
                },
                {
                    "id": "f8b6c551-afb9-4b5f-ae57-cd11875655ef",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": false
                },
                {
                    "id": "47dc4261-95fa-4b4a-8c20-360fd4aaa8f8",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": false
                },
                {
                    "id": "992f0d65-9069-44f5-b225-2bba5b2dd894",
                    "title": randTextRange({ min: 10, max: 20 }),
                    "description": randTextRange({ min: 100, max: 200 }),
                    "isDone": false
                }
            ]
        );
    }
};