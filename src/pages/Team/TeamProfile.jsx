// src/pages/Team/TeamProfile.jsx
import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import TeamProfileHero from "../../components/team/TeamProfileHero";
import TeamCard from "../../components/team/TeamCard";
import {
  getEmployeeById,
  getAdjacentEmployees,
} from "../../data/team";
import "./TeamProfile.css";

function TeamProfile() {
  const { employeeId } = useParams();
  const employee = getEmployeeById(employeeId);

  useEffect(() => {
    if (employee) {
      document.title = `${employee.name} | Nayaab Engineering Innovations`;
    }
  }, [employee]);

  if (!employee) {
    return <Navigate to="/team" replace />;
  }

  const { previous, next } = getAdjacentEmployees(employeeId);
  const { bio, skills, projects, contact, name } = employee;

  return (
    <main id="main">
      <nav aria-label="Breadcrumb" className="profile-breadcrumb">
        <div className="container profile-breadcrumb__inner">
          <ol className="profile-breadcrumb__list">
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li aria-current="page">{name}</li>
          </ol>
        </div>
      </nav>

      <TeamProfileHero employee={employee} />

      <section className="container profile-section" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="profile-section__title">
          Professional Overview
        </h2>
        <p className="profile-section__body">
          {bio || `${name} contributes to Nayaab Engineering Innovations as ${employee.designation}, within ${employee.department}.`}
        </p>
      </section>

      {skills.length > 0 && (
        <section className="container profile-section" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="profile-section__title">
            Skills
          </h2>
          <ul className="profile-skills" role="list">
            {skills.map((skill) => (
              <li key={skill} className="profile-skills__item">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="container profile-section" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="profile-section__title">
            Projects
          </h2>
          <ul className="profile-projects" role="list">
            {projects.map((project) => (
              <li key={project.name} className="profile-projects__item">
                {project.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {contact?.phone && (
        <section className="container profile-section" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="profile-section__title">
            Contact
          </h2>
          <a href={`tel:${contact.phone}`} className="profile-section__contact-link">
            {contact.phone}
          </a>
        </section>
      )}

      <nav className="container profile-nav" aria-label="Other team members">
        {previous && (
          <div className="profile-nav__item profile-nav__item--previous">
            <span className="profile-nav__label">Previous</span>
            <TeamCard employee={previous} variant="compact" />
          </div>
        )}
        {next && (
          <div className="profile-nav__item profile-nav__item--next">
            <span className="profile-nav__label">Next</span>
            <TeamCard employee={next} variant="compact" />
          </div>
        )}
      </nav>
    </main>
  );
}

export default TeamProfile;