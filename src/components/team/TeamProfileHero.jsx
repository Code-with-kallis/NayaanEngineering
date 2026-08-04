// src/components/team/TeamProfileHero.jsx
import "./TeamProfileHero.css";

/**
 * TeamProfileHero — large profile-page hero for a single employee.
 * Single responsibility: identity display + primary contact action.
 *
 * @param {Object} props
 * @param {Object} props.employee - Employee object (see data/team.js shape)
 */
function TeamProfileHero({ employee }) {
  const { name, designation, department, image, contact } = employee;

  return (
    <section className="profile-hero" aria-labelledby="profile-hero-heading">
      <div className="container profile-hero__inner">
        <div className="profile-hero__media">
          <img
            src={image}
            alt={`Portrait of ${name}`}
            className="profile-hero__image"
          />
        </div>

        <div className="profile-hero__details">
          <h1 id="profile-hero-heading" className="profile-hero__name">
            {name}
          </h1>
          <p className="profile-hero__designation">{designation}</p>
          <p className="profile-hero__department">{department}</p>

          {contact?.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="profile-hero__contact-btn"
              aria-label={`Call ${name} at ${contact.phone}`}
            >
              Call {contact.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default TeamProfileHero;