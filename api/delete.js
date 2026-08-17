import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    const { fileUrl } = req.body || {};
    if (!fileUrl || typeof fileUrl !== "string") {
      return res.status(400).json({ error: "Missing or invalid fileUrl" });
    }

    // Safely extract the file key from full URL or standalone path
    let fileName = "";
    try {
      const parsedUrl = new URL(fileUrl);
      fileName = parsedUrl.pathname.replace(/^\/+/, "");
    } catch {
      fileName = fileUrl.split("/").pop() || "";
    }

    // Strip path traversal sequences and query parameters
    fileName = decodeURIComponent(fileName).split("?")[0].replace(/\.\./g, "").trim();

    if (!fileName) {
      return res.status(400).json({ error: "Invalid filename extracted from URL" });
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME,
        Key: fileName,
      })
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("R2 delete error:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
}