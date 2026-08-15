// src/components/home/SplitShowcase.jsx
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
import styles from "./SplitShowcase.module.css";

const HOUSE_3D_IMAGE = "assets/home/3d-house.png";

export default function SplitShowcase() {
  const splitSectionRef = useRef(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // Smooth one-time trigger on mobile to ensure zero frame drops during scrolling
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.isVisible);
          obs.unobserve(entry.target); // Unobserve immediately to prevent scroll stutter
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (splitSectionRef.current) {
      observer.observe(splitSectionRef.current);
    }

    // Scroll snapping restricted strictly to Desktop mouse users
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    let cleanupScrollLock = () => {};

    if (!isTouch && typeof window !== "undefined" && window.innerWidth > 1024) {
      const scrollToTarget = (targetTop) => {
        isLockedRef.current = true;
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });

        setTimeout(() => {
          isLockedRef.current = false;
        }, 900);
      };

      const handleWheel = (e) => {
        if (!splitSectionRef.current) return;
        const currentScroll = window.scrollY || window.pageYOffset;
        const splitTop = splitSectionRef.current.offsetTop;

        if (currentScroll < splitTop - 30) {
          if (e.deltaY > 0) {
            e.preventDefault();
            if (!isLockedRef.current) {
              scrollToTarget(splitTop);
            }
          }
        } else if (isLockedRef.current) {
          e.preventDefault();
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
    >
      <div className={styles.splitHalfLeft}>
        <div
          className={styles.splitBackground}
          style={{ backgroundImage: `url(${HOUSE_3D_IMAGE})` }}
        />
        <div className={styles.ambientGlowLeft} />
      </div>

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
            <Link to="/services" className={styles.typoActionLink}>
              <span>Explore All Services</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}