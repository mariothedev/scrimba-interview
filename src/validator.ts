// validation.ts
// ---------------------------------------------------------------------------
// Validates the JSON a lesson-generating LLM returns against the vocabulary
// that public/main.js can actually render. The goal is NOT to police every
// prop value — it's to make sure no *unknown* element type or animation op
// slips through that the renderer would silently drop (console.warn + skip).
//
// Strict on:  the overall shape, every element `type`, every animation `op`.
// Lenient on: prop contents, coordinates, eases, durations, extra keys.
//
//   npm install zod   (tested against zod@4)
// ---------------------------------------------------------------------------
import * as z from "zod";

// ---------------------------------------------------------------------------
// Vocabulary — must stay in lockstep with main.js (createElement / addAnimation
// / startLoop) and the ELEMENT_TYPES / OPS lists. Add a string here whenever
// the engine learns a new word; remove one when it forgets it.
// ---------------------------------------------------------------------------
export const ELEMENT_TYPES = [
  "circle", "rect", "path", "arrow", "text",
  "box", "group", "particles", "arc", "axis", "graph",
] as const;

// discrete, per-beat ops (addAnimation)
export const ANIM_OPS = [
  "fadeIn", "fadeOut", "moveTo", "scale",
  "drawPath", "motionPath", "morph", "highlight", "countTo",
] as const;

// continuous / looping ops (startLoop — scene.ambient[] or animation.loop:true)
export const LOOP_OPS = ["pulse", "float", "drift", "sway", "spin", "twinkle"] as const;

// A beat animation may be either (op alone -> addAnimation, or loop:true ->
// startLoop), and ambient routes to startLoop. Either family is "known
// vocabulary", so we accept the union everywhere and only reject the truly
// unrecognized.
export const ALL_OPS = [...ANIM_OPS, ...LOOP_OPS] as const;

// ---------------------------------------------------------------------------
// Schema. z.object strips (does not reject) unknown keys, so extra fields are
// tolerated; z.looseObject keeps them. The two z.enum gates are what enforce
// the vocabulary.
// ---------------------------------------------------------------------------

// Recursive: a `group` carries child elements in props.children. The explicit
// z.ZodType annotation sidesteps TypeScript's circular-inference error.
const ElementSchema: z.ZodType = z.lazy(() =>
  z.object({
    id: z.string(),                 // needed for animation targeting
    type: z.enum(ELEMENT_TYPES),    // <-- vocabulary gate
    props: z
      .looseObject({
        // only `children` is given meaning; everything else passes through
        children: z.array(ElementSchema).optional(),
      })
      .optional(),
  })
);

// target + op are the only enforced fields; ease/at/to/duration/etc. ride along.
const AnimationSchema = z.looseObject({
  target: z.string(),
  op: z.enum(ALL_OPS),              // <-- vocabulary gate
});

const AmbientSchema = z.looseObject({
  target: z.string(),
  op: z.enum(ALL_OPS),             // intended for LOOP_OPS, but any known op is fine
});

const BeatSchema = z.object({
  narration: z.string().optional(),
  animations: z.array(AnimationSchema).optional(),
});

const SceneSchema = z.object({
  id: z.string(),
  background: z.string().optional(),
  atmosphere: z.looseObject({}).optional(),
  ambient: z.array(AmbientSchema).optional(),
  elements: z.array(ElementSchema).optional(),
  beats: z.array(BeatSchema).optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  background: z.string().optional(),
  scenes: z.array(SceneSchema).min(1), // main.js hard-requires >=1 scene
});

export type Lesson = z.infer<typeof LessonSchema>;

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

// The contract asks the model for raw JSON, but models love to wrap it in
// ```json fences. Strip a single leading/trailing fence so a well-formed
// lesson isn't failed on a cosmetic wrapper.
function stripFence(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

/**
 * True iff `llm_output` parses as JSON and uses only vocabulary main.js
 * understands. Never throws.
 */
export function is_valid_schema(llm_output: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripFence(llm_output));
  } catch {
    return false;
  }
  return LessonSchema.safeParse(parsed).success;
}

/**
 * Same check, but returns the parsed lesson on success or a flat list of
 * human-readable problems on failure. Useful for logging / regenerating.
 */
export function validate_lesson(
  llm_output: string
): { ok: true; lesson: Lesson } | { ok: false; errors: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripFence(llm_output));
  } catch (e) {
    return { ok: false, errors: [`invalid JSON: ${(e as Error).message}`] };
  }
  const result = LessonSchema.safeParse(parsed);
  if (result.success) return { ok: true, lesson: result.data };
  return {
    ok: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
    ),
  };
}
