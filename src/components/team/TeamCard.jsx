// src/components/team/TeamCard.jsx
import { Link } from "react-router-dom";
import { FaArrowRight, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "./TeamCard.css";

/**
 * TeamCard — single employee card. Single responsibility: display one
 * employee's identity + link into their profile. No data fetching.
 *
 * @param {Object} props
 * @param {Object} props.employee - Employee object (see data/team.js shape)
 * @param {"grid" | "compact"} [props.variant="grid"] - grid = Team page,
 *   compact = Previous/Next preview on TeamProfile page
 */
function TeamCard({ employee, variant = "grid" }) {
  const { employeeId, name, designation, department, image, contact } = employee;
  const hasPhone = Boolean(contact?.phone);
  const hasEmail = Boolean(contact?.email);

  return (
    <Link
      to={`/team/${employeeId}`}
      className={`team-card team-card--${variant}`}
      aria-label={`View profile of ${name}, ${designation}`}
    >
      <div className="team-card__media">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="team-card__image"
        />
      </div>

      <div className="team-card__body">
        {variant === "grid" && (
          <p className="team-card__department">{department}</p>
        )}

        <h3 className="team-card__name">{name}</h3>
        <p className="team-card__designation">{designation}</p>

        {variant === "grid" && (
          <>
            <div className="team-card__meta" aria-label="Profile details">
              {hasPhone && (
                <span className="team-card__meta-item">
                  <FaPhoneAlt aria-hidden="true" />
                  Direct contact
                </span>
              )}

              {hasEmail && (
                <span className="team-card__meta-item">
                  <FaEnvelope aria-hidden="true" />
                  Email available
                </span>
              )}

              {!hasPhone && !hasEmail && (
                <span className="team-card__meta-item team-card__meta-item--muted">
                  Profile available
                </span>
              )}
            </div>

            <div className="team-card__footer">
              <span className="team-card__link-label">View profile</span>
              <span className="team-card__link-icon" aria-hidden="true">
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
