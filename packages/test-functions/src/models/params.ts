import { registerTypeSchema } from "@ulfschneider/azure-functions-openapi";
import { z } from "zod";

export const FilterParamsSchema = z.object({
    limit: z.coerce.number().int().positive().default(10).describe("The number of items to return"),
    skip: z.coerce.number().int().nonnegative().default(0).describe("The number of items to skip")
}).describe("The todo item");
registerTypeSchema('FilterParams', FilterParamsSchema);

export type FilterParams = z.infer<typeof FilterParamsSchema>;
