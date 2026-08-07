import React, { Fragment } from "react";
import { FaArrowRight } from "react-icons/fa";
import styles from "./TeamHero.module.css";

function TeamHero({
  eyebrow,
  title,
  description,
  stats = [],
  image,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section
      className={styles.heroSection}
      aria-labelledby="team-hero-heading"
    >
      {/* Image Background */}
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
          {eyebrow && <p className={styles.greeting}>{eyebrow}</p>}
          <h1 id="team-hero-heading" className={styles.mainTitle}>
            {title}
          </h1>
          {description && <p className={styles.description}>{description}</p>}
          {(primaryAction || secondaryAction) && (
            <div className={styles.ctaGroup}>
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  <span>{primaryAction.label}</span>
                  <FaArrowRight aria-hidden="true" />
                </a>
              )}
              {secondaryAction && (
                <a
                  href={secondaryAction.href}
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  {secondaryAction.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Footer */}
      <div className={styles.heroFooter}>
        <div className={styles.footerLeft}>
          {stats.length > 0 && (
            <div
              className={styles.statsGroup}
              role="list"
              aria-label="Team statistics"
            >
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

      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollMouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
}

export default TeamHero;