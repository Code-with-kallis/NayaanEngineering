import { useState, useEffect, useCallback } from "react";
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

  // SEO-Rich Image Metadata Formatting for Google Images Indexing
  const normalizedGallery = gallery.map((item, idx) => {
    const rawUrl = typeof item === "string" ? item : item.url || item.src || item.image || "";
    const descriptiveAlt = `${title} - ${category} Architectural Elevation & Structural Engineering View ${idx + 1} | ${location} by Nayaab Engineering Innovations`;
    const imageTitle = `${title} (${category}) - Inspection View ${idx + 1}`;

    return {
      url: rawUrl,
      alt: descriptiveAlt,
      title: imageTitle,
      caption: item.caption || `${title} - Perspective View ${idx + 1}`,
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

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();

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
      if (window.lenis) window.lenis.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  if (!gallery || totalImages === 0) return null;

  return (
    <figure 
      className={styles.galleryWrapper}
      itemScope
      itemType="https://schema.org/ImageGallery"
    >
      {/* Main Interactive Stage with Schema Microdata */}
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
        aria-label={`Open full resolution photograph ${selectedIndex + 1} of ${totalImages} for ${title}`}
        itemProp="associatedMedia"
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        <meta itemProp="name" content={currentImage.title} />
        <meta itemProp="caption" content={currentImage.alt} />
        <link itemProp="contentUrl" href={currentImage.url} />

        <img
          src={currentImage.url}
          alt={currentImage.alt}
          title={currentImage.title}
          loading="eager"
          decoding="async"
          className={styles.mainImage}
          itemProp="thumbnail"
        />
        <div className={styles.zoomOverlay} aria-hidden="true">
          <FaExpandArrowsAlt className={styles.zoomIcon} />
          <span>
            {selectedIndex + 1} / {totalImages}
          </span>
        </div>
      </div>

      {currentImage.caption && (
        <figcaption className={styles.caption} itemProp="description">
          {currentImage.caption}
        </figcaption>
      )}

      {/* Responsive Thumbnail Strip */}
      {totalImages > 1 && (
        <nav
          className={styles.thumbnailGrid}
          aria-label="Selectable project photo thumbnails"
        >
          {normalizedGallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumbButton} ${
                idx === selectedIndex ? styles.activeThumb : ""
              }`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select photograph ${idx + 1}: ${img.title}`}
              aria-current={idx === selectedIndex ? "true" : undefined}
            >
              <img
                src={img.url}
                alt={img.alt}
                title={img.title}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </nav>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`High-resolution preview of ${currentImage.title}`}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close high-resolution photo viewer"
          >
            <FaTimes />
          </button>

          {totalImages > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={handlePrev}
                aria-label="Previous photograph"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={handleNext}
                aria-label="Next photograph"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>
      )}
    </figure>
  );
}