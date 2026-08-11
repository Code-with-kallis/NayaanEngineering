import React, { Fragment } from "react";
import { FaArrowRight } from "react-icons/fa";
import styles from "./TeamHero.module.css";

function TeamHero({
  image = "assets/team/team-hero.webp",
  stats = [],
}) {
  return (
    <section className={styles.heroSection} aria-labelledby="team-hero-heading">
      {/* Background Image Container & Overlay */}
      <div className={styles.heroImageContainer}>
        <div
          className={styles.heroImage}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <div className={styles.textWrapper}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>CORE TEAM</span>
          </div>

          <h1
            id="team-hero-heading"
            className={`${styles.mainTitle} ${styles.animateSlideLeft} ${styles.delay1}`}
          >
            Engineering
            <br />
            Built Around Expertise
          </h1>

          <h2 className={`${styles.subTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
            People. Precision. Performance.
          </h2>

          <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay3}`}>
            <a href="#leadership" className={`${styles.btn} ${styles.btnPrimary}`}>
              <span>Meet Our Team</span>
              <FaArrowRight aria-hidden="true" className={styles.btnIcon} />
            </a>
            <a href="/contact" className={`${styles.btn} ${styles.btnOutline}`}>
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Footer */}
      <div className={styles.heroFooter}>
        <div className={styles.footerLeft}>
          {stats.length > 0 && (
            <div className={styles.statsGroup} role="list" aria-label="Team statistics">
              {stats.map((stat, index) => (
                <Fragment key={stat.label}>
                  <div className={styles.statItem} role="listitem">
                    <span className={styles.statNumber}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className={styles.statLine} aria-hidden="true" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollMouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
}

export default TeamHero;