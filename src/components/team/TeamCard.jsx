// src/components/team/TeamCard.jsx
import { Link } from "react-router-dom";
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
  const { employeeId, name, designation, department, image } = employee;

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
        <h3 className="team-card__name">{name}</h3>
        <p className="team-card__designation">{designation}</p>
        {variant === "grid" && (
          <p className="team-card__department">{department}</p>
        )}
      </div>
    </Link>
  );
}

export default TeamCard;