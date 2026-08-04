// src/components/team/TeamSection.jsx
import TeamGrid from "./TeamGrid";
import "./TeamSection.css";

/**
 * TeamSection — one full page section: heading + optional description + grid.
 * Single responsibility: section composition. Delegates card rendering to TeamGrid.
 *
 * @param {Object} props
 * @param {string} props.id - Anchor id for the section (e.g. "leadership")
 * @param {string} props.title - Section heading (e.g. "Leadership Team")
 * @param {string} [props.description] - Optional one-line section description
 * @param {Array<Object>} props.members - Employees to render in this section
 */
function TeamSection({ id, title, description, members }) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className="team-section"
      aria-labelledby={headingId}
    >
      <div className="container">
        <header className="team-section__header">
          <h2 id={headingId} className="team-section__title">
            {title}
          </h2>
          {description && (
            <p className="team-section__description">{description}</p>
          )}
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