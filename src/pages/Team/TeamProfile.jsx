// src/pages/Team/TeamProfile.jsx

import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import TeamProfileHero from "../../components/team/TeamProfileHero";
import { getEmployeeById } from "../../data/team";
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

  const { bio, skills, projects, name } = employee;

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

      <section
        className="container profile-section"
        aria-labelledby="overview-heading"
      >
        <h2 id="overview-heading" className="profile-section__title">
          Professional Overview
        </h2>

        <p className="profile-section__body">
          {bio ||
            `${name} contributes to Nayaab Engineering Innovations as ${employee.designation}, within ${employee.department}.`}
        </p>
      </section>

      {skills.length > 0 && (
        <section
          className="container profile-section"
          aria-labelledby="skills-heading"
        >
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
        <section
          className="container profile-section"
          aria-labelledby="projects-heading"
        >
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
    </main>
  );
}

export default TeamProfile;