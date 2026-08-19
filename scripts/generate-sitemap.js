import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// Automatically parse .env and .env.local without external packages
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_URL.startsWith("http")) {
  console.error("❌ Error: Valid VITE_SUPABASE_URL was not found in your .env or .env.local file.");
  console.error("Found value:", SUPABASE_URL);
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error("❌ Error: VITE_SUPABASE_ANON_KEY is missing in your .env or .env.local file.");
  process.exit(1);
}

const SITE_URL = "https://www.nayaabengineering.com";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escapeXml(unsafe = "") {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generateSitemap() {
  const currentDate = new Date().toISOString().split("T")[0];

  console.log("Fetching live projects from Supabase for sitemap generation...");

  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, slug, title, summary, description, location, category, cover_image, gallery_images, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const projectUrlNodes = (projects || [])
      .map((project) => {
        const cover = project.cover_image;
        const gallery = project.gallery_images || [];
        const uniqueImages = cover && !gallery.includes(cover) ? [cover, ...gallery] : gallery;

        const safeTitle = escapeXml(project.title || "Project Specification");
        const safeLoc = escapeXml(project.location || "Kashmir");
        const safeCategory = escapeXml(project.category || "Engineering");
        const safeCaption = escapeXml(project.summary || project.description || project.title || "");

        const imageTags = uniqueImages
          .map((imgUrl) => {
            const safeImgUrl = escapeXml(typeof imgUrl === "string" ? imgUrl : imgUrl?.url || "");
            if (!safeImgUrl) return "";

            return `
    <image:image>
      <image:loc>${safeImgUrl}</image:loc>
      <image:title>${safeTitle} - ${safeCategory} | ${safeLoc}</image:title>
      <image:caption>${safeCaption}</image:caption>
    </image:image>`;
          })
          .filter(Boolean)
          .join("");

        const projectDate = project.created_at
          ? new Date(project.created_at).toISOString().split("T")[0]
          : currentDate;

        return `  <!-- Project: ${safeTitle} -->
  <url>
    <loc>${SITE_URL}/projects#${project.slug || project.id}</loc>
    <lastmod>${projectDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>${imageTags}
  </url>`;
      })
      .join("\n\n");

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        
  <!-- Core Static Pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.00</priority>
  </url>

  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>

  <url>
    <loc>${SITE_URL}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>

  <!-- Dynamic Live Portfolio Projects & Visual Assets -->
${projectUrlNodes}
</urlset>`;

    const publicDir = path.resolve(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, "sitemap.xml");
    fs.writeFileSync(outputPath, sitemapContent.trim(), "utf-8");

    console.log(`✅ sitemap.xml generated successfully at: ${outputPath}`);
    console.log(`📊 Indexed ${projects?.length || 0} projects with full image metadata.`);
  } catch (err) {
    console.error("❌ Failed to generate sitemap.xml:", err);
    process.exit(1);
  }
}

generateSitemap();