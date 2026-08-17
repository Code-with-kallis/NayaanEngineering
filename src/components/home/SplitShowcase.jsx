import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaCube,
  FaLayerGroup,
  FaDraftingCompass,
  FaHardHat,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import house3dDesktop from "../../assets/images/home/3d-house.webp";
import house3dMobile from "../../assets/images/home/3d-house-mobile.webp";
import styles from "./SplitShowcase.module.css";

export default function SplitShowcase() {
  const splitSectionRef = useRef(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // 1. Direct DOM animation trigger
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.isVisible);
          obs.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (splitSectionRef.current) {
      observer.observe(splitSectionRef.current);
    }

    // 2. 1-Scroll Precision Snap to Fit Display (Desktop Only)
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    let cleanupScrollLock = () => {};

    if (!isTouch && typeof window !== "undefined" && window.innerWidth > 1024) {
      const snapToExactDisplay = () => {
        if (!splitSectionRef.current) return;
        isLockedRef.current = true;

        const targetTop =
          splitSectionRef.current.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: Math.round(targetTop),
          behavior: "smooth",
        });

        setTimeout(() => {
          isLockedRef.current = false;
        }, 900);
      };

      const handleWheel = (e) => {
        if (!splitSectionRef.current) return;

        if (isLockedRef.current) {
          e.preventDefault();
          return;
        }

        const rect = splitSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (
          e.deltaY > 0 &&
          rect.top > 8 &&
          rect.top <= windowHeight * 0.95
        ) {
          e.preventDefault();
          snapToExactDisplay();
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });

      cleanupScrollLock = () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }

    return () => {
      observer.disconnect();
      cleanupScrollLock();
    };
  }, []);

  return (
    <section
      ref={splitSectionRef}
      className={styles.fullBleedSplitSection}
      aria-label="Core Engineering Services and Architectural Visualization"
      style={{
        "--bg-desktop": `url(${house3dDesktop})`,
        "--bg-mobile": `url(${house3dMobile})`,
      }}
    >
      {/* LEFT HALF: 3D Image */}
      <div className={styles.splitHalfLeft}>
        <div className={styles.splitBackground} />
        <div className={styles.ambientGlowLeft} />
      </div>

      {/* RIGHT HALF: Typography */}
      <div className={styles.splitHalfRight}>
        <div className={styles.typographyContentWrapper}>
          <div className={styles.typoEyebrowBadge}>
            <FaCube className={styles.badgeIcon} />
            <span>CORE ENGINEERING &amp; DESIGN SERVICES</span>
          </div>

          <h2 className={styles.typoMainHeading}>
            End-To-End Engineering <br />
            <span>&amp; Modern Architecture</span>
          </h2>

          <p className={styles.typoDescription}>
            Delivering integrated civil engineering solutions with structural precision and high-fidelity 3D modeling tailored for regional terrain demands.
          </p>

          <div className={styles.typoFeatureList}>
            <div className={styles.typoFeatureItem}>
              <div className={styles.featureBullet}>
                <FaLayerGroup />
              </div>
              <div className={styles.featureText}>
                <h4>1. Architectural &amp; 3D BIM Design</h4>
                <p>Comprehensive 2D blueprints, realistic 3D exterior renders, and complete spatial planning.</p>
              </div>
            </div>

            <div className={styles.typoFeatureItem}>
              <div className={styles.featureBullet}>
                <FaDraftingCompass />
              </div>
              <div className={styles.featureText}>
                <h4>2. Structural Engineering &amp; Seismic Safety</h4>
                <p>Load calculation, foundation design, and compliance with Zone-V seismic safety standards.</p>
              </div>
            </div>

            <div className={styles.typoFeatureItem}>
              <div className={styles.featureBullet}>
                <FaHardHat />
              </div>
              <div className={styles.featureText}>
                <h4>3. Turnkey Execution &amp; Site Supervision</h4>
                <p>On-site quality monitoring, material standard testing, and full project lifecycle execution.</p>
              </div>
            </div>
          </div>

          <div className={styles.typoBottomBar}>
            <span className={styles.typoLocationTag}>
              <FaShieldAlt /> DPIIT Recognized • IS Code Compliant
            </span>
          </div>
        </div>
      </div>

      {/* CENTER-BOTTOM ACTION BUTTON */}
      <div className={styles.centerBottomAction}>
        <Link to="/services" className={styles.exploreBtn}>
          <span>Explore All Services</span>
          <span className={styles.exploreBtnArrow}>
            <FaArrowRight />
          </span>
        </Link>
      </div>
    </section>
  );
}