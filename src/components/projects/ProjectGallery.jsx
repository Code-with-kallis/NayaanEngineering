import { useState, useEffect, useCallback } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ gallery = [], title = "" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize image sources (local asset imports, Supabase URLs, or objects)
  const normalizedGallery = gallery.map((item, idx) => {
    if (typeof item === "string") {
      return {
        url: item,
        alt: `${title || "Project Specification"} — View ${idx + 1}`,
        caption: "",
      };
    }
    return {
      url: item.url || item.src || item.image || "",
      alt: item.alt || `${title || "Project Specification"} — View ${idx + 1}`,
      caption: item.caption || "",
    };
  });

  const totalImages = normalizedGallery.length;
  const currentImage = normalizedGallery[selectedIndex] || normalizedGallery[0];

  // Reset index when active project changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [gallery]);

  // Next / Previous navigation handlers
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

  // Keyboard navigation & body scroll-lock
  useEffect(() => {
    if (!isLightboxOpen) return;

    // Lock body scrolling behind modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  if (!gallery || totalImages === 0) return null;

  return (
    <div className={styles.galleryWrapper}>
      {/* Main Interactive Stage */}
      <div
        className={styles.mainDisplay}
        onClick={() => setIsLightboxOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Open fullscreen view of image ${selectedIndex + 1} of ${totalImages}`}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          loading="lazy"
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
        <p className={styles.caption}>{currentImage.caption}</p>
      )}

      {/* Responsive Thumbnail Strip */}
      {totalImages > 1 && (
        <div
          className={styles.thumbnailGrid}
          role="region"
          aria-label="Image thumbnail selectors"
        >
          {normalizedGallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumbButton} ${
                idx === selectedIndex ? styles.activeThumb : ""
              }`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select photo ${idx + 1} of ${totalImages}`}
              aria-current={idx === selectedIndex ? "true" : undefined}
            >
              <img
                src={img.url}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution project gallery preview"
        >
          {/* Controls Bar */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close fullscreen modal"
          >
            <FaTimes />
          </button>

          {totalImages > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={handleNext}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Modal Center Stage */}
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt}
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
        </div>
      )}
    </div>
  );
}