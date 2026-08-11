import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = import.meta.env.VITE_CF_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_CF_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_CF_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_CF_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = import.meta.env.VITE_CF_PUBLIC_DOMAIN;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Upload image to Cloudflare R2 with Custom Title-based Filename
export const uploadToCloudflareR2 = async (file, customFileName) => {
  const fileExt = file.name.split(".").pop();
  
  // Custom name agar passed hai to use karein, nahi to random name
  const fileName = customFileName
    ? `${customFileName}.${fileExt}`
    : `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Convert File object to Uint8Array for browser upload compatibility
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: file.type,
  });

  await r2Client.send(command);
  return `${R2_PUBLIC_DOMAIN}/${fileName}`;
};

// Delete image from Cloudflare R2
export const deleteFromCloudflareR2 = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") return;
  const fileName = fileUrl.split("/").pop();

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });
    await r2Client.send(command);
  } catch (err) {
    console.warn("Cloudflare R2 delete error:", err);
  }
};