import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaSpinner,
  FaImages
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import styles from "./ProjectDetail.module.css";

const DEFAULT_DELIVERABLES = [
  "Full architectural & structural engineering compliance.",
  "On-time execution with continuous site supervision.",
  "High-durability structural material selection."
];

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const isNumericOrUuid = 
          !isNaN(Number(slug)) || 
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);

        let query = supabase.from("projects").select("*");

        if (isNumericOrUuid) {
          query = query.or(`slug.eq.${slug},id.eq.${slug}`);
        } else {
          query = query.eq("slug", slug);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("Supabase fetch error:", error);
          setProject(null);
        } else if (data) {
          setProject({
            id: data.id,
            title: data.title,
            slug: data.slug,
            category: data.category,
            location: data.location,
            duration: data.duration,
            summary: data.summary,
            description: data.description,
            deliverables: data.deliverables || [],
            coverImage: data.cover_image,
            galleryImages: data.gallery_images || []
          });
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching project detail:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <FaSpinner className={styles.spinnerIcon} />
        <span>Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Project Not Found</h2>
        <p>The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className={styles.backBtn}>
          <FaArrowLeft /> Back to All Projects
        </Link>
      </div>
    );
  }

  const cover = project.coverImage || project.cover_image || project.image;
  const rawGallery = project.galleryImages || project.gallery_images || project.gallery || [];
  const gallery = (cover && !rawGallery.includes(cover))
    ? [cover, ...rawGallery]
    : rawGallery;

  const projectDeliverables = (project.deliverables && project.deliverables.length > 0)
    ? project.deliverables
    : DEFAULT_DELIVERABLES;

  const shortOverview = project.summary || project.description;
  const detailedDescription = project.description && project.description !== project.summary 
    ? project.description 
    : null;

  return (
    <article className={styles.container}>
      <Link to="/projects" className={styles.backBtn}>
        <FaArrowLeft /> <span>Back to Projects</span>
      </Link>

      <header className={styles.header}>
        <span className={styles.categoryBadge}>{project.category || "Engineering"}</span>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.metaRow}>
          {project.location && (
            <div className={styles.metaItem}>
              <FaMapMarkerAlt className={styles.metaIcon} />
              <span>{project.location}</span>
            </div>
          )}
          {(project.duration || project.year) && (
            <div className={styles.metaItem}>
              <FaClock className={styles.metaIcon} />
              <span>{project.duration || `Completed in ${project.year}`}</span>
            </div>
          )}
        </div>
      </header>

      {cover && (
        <div className={styles.coverWrapper}>
          <img src={cover} alt={project.title} className={styles.coverImage} />
        </div>
      )}

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          {/* 1. OVERVIEW (ABOVE GALLERY) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <p className={styles.description}>{shortOverview}</p>
          </section>

          {/* 2. GALLERY (IN MIDDLE) */}
          {gallery.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaImages className={styles.sectionHeaderIcon} /> Project Gallery ({gallery.length})
              </h2>
              <div className={styles.galleryGrid}>
                {gallery.map((imgItem, idx) => {
                  const imgUrl = typeof imgItem === "string" ? imgItem : imgItem.url;
                  return (
                    <div key={idx} className={styles.galleryCard}>
                      <img src={imgUrl} alt={`${project.title} gallery ${idx + 1}`} loading="lazy" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. DETAILED DESCRIPTION (BELOW GALLERY) */}
          {detailedDescription && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Detailed Description</h2>
              <p className={styles.description}>{detailedDescription}</p>
            </section>
          )}

          {/* 4. KEY DELIVERABLES */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Deliverables</h2>
            <ul className={styles.deliverablesList}>
              {projectDeliverables.map((item, idx) => (
                <li key={idx} className={styles.deliverableItem}>
                  <FaCheckCircle className={styles.checkIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}