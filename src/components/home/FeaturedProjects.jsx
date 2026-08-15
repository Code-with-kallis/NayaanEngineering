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
    <section className={styles.projectsPreview}>
      <div className={styles.splitHeaderContainer}>
        <div className={styles.splitHeaderLeft}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} />
            <span>Featured Work</span>
          </div>
          <h2 className={styles.splitTitle}>Our Completed Projects</h2>
        </div>

        <div className={styles.splitHeaderRight}>
          <p className={styles.splitDesc}>
            Explore a selection of our architectural planning, 3D visualization, and structural engineering developments.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
          Loading featured work...
        </div>
      ) : featured.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
          No featured projects available.
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {featured.map((project) => {
            const cover = project.coverImage || project.cover_image || project.image;
            return (
              <article
                key={project.id || project.slug}
                className={styles.projectCard}
                onClick={() => onOpenModal(project)}
              >
                <div className={styles.cardImageWrapper}>
                  <img
                    src={cover}
                    alt={project.title}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardSummary}>
                    {project.summary || project.description}
                  </p>

                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <FaMapMarkerAlt className={styles.metaIcon} />
                      <span>{project.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <FaClock className={styles.metaIcon} />
                      <span>{project.duration || project.year}</span>
                    </div>
                  </div>

                  <button
                    className={styles.viewDetailBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal(project);
                    }}
                  >
                    <span>View Details</span>
                    <FaArrowRight className={styles.linkArrow} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className={styles.viewAllWrapper}>
        <Link to="/projects" className={styles.viewAllBtn}>
          <span>View All Projects</span>
          <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}