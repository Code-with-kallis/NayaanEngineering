import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./PageHero.module.css";

const DEFAULT_SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

export default function PageHero({
  desktopImage,
  mobileImage,
  imageAlt = "Nayaab Engineering",
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  actions,
  showSocials = false,
  showScrollIndicator = false,
  variant = "standard", // "home" | "standard"
}) {
  const isHome = variant === "home";

  return (
    <div className={styles.heroTrack}>
      <section
        className={`${styles.heroSection} ${isHome ? styles.heroSectionHome : ""}`}
        aria-label="Hero Section"
      >
        {/* Responsive Background Image */}
        <div className={styles.imageContainer}>
          <picture>
            {mobileImage && <source media="(max-width: 768px)" srcSet={mobileImage} />}
            <img
              src={desktopImage}
              alt={imageAlt}
              className={styles.imageElement}
              fetchPriority="high"
              loading="eager"
            />
          </picture>
        </div>

        {/* Hero Content Stage */}
        <div
          className={`${styles.heroContent} ${
            isHome ? styles.heroContentHome : styles.heroContentProjects
          }`}
        >
          <div className={`${styles.textWrapper} ${styles.animateSlideLeft}`}>
            {/* Custom Eyebrow or Breadcrumbs */}
            {eyebrow && <div className={styles.eyebrowContainer}>{eyebrow}</div>}

            {/* Main Title Lockup */}
            <h1 className={styles.mainTitle}>
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className={styles.titleGrey}>{titleHighlight}</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            {subtitle && <p className={styles.subTitle}>{subtitle}</p>}

            {/* Action Buttons */}
            {actions && <div className={styles.ctaGroup}>{actions}</div>}
          </div>
        </div>

        {/* Bottom Social Icons */}
        {showSocials && (
          <div className={styles.heroFooter}>
            <div className={styles.socialLinks} aria-label="Social media links">
              {DEFAULT_SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Scroll Mouse Indicator */}
        {showScrollIndicator && (
          <div className={styles.scrollIndicator} aria-hidden="true">
            <div className={styles.scrollMouse}>
              <div className={styles.wheel} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}   