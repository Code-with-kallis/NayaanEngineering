import { Link } from "react-router-dom";
import styles from "./TeamProfileHero.module.css";

function TeamProfileHero({ employee }) {
  if (!employee) return null;

  const {
    name,
    designation,
    department,
    image,
    quote,
    contact,
  } = employee;

  return (
    <header className={styles.profileHero}>
      <div className={styles.profileHeroInner}>
        {/* Left Portrait Column */}
        <div className={styles.portraitColumn}>
          <div className={styles.media}>
            <img
              src={image || "/images/team/placeholder.jpg"}
              alt={name}
              className={styles.image}
            />
          </div>
        </div>

        {/* Right Details Column */}
        <div className={styles.details}>
          <div className={styles.roleTag}>
            <span className={styles.pulseDot} />
            {department}
          </div>

          <h1 className={styles.name}>{name}</h1>
          <p className={styles.designation}>{designation}</p>

          {/* Executive Quote */}
          {quote && (
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>“{quote}”</p>
              <span className={styles.quoteAuthor}>— {name}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className={styles.actions}>
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className={styles.btnPrimary}
              >
                Send Official Email
              </a>
            )}
            <Link to="/team" className={styles.btnOutline}>
              ← Back to Roster
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TeamProfileHero;