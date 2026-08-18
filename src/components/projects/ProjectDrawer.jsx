import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaShareAlt, 
  FaCheck, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle 
} from "react-icons/fa";
import ProjectGallery from "./ProjectGallery";
import styles from "./ProjectDrawer.module.css";

const DEFAULT_DELIVERABLES = [
  "Full architectural & structural engineering compliance.",
  "On-time execution with continuous site supervision.",
  "High-durability structural material selection."
];

// Clean Case Study Renderer
const renderSmartCaseStudy = (content) => {
  if (!content) return null;

  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  return lines.map((line, idx) => {
    const cleanLine = line.replace(/^[•\-\*\d+\.]\s*/, "").trim();
    const colonIndex = cleanLine.indexOf(":");

    if (colonIndex !== -1 && colonIndex < 35 && !cleanLine.includes("http")) {
      const label = cleanLine.slice(0, colonIndex).trim();
      const value = cleanLine.slice(colonIndex + 1).trim();
      return (
        <p key={idx} className={styles.caseStudyPara}>
          <strong className={styles.keyHighlight}>{label}:</strong> {value}
        </p>
      );
    }

    return (
      <p key={idx} className={styles.caseStudyPara}>
        {cleanLine}
      </p>
    );
  });
};

export default function ProjectDrawer({
  isOpen,
  project,
  onClose,
  onNext,
  onPrev,
  currentIndex = 0,
  totalProjects = 1,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  const handleCopyLink = useCallback(() => {
    if (!project) return;
    const shareableUrl = `${window.location.origin}${window.location.pathname}#${project.slug || project.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [project]);

  const coverImageUrl = project?.coverImage || project?.cover_image || project?.image;
  const rawGallery = project?.galleryImages || project?.gallery_images || project?.gallery || [];
  
  const galleryList = (coverImageUrl && !rawGallery.includes(coverImageUrl))
    ? [coverImageUrl, ...rawGallery]
    : rawGallery;

  const projectDeliverables = (project?.deliverables && project.deliverables.length > 0)
    ? project.deliverables
    : DEFAULT_DELIVERABLES;

  const shortOverview = project?.summary || project?.description;
  const detailedDescription = project?.description && project?.description !== project?.summary 
    ? project.description 
    : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <div className={styles.portalWrapper} role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.backdrop}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300, mass: 0.8 }}
            className={styles.drawerPanel}
          >
            <header className={styles.topBar}>
              <div className={styles.badge}>
                <span>{project.category || "Engineering"}</span>
              </div>

              <div className={styles.actionsGroup}>
                <button
                  onClick={handleCopyLink}
                  title="Copy direct project link"
                  className={styles.iconBtn}
                  type="button"
                >
                  {copied ? <FaCheck className={styles.successIcon} /> : <FaShareAlt />}
                </button>

                <div className={styles.divider} />

                <div className={styles.navControls}>
                  <button
                    onClick={onPrev}
                    aria-label="Previous project"
                    className={styles.iconBtn}
                    type="button"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className={styles.counter}>
                    {String(currentIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
                  </span>
                  <button
                    onClick={onNext}
                    aria-label="Next project"
                    className={styles.iconBtn}
                    type="button"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                <div className={styles.divider} />

                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className={styles.closeBtn}
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>
            </header>

            <div className={styles.scrollContent}>
              <header className={styles.contentHeader}>
                <h1 className={styles.title}>{project.title}</h1>

                <div className={styles.metaGrid}>
                  {project.location && (
                    <div className={styles.metaItem}>
                      <FaMapMarkerAlt className={styles.accentIcon} />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className={styles.metaItem}>
                      <FaClock className={styles.accentIcon} />
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>
              </header>

              {/* 1. PROJECT OVERVIEW */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Project Overview</h3>
                <p className={styles.description}>{shortOverview}</p>
              </section>

              {/* 2. GALLERY */}
              {galleryList.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Project Gallery ({galleryList.length} Photos)
                  </h3>
                  <ProjectGallery gallery={galleryList} title={project.title} />
                </section>
              )}

              {/* 3. CLEAN CASE STUDY */}
              {detailedDescription && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Architectural & Engineering Scope</h3>
                  <div className={styles.caseStudyContainer}>
                    {renderSmartCaseStudy(detailedDescription)}
                  </div>
                </section>
              )}

              {/* 4. KEY DELIVERABLES */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Key Deliverables</h3>
                <ul className={styles.deliverablesList}>
                  {projectDeliverables.map((item, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}