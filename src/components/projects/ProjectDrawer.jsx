// src/components/projects/ProjectDrawer.jsx
import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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

// Clean text renderer (No card boxes, preserves numbers like "3D")
const renderSmartCaseStudy = (content) => {
  if (!content) return null;

  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  return lines.map((line, idx) => {
    const cleanLine = line.replace(/^([0-9]+\s*[\.\)-]\s*|[-•*]\s*)/, "").trim();
    const colonIndex = cleanLine.indexOf(":");

    if (colonIndex !== -1 && colonIndex < 40 && !cleanLine.includes("http")) {
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
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.paddingRight = "";
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

  const handleShare = useCallback(async () => {
    if (!project) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${project.slug || project.id}`;
    const shareData = {
      title: `${project.title} | Nayaab Engineering Innovations`,
      text: project.summary || `Discover architectural and structural specifications for ${project.title}.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        if (err.name !== "AbortError") {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
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

  const projectCanonicalUrl = project 
    ? `${window.location.origin}/projects#${project.slug || project.id}`
    : `${window.location.origin}/projects`;

  const imageSchemaData = project ? {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": project.title,
    "description": shortOverview,
    "image": galleryList.map((img) => (typeof img === "string" ? img : img.url || img.src)),
    "creator": {
      "@type": "Organization",
      "name": "Nayaab Engineering Innovations",
      "url": "https://www.nayaabengineering.com"
    },
    "locationCreated": {
      "@type": "Place",
      "name": project.location || "Kashmir, India"
    }
  } : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <div className={styles.portalWrapper} role="dialog" aria-modal="true" aria-labelledby="modal-project-title">
          <Helmet>
            <title>{`${project.title} | Nayaab Engineering Innovations Portfolio`}</title>
            <meta name="description" content={shortOverview || `Structural engineering and turnkey architectural design for ${project.title} by Nayaab Engineering Innovations.`} />
            <link rel="canonical" href={projectCanonicalUrl} />
            
            <meta property="og:title" content={`${project.title} | Nayaab Engineering Innovations`} />
            <meta property="og:description" content={shortOverview} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={projectCanonicalUrl} />
            {coverImageUrl && <meta property="og:image" content={coverImageUrl} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${project.title} | Nayaab Engineering Innovations`} />
            <meta name="twitter:description" content={shortOverview} />
            {coverImageUrl && <meta name="twitter:image" content={coverImageUrl} />}

            {imageSchemaData && (
              <script type="application/ld+json">
                {JSON.stringify(imageSchemaData)}
              </script>
            )}
          </Helmet>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.backdrop}
            onClick={onClose}
          />

          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 32, 
              stiffness: 300, 
              mass: 0.8 
            }}
            className={styles.modalPanel}
            data-lenis-prevent="true"
          >
            <div className={styles.dragHandleBar} onClick={onClose}>
              <div className={styles.dragPill} />
            </div>

            <header className={styles.topBar}>
              <div className={styles.topBarLeft}>
                <Link to="/" className={styles.logoLink} title="Nayaab Engineering Innovations">
                  <img 
                    src="/logo.png" 
                    alt="Nayaab Engineering Innovations" 
                    className={styles.brandLogo} 
                  />
                </Link>
                <div className={styles.categoryBadge}>
                  <span>{project.category || "Engineering"}</span>
                </div>
              </div>

              <div className={styles.actionsGroup}>
                <button
                  onClick={handleShare}
                  title="Share project link"
                  className={`${styles.iconBtn} ${copied ? styles.copiedActive : ""}`}
                  type="button"
                  aria-label="Share project link"
                >
                  {copied ? (
                    <>
                      <FaCheck className={styles.successIcon} />
                      <span className={styles.copiedTooltip}>Link Copied!</span>
                    </>
                  ) : (
                    <FaShareAlt />
                  )}
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
                  aria-label="Close drawer"
                  className={styles.closeBtn}
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>
            </header>

            <div className={styles.scrollContent} data-lenis-prevent="true">
              <header className={styles.contentHeader}>
                <h1 id="modal-project-title" className={styles.title}>{project.title}</h1>

                <div className={styles.metaGrid}>
                  {project.location && (
                    <div className={styles.metaItem}>
                      <FaMapMarkerAlt className={styles.accentIcon} aria-hidden="true" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className={styles.metaItem}>
                      <FaClock className={styles.accentIcon} aria-hidden="true" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>
              </header>

              {/* 1. Overview */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Project Overview</h2>
                <p className={styles.description}>{shortOverview}</p>
              </section>

              {/* 2. Gallery */}
              {galleryList.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    Project Gallery ({galleryList.length} Photographs)
                  </h2>
                  <ProjectGallery 
                    gallery={galleryList} 
                    title={project.title} 
                    category={project.category}
                    location={project.location}
                  />
                </section>
              )}

              {/* 3. Scope */}
              {detailedDescription && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Architectural &amp; Engineering Scope</h2>
                  <div className={styles.caseStudyContainer}>
                    {renderSmartCaseStudy(detailedDescription)}
                  </div>
                </section>
              )}

              {/* 4. Deliverables */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Key Deliverables &amp; Structural Milestones</h2>
                <ul className={styles.deliverablesList}>
                  {projectDeliverables.map((item, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className={styles.checkIcon} aria-hidden="true" />
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