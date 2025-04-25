import { registerTypeSchema } from "azure-functions-openapi";
import { z } from "zod";

export const ErrorResponseSchema = z
  .object({
    code: z.number().int().describe("The error code"),
    message: z.string().describe("The error message"),
  })
  .describe("The error response");
registerTypeSchema("ErrorResponse", ErrorResponseSchema);

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
