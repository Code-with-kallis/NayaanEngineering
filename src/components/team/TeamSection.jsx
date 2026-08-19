// src/components/team/TeamSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import styles from "./TeamSection.module.css";

// Automatically index all team images from assets/images/team/
const teamImages = import.meta.glob("../../assets/images/team/*", {
  eager: true,
  import: "default",
});

function resolveTeamImage(img) {
  if (!img) return "/images/team/placeholder.jpg";
  if (typeof img !== "string") return img;
  if (img.startsWith("http") || img.startsWith("data:") || img.startsWith("blob:")) {
    return img;
  }

  // Match filename against bundled assets
  const filename = img.split("/").pop();
  for (const path in teamImages) {
    if (path.endsWith(`/${filename}`)) {
      return teamImages[path];
    }
  }
  return img;
}

// 1. TEAM CARD COMPONENT
export function TeamCard({ employee }) {
  if (!employee) return null;

  const { employeeId, name, designation, image, bio } = employee;

  const shortBio = bio
    ? bio.split(" ").slice(0, 11).join(" ") + "..."
    : "";

  const handleCardClick = (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("member", employeeId);
    window.history.pushState({ member: employeeId }, "", url.toString());
    window.dispatchEvent(new Event("popstate"));
  };

  const imageSrc = resolveTeamImage(image);

  return (
    <a
      href={`?member=${employeeId}`}
      onClick={handleCardClick}
      className={styles.card}
      aria-label={`View profile of ${name}, ${designation}`}
    >
      {/* Profile Image Avatar */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={imageSrc}
            alt={name}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <span className={styles.statusDot} title="Active Member" aria-hidden="true" />
      </div>

      {/* Card Content & Details */}
      <div className={styles.content}>
        <div className={styles.headerInfo}>
          <span className={styles.designationTag}>{designation}</span>
          <h3 className={styles.name}>{name}</h3>
        </div>

        {shortBio && <p className={styles.bio}>{shortBio}</p>}

        {/* Tactile Action Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.viewProfileLabel}>View Profile</span>
          <div className={styles.actionIconBox} aria-hidden="true">
            <FaArrowRight className={styles.actionArrow} />
          </div>
        </div>
      </div>
    </a>
  );
}

// 2. TEAM GRID & MOBILE SLIDER COMPONENT
export function TeamGrid({ members }) {
  const gridRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSlider, setShowSlider] = useState(false);

  const handleScroll = () => {
    if (!gridRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    if (maxScroll > 5) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      setShowSlider(true);
    } else {
      setShowSlider(false);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [members]);

  if (!members || members.length === 0) return null;

  return (
    <div className={styles.gridContainer}>
      <div
        ref={gridRef}
        className={styles.grid}
        onScroll={handleScroll}
        role="list"
        aria-label="Team Members Roster"
      >
        {members.map((employee) => (
          <div key={employee.employeeId} className={styles.gridItem} role="listitem">
            <TeamCard employee={employee} />
          </div>
        ))}
      </div>

      {showSlider && (
        <div className={styles.sliderContainer} aria-hidden="true">
          <div className={styles.sliderTrack}>
            <div
              className={styles.sliderThumb}
              style={{
                transform: `translateX(${(scrollProgress / 100) * 60}px)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 3. MAIN TEAM SECTION COMPONENT
function TeamSection({ id, title, members = [] }) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
            <span className={styles.pillBadge}>Roster</span>
          </div>
        </header>

        {members.length > 0 ? (
          <TeamGrid members={members} />
        ) : (
          <div className={styles.emptyState}>
            <p>Department details are currently being updated.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamSection;