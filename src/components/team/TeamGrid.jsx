import React, { useRef, useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import styles from "./TeamGrid.module.css";

function TeamGrid({ members }) {
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

      {/* Interactive Slider Bar Below Cards */}
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

export default TeamGrid;