// src/components/home/Hero.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Hero.module.css";
import posterImage from "../../assets/images/home/3d-house.webp";
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const DESKTOP_VIDEO_SRC = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero.mp4";
const MOBILE_VIDEO_SRC = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero-mobile.mp4";
const POSTER_IMAGE = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/services/structural-engineering.webp";

const Hero = () => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  // Auto-pause video when scrolled out of view to preserve GPU cycles
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={heroRef} className={styles.heroTrack}>
      <section className={styles.heroSection} aria-label="Hero">
        {/* Background Video */}
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            poster={POSTER_IMAGE}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={MOBILE_VIDEO_SRC} media="(max-width: 768px)" type="video/mp4" />
            <source src={DESKTOP_VIDEO_SRC} media="(min-width: 769px)" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <div className={styles.textWrapper}>
            <div className={styles.eyebrowWrapper}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>NAYAAB ENGINEERING</span>
            </div>

            <h1 className={`${styles.mainTitle} ${styles.animateSlideLeft} ${styles.delay1}`}>
              Engineering Excellence
              <br />
              &amp; Innovation
            </h1>

            <h2 className={`${styles.subTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
              Building the future with precision.
            </h2>

            <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay3}`}>
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