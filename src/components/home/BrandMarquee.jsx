// src/components/home/BrandMarquee.jsx
import React from "react";
import { FaAward, FaStar } from "react-icons/fa";
import styles from "./BrandMarquee.module.css";

const BRAND_PLATFORMS = [
  {
    name: "DPIIT",
    sub: "#startupindia",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgDpiit}`} aria-hidden="true">
        <FaAward className={styles.badgeSvgIcon} />
      </span>
    ),
  },
  {
    name: "StartupJK",
    sub: "Govt. of J&K",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgJk}`} aria-hidden="true">JK</span>
    ),
  },
  {
    name: "Google",
    sub: "Verified Business",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.brandSvg} aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    ),
  },
  {
    name: "Justdial",
    sub: "4.7 ★ Rated",
    isRating: true,
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgJustdial}`} aria-hidden="true">JD</span>
    ),
  },
  {
    name: "Dun & Bradstreet",
    sub: "Global Registry",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgDnb}`} aria-hidden="true">d&amp;b</span>
    ),
  },
  {
    name: "Zauba Corp",
    sub: "MCA / RoC Listed",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgZauba}`} aria-hidden="true">Z</span>
    ),
  },
  {
    name: "Tofler",
    sub: "Corporate Profile",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgTofler}`} aria-hidden="true">T</span>
    ),
  },
  {
    name: "The Company Check",
    sub: "Verified Registry",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgTcc}`} aria-hidden="true">✓</span>
    ),
  },
  {
    name: "Neusource",
    sub: "Civil Classified",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgNeu}`} aria-hidden="true">N</span>
    ),
  },
];

export default function BrandMarquee() {
  return (
    <section className={styles.brandMarqueeSection} aria-label="Recognized and Verified Portals">
      <div className={styles.brandMarqueeHeader}>
        <span className={styles.brandMarqueeEyebrow}>
          VERIFIED, LISTED &amp; RECOGNIZED ACROSS NATIONAL REGISTRIES
        </span>
      </div>

      <div className={styles.brandMarqueeViewport}>
        <div className={styles.brandMarqueeTrack}>
          {/* Primary List */}
          {BRAND_PLATFORMS.map((item, idx) => (
            <div key={`brand-primary-${idx}`} className={styles.brandItem}>
              {item.icon}
              <div className={styles.brandTextLockup}>
                <span className={styles.brandPrimary}>{item.name}</span>
                {item.isRating ? (
                  <span className={styles.brandRating}>
                    4.7 <FaStar className={styles.starIcon} aria-hidden="true" /> Rated
                  </span>
                ) : (
                  <span className={styles.brandSecondary}>{item.sub}</span>
                )}
              </div>
            </div>
          ))}

          {/* Duplicate List for Continuous Infinite Loop */}
          {BRAND_PLATFORMS.map((item, idx) => (
            <div key={`brand-duplicate-${idx}`} className={styles.brandItem} aria-hidden="true">
              {item.icon}
              <div className={styles.brandTextLockup}>
                <span className={styles.brandPrimary}>{item.name}</span>
                {item.isRating ? (
                  <span className={styles.brandRating}>
                    4.7 <FaStar className={styles.starIcon} /> Rated
                  </span>
                ) : (
                  <span className={styles.brandSecondary}>{item.sub}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thin Bottom Slider Line */}
      <div className={styles.bottomLineContainer} aria-hidden="true">
        <div className={styles.thinBottomSliderLine} />
      </div>
    </section>
  );
}