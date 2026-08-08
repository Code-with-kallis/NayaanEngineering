// src/components/projects/ProjectGallery.jsx
import React, { useState } from 'react';
import styles from './ProjectGallery.module.css';

export default function ProjectGallery({ gallery, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!gallery || gallery.length === 0) return null;

  const currentImage = gallery[selectedIndex];

  return (
    <div className={styles.galleryWrapper}>
      {/* Featured Main Display */}
      <div className={styles.mainDisplay} onClick={() => setIsLightboxOpen(true)}>
        <img 
          src={currentImage.url} 
          alt={currentImage.alt || title} 
          loading="lazy" 
          className={styles.mainImage} 
        />
        <div className={styles.zoomOverlay}>
          <span>Click to Enlarge ({selectedIndex + 1} / {gallery.length})</span>
        </div>
      </div>
      <p className={styles.caption}>{currentImage.caption}</p>

      {/* Thumbnail Bar */}
      <div className={styles.thumbnailGrid}>
        {gallery.map((img, idx) => (
          <button
            key={idx}
            className={`${styles.thumbButton} ${idx === selectedIndex ? styles.activeThumb : ''}`}
            onClick={() => setSelectedIndex(idx)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={img.url} alt={img.alt || `Thumbnail ${idx + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)}>
          <button className={styles.closeBtn} onClick={() => setIsLightboxOpen(false)}>&times;</button>
          <img src={currentImage.url} alt={currentImage.alt} className={styles.lightboxImage} />
          <p className={styles.lightboxCaption}>{currentImage.caption}</p>
        </div>
      )}
    </div>
  );
}