// src/components/team/TeamProfileHero.jsx

import { Link } from "react-router-dom";
import "./TeamProfileHero.css";

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
    <header className="profile-hero">
      <div className="profile-hero__inner">
        {/* Left Portrait Column */}
        <div className="profile-hero__portrait-column">
          <div className="profile-hero__media">
            <img
              src={image || "/images/team/placeholder.jpg"}
              alt={name}
              className="profile-hero__image"
            />
          </div>
        </div>

        {/* Right Details Column */}
        <div className="profile-hero__details">
          <div className="profile-hero__role-tag">
            <span className="pulse-dot" />
            {department}
          </div>

          <h1 className="profile-hero__name">{name}</h1>
          <p className="profile-hero__designation">{designation}</p>

          {/* Executive Quote (If available) */}
          {quote && (
            <div className="profile-hero__quote-card">
              <p className="quote-text">“{quote}”</p>
              <span className="quote-author">— {name}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="profile-hero__actions">
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="btn-primary"
              >
                Send Official Email
              </a>
            )}
            <Link to="/team" className="btn-outline">
              ← Back to Roster
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TeamProfileHero;