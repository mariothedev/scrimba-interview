import { store_audio_in_bucket, public_url_for } from "./storage";
import type { Lesson } from "./validator";

const ELEVEN_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const ELEVEN_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_turbo_v2_5";
const ELEVENLABS_CONCURRENCY = 6;
const ELEVENLABS_MAX_RETRIES = 3;

interface Narration {
    lessonId: string;
    index: number;
    text: string;
    beatRef: { audio?: AudioMeta };
}

interface AudioMeta {
    url: string;
    duration: number;
    words: { word: string; start: number }[];
}

// Walk every beat in the lesson and collect its narration, paired with a
// reference back to the beat so we can inject the audio metadata in place.
const extract_narrations = (lesson: Lesson): Narration[] => {
    const out: Narration[] = [];
    let count = 0;
    for (const scene of lesson.scenes ?? []) {
        for (const beat of scene.beats ?? []) {
            if (!beat.narration) continue;
            out.push({
                lessonId: lesson.id,
                index: count++,
                text: beat.narration,
                beatRef: beat as { audio?: AudioMeta },
            });
        }
    }
    return out;
};

interface ElevenAlignment {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
}

interface ElevenResponse {
    audio_base64: string;
    alignment: ElevenAlignment | null;
    normalized_alignment?: ElevenAlignment | null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryDelayMs = (retryAfter: string | null, attempt: number): number => {
    if (retryAfter) {
        const seconds = Number(retryAfter);
        if (Number.isFinite(seconds)) return seconds * 1000;
        const dateMs = Date.parse(retryAfter);
        if (Number.isFinite(dateMs)) return Math.max(0, dateMs - Date.now());
    }
    return Math.min(8000, 500 * 2 ** attempt) + Math.floor(Math.random() * 250);
};

const mapLimitSettled = async <T>(
    items: T[],
    limit: number,
    worker: (item: T) => Promise<void>
): Promise<PromiseSettledResult<void>[]> => {
    const results = new Array<PromiseSettledResult<void>>(items.length);
    let next = 0;

    const run = async () => {
        while (next < items.length) {
            const i = next++;
            try {
                await worker(items[i]);
                results[i] = { status: "fulfilled", value: undefined };
            } catch (reason) {
                results[i] = { status: "rejected", reason };
            }
        }
    };

    const concurrency = Math.min(Math.max(1, limit), items.length);
    await Promise.all(Array.from({ length: concurrency }, run));
    return results;
};

// Convert ElevenLabs' character-level alignment into the word-start map the
// renderer uses for `at: { word: "..." }` anchoring.
const buildWords = (alignment: ElevenAlignment | null): { words: { word: string; start: number }[]; duration: number } => {
    if (!alignment || !alignment.characters?.length) return { words: [], duration: 0 };
    const words: { word: string; start: number }[] = [];
    let buf = "";
    let wordStart = alignment.character_start_times_seconds[0] ?? 0;
    for (let i = 0; i < alignment.characters.length; i++) {
        const ch = alignment.characters[i];
        if (/\s/.test(ch)) {
            if (buf) {
                words.push({ word: buf, start: wordStart });
                buf = "";
            }
            wordStart = alignment.character_start_times_seconds[i + 1] ?? wordStart;
        } else {
            if (!buf) wordStart = alignment.character_start_times_seconds[i] ?? wordStart;
            buf += ch;
        }
    }
    if (buf) words.push({ word: buf, start: wordStart });
    const duration =
        alignment.character_end_times_seconds[alignment.character_end_times_seconds.length - 1] ?? 0;
    return { words, duration };
};

const generateTTSForNarration = async (text: string): Promise<{ audio: ArrayBuffer; meta: { duration: number; words: { word: string; start: number }[] } }> => {
    let lastError = "";

    for (let attempt = 0; attempt <= ELEVENLABS_MAX_RETRIES; attempt++) {
        const res = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}/with-timestamps`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY!,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    text,
                    model_id: ELEVEN_MODEL_ID,
                    output_format: "mp3_44100_128",
                }),
            }
        );

        if (res.ok) {
            const data = (await res.json()) as ElevenResponse;
            const audio = Buffer.from(data.audio_base64, "base64");
            const meta = buildWords(data.normalized_alignment ?? data.alignment);
            return { audio: audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength), meta };
        }

        lastError = `ElevenLabs ${res.status}: ${await res.text()}`;
        if (res.status !== 429 || attempt === ELEVENLABS_MAX_RETRIES) break;

        const delayMs = retryDelayMs(res.headers.get("Retry-After"), attempt);
        console.warn(`[tts] ElevenLabs 429, retrying in ${Math.round(delayMs)}ms`);
        await sleep(delayMs);
    }

    throw new Error(lastError);
};

// Generates audio for every narration in `lesson`, uploads each MP3 to the
// bucket at `<lesson.id>/<n>.mp3`, and mutates the lesson so each beat has
// `audio: { url, duration, words }`. A failure on one narration is logged but
// does not block the rest — the beat falls back to renderer-estimated timing.
const generate_and_attach_audio = async (lesson: Lesson): Promise<Lesson> => {
    const narrations = extract_narrations(lesson);
    console.log(`[tts] ${narrations.length} narrations for lesson id=${lesson.id}`);
    const t0 = performance.now();

    const results = await mapLimitSettled(
        narrations,
        ELEVENLABS_CONCURRENCY,
        async (n) => {
            const tn = performance.now();
            const { audio, meta } = await generateTTSForNarration(n.text);
            console.log(`[tts]   #${n.index} synth ok (${Math.round(meta.duration * 100) / 100}s, ${meta.words.length} words) in ${Math.round(performance.now() - tn)}ms`);
            const key = `${n.lessonId}/${n.index}.mp3`;
            const tu = performance.now();
            await store_audio_in_bucket(key, audio);
            console.log(`[tts]   #${n.index} uploaded ${key} in ${Math.round(performance.now() - tu)}ms`);
            n.beatRef.audio = {
                url: public_url_for(key),
                duration: meta.duration,
                words: meta.words,
            };
        }
    );

    const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
    for (const f of failed) console.error("[tts]   narration failed:", f.reason);
    console.log(`[tts] done in ${Math.round(performance.now() - t0)}ms (ok=${results.length - failed.length} failed=${failed.length})`);

    return lesson;
};

export { extract_narrations, generate_and_attach_audio };
