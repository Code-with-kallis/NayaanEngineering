// src/pages/Team/TeamProfile.jsx

import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import TeamProfileHero from "../../components/team/TeamProfileHero";
import { getEmployeeById, getAdjacentEmployees } from "../../data/team";
import "./TeamProfile.css";

function TeamProfile() {
  const { employeeId } = useParams();
  const employee = getEmployeeById(employeeId);
  const { previous, next } = getAdjacentEmployees(employeeId);

  useEffect(() => {
    if (employee) {
      document.title = `${employee.name} | Executive Profile | Nayaab Engineering Innovations`;
      window.scrollTo(0, 0);
    }
  }, [employee]);

  if (!employee) {
    return <Navigate to="/team" replace />;
  }

  const {
    employeeId: id,
    name,
    designation,
    department,
    contact,
    bio,
    skills = [],
  } = employee;

  return (
    <main id="main" className="profile-page">
      {/* Executive Profile Hero Section */}
      <TeamProfileHero employee={employee} />

      {/* Main Editorial Layout (2-Column Grid) */}
      <div className="profile-layout">
        {/* Left Primary Content Section */}
        <div className="profile-content">
          {/* Professional Biography */}
          <section
            className="profile-section"
            aria-labelledby="overview-heading"
          >
            <h2 id="overview-heading" className="profile-section__title">
              Professional Overview
            </h2>

            <p className="profile-section__body">
              {bio ||
                `${name} serves as ${designation} within ${department} at Nayaab Engineering Innovations, orchestrating operational strategy, structural integrity, and precision site execution.`}
            </p>
          </section>

          {/* Technical Skills & Competencies */}
          {skills.length > 0 && (
            <section
              className="profile-section"
              aria-labelledby="skills-heading"
            >
              <h2 id="skills-heading" className="profile-section__title">
                Core Competencies & Expertise
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
        </div>

        {/* Right Sticky Sidebar Metadata & Navigation Panels */}
        <aside className="profile-sidebar" aria-label="Executive Metadata">
          {/* Executive Information Panel */}
          <div className="profile-panel">
            <h3 className="profile-panel__title">Executive Information</h3>
            <div className="profile-meta">
              <div className="profile-meta__row">
                <span className="profile-meta__label">Employee ID</span>
                <span className="profile-meta__value">{id?.toUpperCase()}</span>
              </div>
              <div className="profile-meta__row">
                <span className="profile-meta__label">Designation</span>
                <span className="profile-meta__value">{designation}</span>
              </div>
              <div className="profile-meta__row">
                <span className="profile-meta__label">Department</span>
                <span className="profile-meta__value">{department}</span>
              </div>
              {contact?.email && (
                <div className="profile-meta__row">
                  <span className="profile-meta__label">Official Email</span>
                  <span className="profile-meta__value">{contact.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Roster Navigation Cycling Panel */}
          {(previous || next) && (
            <div className="profile-panel">
              <h3 className="profile-panel__title">Roster Navigation</h3>
              <div className="profile-panel__list">
                {previous && (
                  <Link
                    to={`/team/${previous.employeeId}`}
                    className="profile-info-card"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <span className="profile-info-card__label">
                      ← Previous Profile
                    </span>
                    <p className="profile-info-card__value">{previous.name}</p>
                  </Link>
                )}
                {next && (
                  <Link
                    to={`/team/${next.employeeId}`}
                    className="profile-info-card"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <span className="profile-info-card__label">
                      Next Profile →
                    </span>
                    <p className="profile-info-card__value">{next.name}</p>
                  </Link>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

export default TeamProfile;