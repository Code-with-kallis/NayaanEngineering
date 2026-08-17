// src/lib/cloudflareR2.js
import { supabase } from "./supabaseClient";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadToCloudflareR2 = async (file, customFileName) => {
  const fileExt = file.name.split(".").pop();
  const fileName = customFileName
    ? `${customFileName}.${fileExt}`
    : `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const fileBase64 = await fileToBase64(file);
  const authHeader = await getAuthHeader();

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify({ fileName, fileType: file.type, fileBase64 }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to Cloudflare R2");
  }

  const { url } = await response.json();
  return url;
};

export const deleteFromCloudflareR2 = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") return;

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ fileUrl }),
    });
    if (!response.ok) {
      console.warn("Cloudflare R2 delete error:", await response.text());
    }
  } catch (err) {
    console.warn("Cloudflare R2 delete error:", err);
  }
};