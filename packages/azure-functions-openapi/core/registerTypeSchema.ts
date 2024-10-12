import { z } from "zod";
import { registry } from "./registry";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * Registers a type schema with a given name.
 *
 * @param {string} typeName - The type name for the type schema.
 * @param {z.ZodTypeAny} schema - The type schema to be registered.
 */
export function registerTypeSchema(typeName: string, schema: z.ZodTypeAny) {
    registry.register(typeName, schema);
}