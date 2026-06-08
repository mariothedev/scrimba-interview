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

const store_audio_in_bucket = async (key: string, fileBuffer: ArrayBuffer) => {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: "audio/mpeg",
    }));
}

// Supabase exposes public-bucket objects at /storage/v1/object/public/<bucket>/<key>
// while S3 writes go through /storage/v1/s3.
const public_url_for = (key: string): string => {
    const endpoint = process.env.S3_ENDPOINT!;
    const bucket = process.env.S3_BUCKET!;
    const base = endpoint.replace(/\/storage\/v1\/s3\/?$/, "/storage/v1/object/public");
    return `${base}/${bucket}/${key}`;
}

export { store_audio_in_bucket, public_url_for }
