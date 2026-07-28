import { useNavigate } from "react-router-dom";
import teamData from "./teamData";
import "./Team.css";

const whyTeamFeatures = [
  {
    id: "excellence",
    title: "Engineering Excellence",
    description:
      "Every project is executed to exacting technical standards, backed by rigorous quality assurance and precision at every stage.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4L6 12v12c0 12 8 18 18 20 10-2 18-8 18-20V12L24 4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M17 24l5 5 10-11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "We invest in emerging technologies and modern methodologies to deliver forward-thinking, future-ready engineering solutions.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 6c-7.2 0-13 5.8-13 13 0 5 2.7 9.3 6.7 11.6V34a2 2 0 002 2h8.6a2 2 0 002-2v-3.4C34.3 28.3 37 24 37 19c0-7.2-5.8-13-13-13z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M20 40h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "customer-commitment",
    title: "Customer Commitment",
    description:
      "Our teams work closely with clients from concept through delivery, ensuring transparency, accountability, and measurable results.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 40c0-7.7 6.3-14 14-14s14 6.3 14 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "industry-experience",
    title: "Industry Experience",
    description:
      "Decades of combined expertise across structural, electrical, and industrial systems give us the insight to solve complex challenges.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="18" width="32" height="20" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M17 18v-4a7 7 0 0114 0v4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 26h32" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

function TeamMemberCard({ member }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/team/${member.slug}`);
  };

  return (
    <article className="team-card">
      <div className="team-card__image-wrapper">
        <img
          src={member.image}
          alt={`${member.name}, ${member.designation}`}
          className="team-card__image"
          loading="lazy"
        />
      </div>

      <div className="team-card__body">
        <p className="team-card__department">{member.department}</p>
        <h3 className="team-card__name">{member.name}</h3>
        <p className="team-card__designation">{member.designation}</p>
        <p className="team-card__bio">{member.bio}</p>

        <ul className="team-card__meta">
          <li className="team-card__meta-item">
            <span className="team-card__meta-label">Experience</span>
            <span className="team-card__meta-value">{member.experience}</span>
          </li>
        </ul>

        <div className="team-card__contact">
          <a href={`mailto:${member.email}`} className="team-card__contact-link">
            {member.email}
          </a>
          <a href={`tel:${member.phone.replace(/\s+/g, "")}`} className="team-card__contact-link">
            {member.phone}
          </a>
        </div>

        <div className="team-card__footer">
          <button
            type="button"
            className="team-card__profile-btn"
            onClick={handleViewProfile}
          >
            View Profile
            <span className="team-card__profile-arrow" aria-hidden="true">
              &rarr;
            </span>
          </button>

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card__linkedin"
              aria-label={`${member.name} on LinkedIn`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Team() {
  return (
    <>

      <main className="team-page">
        <section className="team-hero">
          <div className="team-hero__pattern" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" />
              <circle cx="70" cy="30" r="1.5" fill="currentColor" />
              <circle cx="110" cy="30" r="1.5" fill="currentColor" />
              <circle cx="150" cy="30" r="1.5" fill="currentColor" />
              <circle cx="30" cy="70" r="1.5" fill="currentColor" />
              <circle cx="70" cy="70" r="1.5" fill="currentColor" />
              <circle cx="110" cy="70" r="1.5" fill="currentColor" />
              <circle cx="150" cy="70" r="1.5" fill="currentColor" />
              <path d="M0 100h200M100 0v200" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="team-hero__content">
            <p className="team-hero__eyebrow">Nayaab Engineering Innovations Pvt. Ltd.</p>
            <h1 className="team-hero__title">Meet Our Team</h1>
            <p className="team-hero__subtitle">
              A multidisciplinary group of engineers, strategists, and industry leaders
              dedicated to delivering resilient infrastructure and precision-driven
              solutions for clients across every sector we serve.
            </p>
          </div>
        </section>

        <section className="team-intro">
          <div className="team-intro__container">
            <h2 className="team-intro__title">The People Behind Our Engineering</h2>
            <p className="team-intro__text">
              Our leadership team combines decades of hands-on engineering experience
              with a shared commitment to safety, innovation, and client success. Each
              member brings specialized expertise spanning structural design, electrical
              systems, operations, and technology, ensuring every project is guided by
              proven judgment and rigorous technical standards.
            </p>
          </div>
        </section>

        <section className="team-grid-section">
          <div className="team-grid-section__container">
            <div className="team-grid">
              {teamData.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>

        <section className="why-team">
          <div className="why-team__container">
            <div className="why-team__header">
              <h2 className="why-team__title">Why Our Team Stands Out</h2>
              <p className="why-team__subtitle">
                Our people are the foundation of every solution we deliver, backed by
                proven methodology and an unwavering focus on quality.
              </p>
            </div>

            <div className="why-team__grid">
              {whyTeamFeatures.map((feature) => (
                <div className="why-team__card" key={feature.id}>
                  <div className="why-team__icon">{feature.icon}</div>
                  <h3 className="why-team__card-title">{feature.title}</h3>
                  <p className="why-team__card-text">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="team-cta">
          <div className="team-cta__container">
            <h2 className="team-cta__title">Need Engineering Expertise?</h2>
            <p className="team-cta__text">
              Connect with our experienced professionals today and discover how Nayaab
              Engineering Innovations can support your next project from concept to
              completion.
            </p>
            <a href="/contact" className="team-cta__button">
              Contact Our Team
            </a>
          </div>
        </section>
      </main>

    </>
  );
}

export default Team;
