// src/components/projects/ProjectGallery.jsx
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ 
  gallery = [], 
  title = "",
  category = "Engineering",
  location = "Kashmir"
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const normalizedGallery = gallery.map((item, idx) => {
    const rawUrl = typeof item === "string" ? item : item.url || item.src || item.image || "";
    const descriptiveAlt = `${title} - ${category} Architectural View ${idx + 1} | ${location}`;
    const imageTitle = `${title} - View ${idx + 1}`;

    return {
      url: rawUrl,
      alt: descriptiveAlt,
      title: imageTitle,
      caption: item.caption || `${title} - Perspective ${idx + 1}`,
    };
  });

  const totalImages = normalizedGallery.length;
  const currentImage = normalizedGallery[selectedIndex] || normalizedGallery[0];

  useEffect(() => {
    setSelectedIndex(0);
  }, [gallery]);

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    },
    [totalImages]
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    },
    [totalImages]
  );

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  if (!gallery || totalImages === 0) return null;

  return (
    <figure className={styles.galleryWrapper}>
      {/* Main Display Stage */}
      <div
        className={styles.mainDisplay}
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open full resolution photograph ${selectedIndex + 1}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          title={currentImage.title}
          loading="eager"
          decoding="async"
          className={styles.mainImage}
        />
        <div className={styles.zoomOverlay} aria-hidden="true">
          <FaExpandArrowsAlt className={styles.zoomIcon} />
          <span>
            {selectedIndex + 1} / {totalImages}
          </span>
        </div>
      </div>

      {currentImage.caption && (
        <figcaption className={styles.caption}>
          {currentImage.caption}
        </figcaption>
      )}

      {/* Thumbnails */}
      {totalImages > 1 && (
        <nav className={styles.thumbnailGrid} aria-label="Selectable project photo thumbnails">
          {normalizedGallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumbButton} ${
                idx === selectedIndex ? styles.activeThumb : ""
              }`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select photo ${idx + 1}`}
            >
              <img src={img.url} alt={img.alt} loading="lazy" decoding="async" />
            </button>
          ))}
        </nav>
      )}

      {/* Portaled Fullscreen Lightbox */}
      {isLightboxOpen &&
        createPortal(
          <div
            className={styles.lightbox}
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close photo viewer"
            >
              <FaTimes />
            </button>

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={handlePrev}
                  aria-label="Previous photo"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={handleNext}
                  aria-label="Next photo"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                title={currentImage.title}
                className={styles.lightboxImage}
              />

              <div className={styles.lightboxMeta}>
                <span className={styles.lightboxCounter}>
                  {selectedIndex + 1} / {totalImages}
                </span>
                {currentImage.caption && (
                  <p className={styles.lightboxCaption}>{currentImage.caption}</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </figure>
  );
}