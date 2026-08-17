// src/components/home/FeaturedProjects.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaSquare,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./FeaturedProjects.module.css";

export default function FeaturedProjects({
  projects = [],
  loading = false,
  onOpenModal,
}) {
  const featured = projects.slice(0, 3);

  return (
    <section className={styles.projectsPreview} aria-labelledby="featured-projects-title">
      <div className={styles.container}>
        {/* Header Block with Exact Original Typography Styles */}
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
              <span>Featured Work</span>
            </div>
            <h2 id="featured-projects-title" className={styles.splitTitle}>
              Our Completed Projects
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              Explore a selection of our architectural planning, 3D visualization, and structural engineering developments.
            </p>
          </div>
        </div>

        {/* Content Grid & State Handlers */}
        {loading ? (
          <div className={styles.statusBox} role="status">
            Loading featured work...
          </div>
        ) : featured.length === 0 ? (
          <div className={styles.statusBox}>
            No featured projects available.
          </div>
        ) : (
          <div className={styles.projectGrid}>
            {featured.map((project, idx) => {
              const cover = project.coverImage || project.cover_image || project.image;
              const projectId = project.id || project.slug || idx;

              return (
                <article
                  key={projectId}
                  className={styles.projectCard}
                  onClick={() => onOpenModal && onOpenModal(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenModal && onOpenModal(project);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View project details for ${project.title}`}
                >
                  {/* GPU-Accelerated Chamfered Image Stage */}
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={cover}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Equalized Content Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle} title={project.title}>
                      {project.title}
                    </h3>

                    <p className={styles.cardSummary}>
                      {project.summary || project.description}
                    </p>

                    {/* Single-Row Grid on Desktop, Stacked on Mobile */}
                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem} title={project.location || ""}>
                        <FaMapMarkerAlt className={styles.metaIcon} aria-hidden="true" />
                        <span>{project.location || "Location on Request"}</span>
                      </div>

                      {(project.duration || project.year) && (
                        <div className={styles.metaItem} title={project.duration || project.year}>
                          <FaClock className={styles.metaIcon} aria-hidden="true" />
                          <span>{project.duration || project.year}</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Link */}
                    <div className={styles.viewDetailBtn}>
                      <span>View More</span>
                      <FaArrowRight className={styles.linkArrow} aria-hidden="true" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View All Projects Action */}
        <div className={styles.viewAllWrapper}>
          <Link to="/projects" className={styles.viewAllBtn} aria-label="View All Projects Portfolio">
            <span>View All Projects</span>
            <FaArrowRight className={styles.btnArrow} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}