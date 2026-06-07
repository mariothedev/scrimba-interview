import { Elysia, file } from "elysia";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
    // SAMPLE_AUDIO,
    MOCK
} from "./mock"

import { getLLMResponse } from "./inference";

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
    .get("/lesson/:query", async ({ params: { query } }) => {
        if (MOCK[query]) {
          return MOCK[query]
        } else {
           const res = await getLLMResponse(query)
           return res
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
    .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
