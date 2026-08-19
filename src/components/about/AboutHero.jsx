// src/components/about/AboutHero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./AboutHero.module.css";

// Automatically bundle images from src/assets/images/about/
const aboutImages = import.meta.glob("../../assets/images/about/*", {
  eager: true,
  import: "default",
});

function resolveAsset(filename, pool, fallback) {
  for (const path in pool) {
    if (path.toLowerCase().endsWith(`/${filename.toLowerCase()}`)) {
      return pool[path];
    }
  }
  return fallback;
}

// Map exactly to the requested routes using the new assets/images/about directory
const defaultOffice = resolveAsset("office.webp", aboutImages, "/assets/images/about/office.webp");
const defaultTeam1 = resolveAsset("sajid.jpeg", aboutImages, "/assets/images/about/sajid.jpeg");
const defaultTeam2 = resolveAsset("junaid.jpg", aboutImages, "/assets/images/about/junaid.jpg");

const AboutHero = ({
  titleDark = "Engineering What Comes ",
  titleMuted = (
    <>
      Next in
      <br />
      Jammu &amp; Kashmir:
    </>
  ),
  subtitle = "Nayaab Engineering Innovations Pvt. Ltd. combines formal corporate standards with startup agility to deliver civil construction, structural engineering, and technical design across Jammu & Kashmir.",
  galleryImages = [],
  primaryAction = { href: "/contact", label: "Start a Project" },
  secondaryAction = { href: "#corporate-profile", label: "Company Profile" },
}) => {
  const img1 = galleryImages[0] || defaultOffice;
  const img2 = galleryImages[1] || defaultTeam1;
  const img3 = galleryImages[2] || defaultTeam2;

  return (
    <section className={styles.heroSection} aria-labelledby="about-hero-title">
      <div className={styles.heroContainer}>
        {/* Left Column Text & Actions */}
        <div className={styles.heroLeftCard}>
          <div className={`${styles.breadcrumb} ${styles.animateSlideLeft} ${styles.delay1}`}>
            <FaHome className={styles.homeIcon} aria-hidden="true" />
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.slash}>/</span>
            <strong className={styles.activeBreadcrumb}>About Us</strong>
          </div>

          <h1 id="about-hero-title" className={`${styles.heroTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
            <span className={styles.titleDark}>{titleDark}</span>
            <span className={styles.titleMuted}>{titleMuted}</span>
          </h1>

          <p className={`${styles.heroText} ${styles.animateSlideLeft} ${styles.delay3}`}>
            {subtitle}
          </p>

          <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay4}`}>
            {primaryAction && (
              primaryAction.href.startsWith("#") ? (
                <a href={primaryAction.href} className={styles.heroBtn}>
                  {primaryAction.label}
                </a>
              ) : (
                <Link to={primaryAction.href} className={styles.heroBtn}>
                  {primaryAction.label}
                </Link>
              )
            )}

            {secondaryAction && (
              secondaryAction.href.startsWith("#") ? (
                <a href={secondaryAction.href} className={styles.heroBtnOutline}>
                  {secondaryAction.label}
                </a>
              ) : (
                <Link to={secondaryAction.href} className={styles.heroBtnOutline}>
                  {secondaryAction.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Right Column: 3-Image Asymmetric Chamfered Grid */}
        <div className={styles.heroRightGrid}>
          <div className={styles.heroImageMain}>
            <img 
              src={img1} 
              alt="Nayaab Engineering Headquarters" 
              loading="eager"
              decoding="async"
            />
          </div>

          <div className={styles.heroSubGrid}>
            <div className={styles.heroImageSub1}>
              <img 
                src={img2} 
                alt="Engineering Field Team" 
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.heroImageSub2}>
              <img 
                src={img3} 
                alt="Architectural Design Studio" 
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;