import { Link } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import styles from "./TeamCard.module.css";

/**
 * TeamCard — single employee card.
 *
 * @param {Object} props
 * @param {Object} props.employee - Employee object
 * @param {"grid" | "compact"} [props.variant="grid"]
 */
function TeamCard({ employee, variant = "grid" }) {
  const { employeeId, name, designation, department, image, contact } = employee;
  const hasPhone = Boolean(contact?.phone);
  const hasEmail = Boolean(contact?.email);

  return (
    <Link
      to={`/team/${employeeId}`}
      className={`${styles.teamCard} ${styles[variant] || ""}`.trim()}
      aria-label={`View profile of ${name}, ${designation}`}
    >
      <div className={styles.media}>
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        {variant === "grid" && (
          <p className={styles.department}>{department}</p>
        )}

        <h3 className={styles.name}>{name}</h3>
        <p className={styles.designation}>{designation}</p>

        {variant === "grid" && (
          <>
            <div className={styles.meta} aria-label="Profile details">
              {hasPhone && (
                <span className={styles.metaItem}>
                  <FaPhoneAlt aria-hidden="true" />
                  Direct contact
                </span>
              )}

              {hasEmail && (
                <span className={styles.metaItem}>
                  <FaEnvelope aria-hidden="true" />
                  Email available
                </span>
              )}

              {!hasPhone && !hasEmail && (
                <span className={`${styles.metaItem} ${styles.muted}`}>
                  Profile available
                </span>
              )}
            </div>

            <div className={styles.footer}>
              <span className={styles.linkLabel}>View profile</span>
              <span className={styles.linkIcon} aria-hidden="true">
                <FaArrowRight />
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

export default TeamCard;