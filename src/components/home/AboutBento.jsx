// src/components/home/AboutBento.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./AboutBento.module.css";

export default function AboutBento() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Smooth one-time trigger on mobile
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(entry.target); // Unobserve immediately to prevent scroll lag
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.aboutSection} ${isVisible ? styles.isVisible : ""}`}
      aria-label="About Nayaab Engineering"
    >
      <div className={styles.container}>
        {/* LEFT COLUMN: TEXT CONTENT */}
        <div className={styles.textContent}>
          <h2 className={styles.heading}>About Nayaab Engineering</h2>
          <div className={styles.accentLine} />

          <p className={styles.paragraph}>
            <strong>"NAYAAB"</strong> — incorporated in 2024 as a Private Limited Engineering Company (CIN: U42900JK2024PTC015987) under RoC Jammu, began its journey with a vision to deliver precision-engineered civil, structural, and modern architectural solutions.
          </p>

          <p className={styles.paragraph}>
            Over the years, Nayaab Engineering Innovations has established strong regional prominence across Jammu &amp; Kashmir with the combined leadership of its board of directors — <strong>Junaid Bilal Sheikh</strong>, <strong>Aaqib Nazir Tantary</strong>, and <strong>Saajid Rashid Malik</strong>.
          </p>

          <p className={styles.paragraph}>
            Upholding our core pillars — <em>'Commitment to Structural Integrity, Seismic Safety &amp; Architectural Innovation'</em>, we are recognized by <strong>DPIIT (#startupindia)</strong> under the Government of India, delivering compliant, turnkey engineering developments.
          </p>
        </div>

        {/* RIGHT COLUMN: BRAND LOGO */}
        <div className={styles.logoWrapper}>
          <img
            src="/logo-full-white.png"
            alt="Nayaab Engineering Emblem"
            className={styles.brandLogo}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}