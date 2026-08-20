// src/components/about/AboutHero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowDown } from "react-icons/fa";
import styles from "./AboutHero.module.css";

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

const defaultOffice = resolveAsset("office.webp", aboutImages, "/assets/images/about/office.webp");
const defaultTeam1 = resolveAsset("sajid.jpeg", aboutImages, "/assets/images/about/sajid.jpeg");
const defaultTeam2 = resolveAsset("junaid.jpg", aboutImages, "/assets/images/about/junaid.jpg");

export default function AboutHero({
  titleDark = "Built Through Expertise ",
  titleMuted = "& Experience",
  subtitle = "Nayaab Engineering Innovations Pvt. Ltd. combines formal corporate standards with startup agility to deliver civil construction, structural engineering, and technical design across Jammu & Kashmir.",
  galleryImages = [],
}) {
  const img1 = galleryImages[0] || defaultOffice;
  const img2 = galleryImages[1] || defaultTeam1;
  const img3 = galleryImages[2] || defaultTeam2;

  const handleScrollToTeam = (e) => {
    e.preventDefault();
    const teamElement = document.getElementById("team-roster");
    if (teamElement) {
      if (window.lenis) {
        window.lenis.scrollTo(teamElement, { offset: -50 });
      } else {
        teamElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className={styles.heroSection} aria-labelledby="about-hero-title">
      <div className={styles.heroContainer}>
        {/* Left Column: Rectangular Clipped Box */}
        <div className={styles.heroLeftCard}>
          <div className={`${styles.textWrapper} ${styles.animateSlideLeft}`}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <FaHome className={styles.homeIcon} aria-hidden="true" />
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.slash}>/</span>
              <strong className={styles.activeBreadcrumb}>About Us</strong>
            </div>

            {/* Controlled, Compact Title */}
            <h1 id="about-hero-title" className={styles.mainTitle}>
              <span>{titleDark}</span>
              <span className={styles.titleGrey}>{titleMuted}</span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subTitle}>
              {subtitle}
            </p>

            {/* Rectangular Slide-Fill Button with Separate Outer Arrow Box */}
            <div className={styles.ctaGroup}>
              <a 
                href="#team-roster" 
                onClick={handleScrollToTeam} 
                className={styles.ctaContainer}
              >
                <div className={styles.btnPrimary}>
                  <span>Meet Our Team</span>
                </div>
                <div className={styles.arrowBox}>
                  <FaArrowDown className={styles.arrowIcon} aria-hidden="true" />
                </div>
              </a>
            </div>
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
}