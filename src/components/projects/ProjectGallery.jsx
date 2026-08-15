import React, { useState, useEffect } from "react";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ gallery = [], title = "" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset index to first photo when navigating to another project
  useEffect(() => {
    setSelectedIndex(0);
  }, [gallery]);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  if (!gallery || gallery.length === 0) return null;

  // Normalize string URLs, Cloudflare R2 links, or object formats
  const normalizedGallery = gallery.map((item, idx) => {
    if (typeof item === "string") {
      return { 
        url: item, 
        alt: `${title || "Project Image"} - Photo ${idx + 1}`,
        caption: ""
      };
    }
    return { 
      url: item.url || item.src || item, 
      alt: item.alt || `${title || "Project Image"} - Photo ${idx + 1}`,
      caption: item.caption || ""
    };
  });

  const currentImage = normalizedGallery[selectedIndex] || normalizedGallery[0];

  return (
    <div className={styles.galleryWrapper}>
      {/* Main Display Box */}
      <div 
        className={styles.mainDisplay} 
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Click to enlarge image"
      >
        <img 
          src={currentImage.url} 
          alt={currentImage.alt} 
          loading="lazy" 
          className={styles.mainImage} 
        />
        <div className={styles.zoomOverlay}>
          <span>Click to Enlarge ({selectedIndex + 1} / {normalizedGallery.length})</span>
        </div>
      </div>

      {currentImage.caption && (
        <p className={styles.caption}>{currentImage.caption}</p>
      )}

      {/* Thumbnail Bar */}
      {normalizedGallery.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {normalizedGallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumbButton} ${idx === selectedIndex ? styles.activeThumb : ""}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
            >
              <img src={img.url} alt={img.alt} loading="lazy" />
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
        >
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close fullscreen view"
          >
            &times;
          </button>
          <img 
            src={currentImage.url} 
            alt={currentImage.alt} 
            className={styles.lightboxImage} 
            onClick={(e) => e.stopPropagation()}
          />
          {currentImage.caption && (
            <p className={styles.lightboxCaption} onClick={(e) => e.stopPropagation()}>
              {currentImage.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}