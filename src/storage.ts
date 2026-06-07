import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const store_audio_in_bucket = async (id: string, fileBuffer: ArrayBuffer) => {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: id,
      Body: Buffer.from(fileBuffer),
      ContentType: "audio/mpeg",
    }));
}


export { store_audio_in_bucket }
