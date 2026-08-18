// src/components/about/AboutHero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./AboutHero.module.css";

const DEFAULT_GALLERY_IMAGES = [
  "/assets/about/office.webp",
  "/assets/team/sajid.jpeg",
  "/assets/team/junaid.jpg",
];

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
  galleryImages = DEFAULT_GALLERY_IMAGES,
  primaryAction = { href: "/contact", label: "Start a Project" },
  secondaryAction = { href: "#corporate-profile", label: "Company Profile" },
}) => {
  const img1 = galleryImages[0] || "/assets/about/office.webp";
  const img2 = galleryImages[1] || "/assets/team/sajid.jpeg";
  const img3 = galleryImages[2] || "/assets/team/junaid.jpg";

  return (
    <section className={styles.heroSection} aria-labelledby="about-hero-title">
      <div className={styles.heroContainer}>
        {/* Left Column Text & Buttons */}
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

        {/* Right Column: Projects Hero 3-Image Asymmetric Chamfered Grid */}
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