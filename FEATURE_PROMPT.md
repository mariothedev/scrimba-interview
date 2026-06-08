You're a Full-Stack developer. Your task is to complete the following features:

# Features

## 1. LLM lesson

LLM auto-retry endpoint that uses the `OPENAI_API_KEY` env variable to make a network call to OpenAI's GPT model: 'gpt-5.4-2026-03-05' using the following prompt found in `src/prompt.yml`.
Files to look at: 
```
src/inference.ts
src/prompts.yml
src/validator.ts
src/vocabulary.ts
```

Now, the retry should be fired on the validation (Zod) file `src/validator.ts` which basically adheres the vocabulary found in 'src/vocabulary.ts'. Which is basically the vocabulary used for the following four libraries: 
```
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsparticles/slim@3/tsparticles.slim.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/elkjs@0/lib/elk.bundled.js"></script>
```

## 2. TTS generation and bucket storage

Use the env variable `ELEVENLABS_API_KEY` to generate speech for the `narration` property inside the `beats` object (look at `mock.ts`) using ElevenLabs API.

The TTS generated should be stored using the following file: `src/storage.ts`. So that we store based on `id`, ex:
```
{id}/{count}.mp3
why-is-the-sky-blue/0.mp3
why-is-the-sky-blue/1.mp3
why-is-the-sky-blue/2.mp3
why-is-the-sky-blue/3.mp3
...
```

Files to look: 
```
src/mock.ts
src/tts.ts
src/storage.ts
```

# Goal

The endgoal should be to inference the model with our prompt, get a response from the LLM, call the TTS model, store the TTS results in our S3 bucket (see: `src/storage.ts`) and inject the location in the final output, ex:
```
...
beats: [
    {
        narration: "Sunlight looks white.",
        audio: URL_LOCATION_HERE_NARRATION // "Sunlight looks white."
        animations: [
            { target: "sun", op: "fadeIn", at: 0.2, duration: 0.6 },
            { target: "ray", op: "drawPath", at: 0.9, duration: 1.0 },
        ],
    },
    ...
```
