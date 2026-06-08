import prompts from "./prompts.yml";
import { validate_lesson, type Lesson } from "./validator";

const LLM_ATTEMPT_LIMITS = 3;
const MODEL = "gpt-5.4-2026-03-05";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

type Category = { match: string; prompt: string };
type Prompts = { shared: string; categories: Record<string, Category> };

function buildSystemPrompt(query: string): string {
    const { shared, categories } = prompts as Prompts;
    for (const [name, cat] of Object.entries(categories)) {
        if (name === "default") continue;
        if (new RegExp(cat.match, "i").test(query)) {
            return `${shared}\n\n${cat.prompt}`;
        }
    }
    return `${shared}\n\n${categories.default.prompt}`;
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    const t0 = performance.now();
    const res = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
        }),
    });

    if (!res.ok) {
        throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content ?? "";
    console.log(`[inference] OpenAI returned ${content.length} chars in ${Math.round(performance.now() - t0)}ms`);
    return content;
}

export async function getLLMResponse(query: string): Promise<Lesson> {
    console.log(`[inference] getLLMResponse query=${JSON.stringify(query)}`);
    const systemPrompt = buildSystemPrompt(query);
    let lastErrors: string[] = [];

    for (let attempt = 0; attempt < LLM_ATTEMPT_LIMITS; attempt++) {
        console.log(`[inference] attempt ${attempt + 1}/${LLM_ATTEMPT_LIMITS}`);
        const userPrompt =
            attempt === 0
                ? query
                : `${query}\n\nYour previous JSON failed validation with these errors:\n- ${lastErrors.join("\n- ")}\n\nReturn corrected JSON that conforms to the vocabulary.`;

        const raw = await callOpenAI(systemPrompt, userPrompt);
        await Bun.write("response.txt", raw);
        const result = validate_lesson(raw);
        if (result.ok) {
            console.log(`[inference] validated on attempt ${attempt + 1}: id=${result.lesson.id} scenes=${result.lesson.scenes.length}`);
            return result.lesson;
        }
        lastErrors = result.errors;
        console.warn(`[inference] attempt ${attempt + 1} failed validation:`, lastErrors);
    }

    throw new Error(
        `LLM failed validation after ${LLM_ATTEMPT_LIMITS} attempts: ${lastErrors.join("; ")}`
    );
}
