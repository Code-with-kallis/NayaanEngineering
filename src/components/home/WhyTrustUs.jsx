// src/components/home/WhyTrustUs.jsx
import React from "react";
import {
  FaSquare,
  FaShieldAlt,
  FaAward,
  FaUsers,
} from "react-icons/fa";
import styles from "./WhyTrustUs.module.css";

export default function WhyTrustUs() {
  return (
    <section className={styles.whyTrustSection}>
      <div className={styles.splitHeaderContainer}>
        <div className={styles.splitHeaderLeft}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} />
            <span>Why Choose Us</span>
          </div>
          <h2 className={styles.splitTitle}>
            Why Clients &amp; Builders<br />Trust Nayaab Engineering
          </h2>
        </div>

        <div className={styles.splitHeaderRight}>
          <p className={styles.splitDesc}>
            From custom residential villas to commercial builds, we deliver end-to-end precision by combining
            regional architectural knowledge with strict civil engineering safety standards.
          </p>
        </div>
      </div>

      <div className={styles.splitContentGrid}>
        <div className={styles.splitImageCard}>
          <img src="/assets/team/sajid.jpeg" alt="Site Supervision" />
        </div>

        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIconBox}>
              <FaShieldAlt />
            </div>
            <div>
              <h3>Experienced Technical Team</h3>
              <p>
                Engineers and architects with hands-on understanding of regional terrain, soil specifications, and climate demands.
              </p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIconBox}>
              <FaAward />
            </div>
            <div>
              <h3>Rigorous Quality Control</h3>
              <p>
                Multi-point inspection checks at every stage, from foundation excavation to roof truss installation.
              </p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIconBox}>
              <FaUsers />
            </div>
            <div>
              <h3>Client-Centered Transparency</h3>
              <p>
                Clear project estimation, regular site progress reporting, and collaborative design adjustments throughout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}