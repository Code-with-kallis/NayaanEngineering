import React from "react";
import TeamGrid from "./TeamGrid";
import styles from "./TeamSection.module.css";

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