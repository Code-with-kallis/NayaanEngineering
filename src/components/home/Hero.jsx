// src/components/home/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import heroDesktop from "../../assets/images/home/hero-desktop.webp";
import heroMobile from "../../assets/images/home/hero-mobile.webp";
import styles from "./Hero.module.css";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const Hero = () => {
  return (
    <div className={styles.heroTrack}>
      <section className={styles.heroSection} aria-label="Hero">
        {/* Responsive Background Images */}
        <div className={styles.imageContainer}>
          <picture>
            <source media="(max-width: 768px)" srcSet={heroMobile} />
            <img
              src={heroDesktop}
              alt="Nayaab Engineering Hero"
              className={styles.imageElement}
              fetchPriority="high"
              loading="eager"
            />
          </picture>
          <div className={styles.imageOverlay} />
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <div className={`${styles.textWrapper} ${styles.animateSlideLeft} ${styles.delay1}`}>
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>NAYAAB ENGINEERING</span>
            </div>

            <h1 className={styles.mainTitle}>
              Engineering Excellence
              <br />
              <span className={styles.titleGrey}>&amp; Innovation</span>
            </h1>

            <h2 className={styles.subTitle}>
              Building the future with precision.
            </h2>

            <div className={styles.ctaGroup}>
              <Link to="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                <span>Contact Us</span>
              </Link>
              <Link to="/services" className={`${styles.btn} ${styles.btnOutline}`}>
                <span>Our Services</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.heroFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.socialLinks} aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
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
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator} aria-hidden="true">
          <div className={styles.scrollMouse}>
            <div className={styles.wheel} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
