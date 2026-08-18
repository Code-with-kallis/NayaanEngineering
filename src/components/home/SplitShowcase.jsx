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
import house3dDesktop from "../../assets/images/home/split-screen.webp";
import house3dMobile from "../../assets/images/home/split-screen-mobile.webp";
import styles from "./SplitShowcase.module.css";

export default function SplitShowcase() {
  const sectionRef = useRef(null);

  useEffect(() => {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.fullBleedSection}
      aria-label="Core Engineering Services and Architectural Visualization"
      style={{
        "--bg-desktop": `url(${house3dDesktop})`,
        "--bg-mobile": `url(${house3dMobile})`,
      }}
    >
      {/* Full-Screen Background Image Covering the Entire Section */}
      <div className={styles.bgImage} />

      {/* Right-Aligned Content Wrapper */}
      <div className={styles.contentContainer}>
        {/* Clipped-Corner Black Rectangle Card */}
        <div className={styles.clippedCard}>
          <div className={styles.eyebrowWrapper}>
            <FaCube className={styles.eyebrowIcon} />
            <span className={styles.eyebrowText}>CORE ENGINEERING &amp; DESIGN</span>
          </div>

          <h2 className={styles.mainTitle}>
            End-To-End Engineering <br />
            <span className={styles.titleGrey}>&amp; Modern Architecture</span>
          </h2>

          <p className={styles.description}>
            Delivering integrated civil engineering solutions with structural precision and high-fidelity 3D modeling tailored for regional terrain demands.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaLayerGroup />
              </div>
              <div className={styles.featureText}>
                <h4>1. Architectural &amp; 3D BIM Design</h4>
                <p>Comprehensive 2D blueprints, realistic 3D exterior renders, and complete spatial planning.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaDraftingCompass />
              </div>
              <div className={styles.featureText}>
                <h4>2. Structural Engineering &amp; Seismic Safety</h4>
                <p>Load calculation, foundation design, and compliance with Zone-V seismic safety standards.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaHardHat />
              </div>
              <div className={styles.featureText}>
                <h4>3. Turnkey Execution &amp; Site Supervision</h4>
                <p>On-site quality monitoring, material standard testing, and full project lifecycle execution.</p>
              </div>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <span className={styles.locationTag}>
              <FaShieldAlt /> DPIIT Recognized • IS Code Compliant
            </span>

            <Link to="/services" className={styles.exploreBtn}>
              <span>Explore All Services</span>
              <span className={styles.exploreBtnArrow}>
                <FaArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
