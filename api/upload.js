import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB (Vercel payload safety limit)

async function requireAdminAuth(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;

  const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL;
  if (adminEmail && data.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return null;
  }

  return data.user;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await requireAdminAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Admin access required" });
  }

  try {
    const { fileName, fileType, fileBase64 } = req.body || {};
    if (!fileName || !fileType || !fileBase64) {
      return res.status(400).json({ error: "Missing required fields (fileName, fileType, fileBase64)" });
    }

    if (!ALLOWED_MIME_TYPES.has(fileType.toLowerCase())) {
      return res.status(400).json({ error: "Invalid file type. Only standard images are allowed." });
    }

    const fileBuffer = Buffer.from(fileBase64, "base64");
    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({ error: "File size exceeds the 4.5 MB limit." });
    }

    // Sanitize filename to prevent path traversal and accidental overwrites
    const sanitizedBase = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedBase}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME,
        Key: uniqueFileName,
        Body: fileBuffer,
        ContentType: fileType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const publicDomain = (process.env.CF_PUBLIC_DOMAIN || "").replace(/\/+$/, "");
    return res.status(200).json({
      url: `${publicDomain}/${uniqueFileName}`,
    });
  } catch (err) {
    console.error("R2 upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}