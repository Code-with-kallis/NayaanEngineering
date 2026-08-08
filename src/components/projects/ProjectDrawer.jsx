import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Share2, 
  Check, MapPin, Clock, CheckCircle2 
} from "lucide-react";
import useScrollLock from "../../hooks/useScrollLock";
import styles from "./ProjectDrawer.module.css";

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
  const copyTimerRef = useRef(null);

  useScrollLock(isOpen);

  // Keyboard Navigation
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

  // Copy Deep Link
  const handleCopyLink = useCallback(() => {
    if (!project) return;
    const shareableUrl = `${window.location.origin}${window.location.pathname}#${project.slug}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);

    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [project]);

  if (!isOpen || !project) return null;

  return createPortal(
    <AnimatePresence>
      <div className={styles.portalWrapper} role="dialog" aria-modal="true">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={styles.backdrop}
          onClick={onClose}
        />

        {/* Slide-over Panel */}
        <motion.aside
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 32, stiffness: 320, mass: 0.85 }}
          className={styles.drawerPanel}
        >
          {/* Top Sticky Bar */}
          <header className={styles.topBar}>
            <div className={styles.badge}>
              <span>{project.category || "Engineering"}</span>
            </div>

            <div className={styles.actionsGroup}>
              {/* Share Link Button */}
              <button
                onClick={handleCopyLink}
                title="Copy direct project link"
                className={styles.iconBtn}
              >
                {copied ? (
                  <Check size={16} className={styles.successIcon} />
                ) : (
                  <Share2 size={16} />
                )}
              </button>

              <div className={styles.divider} />

              {/* Prev/Next Counter Navigation */}
              <div className={styles.navControls}>
                <button
                  onClick={onPrev}
                  aria-label="Previous project"
                  className={styles.iconBtn}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className={styles.counter}>
                  {String(currentIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
                </span>
                <button
                  onClick={onNext}
                  aria-label="Next project"
                  className={styles.iconBtn}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className={styles.divider} />

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className={styles.closeBtn}
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Scrollable Content Container */}
          <div className={styles.scrollContent}>
            <header className={styles.contentHeader}>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.summary}>{project.summary || project.description}</p>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <MapPin size={15} className={styles.accentIcon} />
                  <span>{project.location}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={15} className={styles.accentIcon} />
                  <span>{project.duration || project.year}</span>
                </div>
              </div>
            </header>

            {/* Main Cover Image */}
            <div className={styles.coverImageWrapper}>
              <img
                src={project.coverImage || project.image}
                alt={project.title}
                loading="lazy"
              />
            </div>

            {/* Overview */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Project Overview</h3>
              <p className={styles.description}>
                {project.description || project.summary}
              </p>
            </section>

            {/* Dynamic Specifications */}
            {project.specifications && project.specifications.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technical Specifications</h3>
                <dl className={styles.specGrid}>
                  {project.specifications.map((spec, i) => (
                    <div key={i} className={styles.specCard}>
                      <dt className={styles.specLabel}>{spec.label}</dt>
                      <dd className={styles.specValue}>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Gallery Grid */}
            {project.gallery && project.gallery.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Gallery ({project.gallery.length} Images)</h3>
                <div className={styles.galleryGrid}>
                  {project.gallery.map((img, i) => (
                    <div key={i} className={styles.galleryItem}>
                      <img src={img.url || img} alt={img.caption || `Gallery ${i + 1}`} loading="lazy" />
                      {img.caption && <span className={styles.galleryCaption}>{img.caption}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Deliverables */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Key Deliverables</h3>
              <ul className={styles.deliverablesList}>
                <li>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>Executed in strict compliance with structural engineering standards.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>Rigorous site safety and material testing protocols enforced.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>On-time project delivery with full documentation handoff.</span>
                </li>
              </ul>
            </section>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>,
    document.body
  );
}