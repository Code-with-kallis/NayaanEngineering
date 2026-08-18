import React, { useEffect, useRef, useState } from "react";
import styles from "./StatsCounter.module.css";

const STATS_DATA = [
  {
    value: 350,
    suffix: "+",
    line1: "Completed",
    line2: "projects",
  },
  {
    value: 97,
    suffix: "%",
    line1: "Client",
    line2: "satisfaction",
  },
  {
    value: 10,
    suffix: "+",
    line1: "Years of",
    line2: "experiences",
  },
];

function StatItem({ value, suffix, line1, line2, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const duration = 2000;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, value]);

  return (
    <div className={styles.statItem}>
      <div className={styles.numberWrapper}>
        <span className={styles.number}>{count}</span>
        <span className={styles.suffix}>{suffix}</span>
      </div>
      <div className={styles.labelWrapper}>
        <span className={styles.labelLine}>{line1}</span>
        <span className={styles.labelLine}>{line2}</span>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.statsSection} ${isVisible ? styles.isVisible : ""}`}
      aria-label="Key Performance Statistics"
    >
      <div className={styles.statsContainer}>
        {STATS_DATA.map((item, index) => (
          <StatItem
            key={index}
            value={item.value}
            suffix={item.suffix}
            line1={item.line1}
            line2={item.line2}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}