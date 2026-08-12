import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import styles from "./TeamSection.module.css";

// 1. TEAM CARD COMPONENT
export function TeamCard({ employee }) {
  if (!employee) return null;

  const { employeeId, name, designation, image, bio } = employee;

  const shortBio = bio
    ? bio.split(" ").slice(0, 12).join(" ") + "..."
    : "";

  return (
    <Link
      to={`?member=${employeeId}`}
      className={styles.card}
      aria-label={`View profile of ${name}, ${designation}`}
    >
      {/* Circular Profile Avatar */}
      <div className={styles.imageContainer}>
        <img
          src={image || "/images/team/placeholder.jpg"}
          alt={name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.designation}>{designation}</p>
          {shortBio && <p className={styles.bio}>{shortBio}</p>}
        </div>

        <div className={styles.footer}>
          <div className={styles.profileBadge}>
            <span className={styles.badgeDot} />
            <span>Profile</span>
          </div>

          <div className={styles.arrowCircle}>
            <FaArrowUp className={styles.arrowIcon} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// 2. TEAM GRID COMPONENT
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