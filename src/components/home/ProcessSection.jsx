// src/components/home/ProcessSection.jsx
import React from "react";
import { FaSquare } from "react-icons/fa";
import styles from "./ProcessSection.module.css";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Initial Consultation & Design Brief",
    description:
      "We evaluate your architectural vision, terrain conditions, and technical needs to establish a detailed project blueprint.",
  },
  {
    step: "02",
    title: "Structural Engineering & 3D Design",
    description:
      "Our team prepares precision 2D CAD drawings, 3D elevation renders, and fully compliant structural load calculations.",
  },
  {
    step: "03",
    title: "On-Site Execution & Quality Control",
    description:
      "Our engineers execute on-site supervision, material quality testing, and strict structural compliance verifications.",
  },
  {
    step: "04",
    title: "Final Review & Project Handover",
    description:
      "We conduct exhaustive structural safety audits, code compliance checks, and formal turnkey project handovers.",
  },
];

export default function ProcessSection() {
  return (
    <section className={styles.processSection} aria-labelledby="process-section-title">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
              <span>Our Workflow</span>
            </div>
            <h2 id="process-section-title" className={styles.splitTitle}>
              Our 4-Step <span className={styles.titleGrey}>Process</span>
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              A structured engineering workflow ensuring complete structural integrity, transparent communication, and timely execution.
            </p>
          </div>
        </div>

        {/* Direct-on-Background Editorial Process Items */}
        <div className={styles.processGrid}>
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className={styles.processItem}>
              <span className={styles.stepNum}>{item.step}</span>
              <div className={styles.stepDivider} />
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}