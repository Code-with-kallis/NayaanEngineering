
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
      aria-label="Architectural design, structural engineering and turnkey construction services"
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
            <span className={styles.eyebrowText}>OUR SERVICES</span>
          </div>

          <h2 className={styles.mainTitle}>
            Complete Engineering <br />
            <span className={styles.titleGrey}>
              &amp; Construction Services
            </span>
          </h2>

          <p className={styles.description}>
            From architectural planning and structural engineering to complete
            construction, we deliver practical and reliable solutions for
            residential and commercial projects across Kashmir.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaLayerGroup />
              </div>

              <div className={styles.featureText}>
                <h4>1. Architectural Design</h4>
                <p>
                  Thoughtful 2D plans, 3D designs, and building layouts tailored
                  to your site, needs, and vision.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaDraftingCompass />
              </div>

              <div className={styles.featureText}>
                <h4>2. Structural Engineering</h4>
                <p>
                  Safe and reliable structural designs engineered for seismic
                  conditions, snow loads, soil conditions, and long-term
                  durability.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureBullet}>
                <FaHardHat />
              </div>

              <div className={styles.featureText}>
                <h4>3. Turnkey Construction</h4>
                <p>
                  Complete construction management from site preparation and
                  structural work to finishing and final handover.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <span className={styles.locationTag}>
              <FaShieldAlt /> KASHMIR, INDIA
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

