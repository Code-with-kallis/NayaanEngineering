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
  const featured = projects.slice(0, 6);

  return (
    <section className={styles.projectsPreview} aria-labelledby="featured-projects-title">
      <div className={styles.container}>
        {/* Header Lockup */}
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
              <span>Featured Portfolio</span>
            </div>
            <h2 id="featured-projects-title" className={styles.splitTitle}>
              Completed Projects
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              A curated selection of our architectural planning, structural engineering, and precision construction developments.
            </p>
          </div>
        </div>

        {/* Content Grid & State Handlers */}
        {loading ? (
          <div className={styles.statusBox} role="status">
            Loading featured portfolio...
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
                  {/* Geometric Clipped Image Stage */}
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={cover}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={styles.imageOverlay} />
                  </div>

                  {/* Content Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle} title={project.title}>
                      {project.title}
                    </h3>

                    <p className={styles.cardSummary}>
                      {project.summary || project.description}
                    </p>

                    {/* Metadata Lockup */}
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

                    {/* Action Footer */}
                    <div className={styles.viewDetailBtn}>
                      <span>Explore Project</span>
                      <div className={styles.arrowCircle}>
                        <FaArrowRight className={styles.linkArrow} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Section Footer / View All CTA */}
        <div className={styles.viewAllWrapper}>
          <Link to="/projects" className={styles.viewAllBtn} aria-label="View All Projects Portfolio">
            <span>View All Projects</span>
            <span className={styles.btnArrow}>
              <FaArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}