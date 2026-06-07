import { validate_lesson, is_valid_schema } from "./validator";

interface LLMResponse {
    id: string;
    title: string;
    [key: string]: unknown;
}

const LLM_ATTEMPT_LIMITS = 3;

export const getLLMResponse = (prompt: string) : LLMResponse => {
    /* We want auto-retry mechanism here if the LLM does produce good results based on the validation
*  checks from our our `validation.ts` file.
*/

    let attemps = 0;

    return {
        id: "xyz",
        title: "..",
        scenes: []
    }
}
