import "./TeamHero.css";
import { FaArrowRight } from "react-icons/fa";
import React from "react";

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
      className="hero-section"
      aria-labelledby="team-hero-heading"
    >
      {/* Image Background */}
      <div className="hero-image-container">
        <div className="hero-image" style={{ backgroundImage: `url(${image})` }} />
        <div className="hero-overlay" />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="text-wrapper">
          {eyebrow && <p className="greeting">{eyebrow}</p>}
          <h1 id="team-hero-heading" className="main-title">
            {title}
          </h1>
          {description && <p className="description">{description}</p>}
          {(primaryAction || secondaryAction) && (
            <div className="cta-group">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className="btn btn-primary"
                >
                  <span>{primaryAction.label}</span>
                  <FaArrowRight aria-hidden="true" />
                </a>
              )}
              {secondaryAction && (
                <a
                  href={secondaryAction.href}
                  className="btn btn-outline"
                >
                  {secondaryAction.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Footer */}
      <div className="hero-footer">
        <div className="footer-left">
          {stats.length > 0 && (
            <div className="stats-group" role="list" aria-label="Team statistics">
              {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <div className="stat-item" role="listitem">
                    <span className="stat-number">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="stat-line" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="wheel" />
        </div>
      </div>
    </section>
  );
}

export default TeamHero;
