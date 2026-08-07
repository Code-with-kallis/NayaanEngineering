// src/components/team/TeamSection.jsx

import TeamGrid from "./TeamGrid";
import "./TeamSection.css";

function TeamSection({ id, title, description, members }) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className="team-section"
      aria-labelledby={headingId}
    >
      <div className="team-section__shell">
        <header className="team-section__header">
          <div className="team-section__copy">
            <h2 id={headingId} className="team-section__title">
              {title}
            </h2>

            {description && (
              <p className="team-section__description">
                {description}
              </p>
            )}
          </div>
        </header>

        {members.length > 0 ? (
          <TeamGrid members={members} />
        ) : (
          <p className="team-section__empty">
            Team details for this department are being updated.
          </p>
        )}
      </div>
    </section>
  );
}

export default TeamSection;