import { HttpRequestParams } from "@azure/functions";

/**
 * Converts an HttpRequestParams (Record<string, string>) object into a plain JavaScript object.
 * Since all values are strings, the result will have key-value pairs where both keys and values are strings.
 *
 * @param {HttpRequestParams} params - The HttpRequestParams object to be converted.
 * @returns {{ [key: string]: string }} - A plain object where keys and values are strings.
 */
export function convertHttpRequestParamsToObject(params: HttpRequestParams): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            // Directly assign each key-value pair since values are guaranteed to be strings
            result[key] = value;
        }
    }

    return result;
}

/**
 * Converts a URLSearchParams object into a plain JavaScript object.
 * If a key appears multiple times, the corresponding value will be an array of values.
 *
 * @param {URLSearchParams} params - The URLSearchParams object to be converted.
 * @returns {{ [key: string]: string | string[] }} - A plain object where keys are strings and values are either strings or arrays of strings.
 */
export function convertURLSearchParamsToObject(params: URLSearchParams): { [key: string]: string | string[] } {
    const result: { [key: string]: string | string[] } = {};

    params.forEach((value, key) => {
        // If the key already exists, convert the value to an array
        if (result[key]) {
            // If the existing value is already an array, push the new value
            if (Array.isArray(result[key])) {
                (result[key] as string[]).push(value);
            } else {
                // If the existing value is a string, convert it to an array
                result[key] = [result[key] as string, value];
            }
        } else {
            // If the key doesn't exist, add the key-value pair to the result
            result[key] = value;
        }
    });

    return result;
}