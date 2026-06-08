import { Elysia, file } from "elysia";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
    // SAMPLE_AUDIO,
    MOCK
} from "./mock"

import { getLLMResponse } from "./inference";
import { generate_and_attach_audio } from "./tts";
import {Lesson}  from "./validator";

// await Bun.build({
//   entrypoints: ["src/types.ts"],
//   outdir: "public",
//   target: "browser",
// });
//
//
/* 
 *
 *  YOUR CODE HERE
 */


const app = new Elysia()
    .get("/", () => file('public/index.html'))
    .get("/main.js", () => file("public/main.js"))
    .get("/Gradient.js", () => file("public/Gradient.js"))
    .get("/lesson/:query", async ({ params: { query }, set }) => {
        const t0 = performance.now();
        console.log(`[lesson] -> ${query}`);
        if (MOCK[query]) {
          console.log(`[lesson] mock hit`);
          return MOCK[query]
        }
        try {
           const lesson: Lesson = await getLLMResponse(query)
           const enriched = await generate_and_attach_audio(lesson)
           console.log(`[lesson] <- ${query} in ${Math.round(performance.now() - t0)}ms`)
           return enriched
        } catch (err) {
           console.error(`[lesson] !! ${query} failed after ${Math.round(performance.now() - t0)}ms`, err)
           set.status = 500
           return { error: (err as Error).message }
        }
    })
    // TESTING ONLY
    // .get("/upload", async () => {
    //     const fileBuffer = await Bun.file("public/sample.mp3").arrayBuffer();
    //
    //     await s3.send(new PutObjectCommand({
    //       Bucket: process.env.S3_BUCKET,
    //       Key: "sample.mp3",
    //       Body: Buffer.from(fileBuffer),
    //       ContentType: "audio/mpeg",
    //     }));
    //
    //     // Ok, let's keep it minimal. don't worry about styling/css. Just have the structure in place.  core html and js only. Now, ever
    //
    //     // https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/sample.mp3
    //
    //     return { success: true, key: "sample.mp3" };     
    // })
    .listen({ port: 3001, idleTimeout: 60 }); // 60s = Bun's max; default 10s closes long LLM requests mid-flight and triggers Chrome auto-retry

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
