import { Elysia, file } from "elysia";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const app = new Elysia()
    .get("/", file('public/index.html'))
    .get("/main.js", file("public/main.js"))
    // TESTING ONLY
    .get("/upload", async () => {
        const fileBuffer = await Bun.file("public/sample.mp3").arrayBuffer();

        await s3.send(new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: "sample.mp3",
          Body: Buffer.from(fileBuffer),
          ContentType: "audio/mpeg",
        }));

        // https://xfvfyrhfznslcbregmou.supabase.co/storage/v1/object/public/scrimba-interview/sample.mp3

        return { success: true, key: "sample.mp3" };     
    })
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
