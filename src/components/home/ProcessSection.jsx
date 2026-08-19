// src/components/home/ProcessSection.jsx
import React from "react";
import { FaSquare } from "react-icons/fa";
import styles from "./ProcessSection.module.css";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Initial Consultation & Design Brief",
    description:
      "We understand your architectural vision, site topography, and project requirements to map out a clear technical roadmap.",
  },
  {
    step: "02",
    title: "Structural Engineering & 3D Design",
    description:
      "Our team develops 2D architectural layouts, 3D exterior visualizations, and compliant structural load calculations.",
  },
  {
    step: "03",
    title: "On-Site Execution & Quality Control",
    description:
      "Rigorous site supervision ensuring structural integrity, material quality assurance, and adherence to safety norms.",
  },
  {
    step: "04",
    title: "Final Review & Handover",
    description:
      "Comprehensive structural evaluation and technical sign-off for a seamless and secure project handover.",
  },
];

export default function ProcessSection() {
  return (
    <section className={styles.processSection}>
      <div className={styles.splitHeaderContainer}>
        <div className={styles.splitHeaderLeft}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} />
            <span>Our Process</span>
          </div>
          <h2 className={styles.splitTitle}>
            Our 4-Step Process 
          </h2>
        </div>

        <div className={styles.splitHeaderRight}>
          <p className={styles.splitDesc}>
            A structured engineering workflow ensuring complete structural integrity, transparent communication, and timely execution.
          </p>
        </div>
      </div>

      <div className={styles.processGrid}>
        {PROCESS_STEPS.map((item) => (
          <div key={item.step} className={styles.processCard}>
            <span className={styles.stepNum}>{item.step}</span>
            <h3 className={styles.stepTitle}>{item.title}</h3>
            <p className={styles.stepDesc}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}