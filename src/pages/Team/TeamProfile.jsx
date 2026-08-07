import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import TeamProfileHero from "../../components/team/TeamProfileHero";
import { getEmployeeById, getAdjacentEmployees } from "../../data/team";
import styles from "./TeamProfile.module.css";

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
    <main id="main" className={styles.profilePage}>
      {/* Executive Profile Hero Section */}
      <TeamProfileHero employee={employee} />

      {/* Main Editorial Layout (2-Column Grid) */}
      <div className={styles.profileLayout}>
        {/* Left Primary Content Section */}
        <div className={styles.profileContent}>
          {/* Professional Biography */}
          <section
            className={styles.profileSection}
            aria-labelledby="overview-heading"
          >
            <h2 id="overview-heading" className={styles.profileSectionTitle}>
              Professional Overview
            </h2>

            <p className={styles.profileSectionBody}>
              {bio ||
                `${name} serves as ${designation} within ${department} at Nayaab Engineering Innovations, orchestrating operational strategy, structural integrity, and precision site execution.`}
            </p>
          </section>

          {/* Technical Skills & Competencies */}
          {skills.length > 0 && (
            <section
              className={styles.profileSection}
              aria-labelledby="skills-heading"
            >
              <h2 id="skills-heading" className={styles.profileSectionTitle}>
                Core Competencies & Expertise
              </h2>

              <ul className={styles.profileSkills} role="list">
                {skills.map((skill) => (
                  <li key={skill} className={styles.profileSkillsItem}>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar Metadata & Navigation Panels */}
        <aside className={styles.profileSidebar} aria-label="Executive Metadata">
          {/* Executive Information Panel */}
          <div className={styles.profilePanel}>
            <h3 className={styles.profilePanelTitle}>Executive Information</h3>
            <div className={styles.profileMeta}>
              <div className={styles.profileMetaRow}>
                <span className={styles.profileMetaLabel}>Employee ID</span>
                <span className={styles.profileMetaValue}>{id?.toUpperCase()}</span>
              </div>
              <div className={styles.profileMetaRow}>
                <span className={styles.profileMetaLabel}>Designation</span>
                <span className={styles.profileMetaValue}>{designation}</span>
              </div>
              <div className={styles.profileMetaRow}>
                <span className={styles.profileMetaLabel}>Department</span>
                <span className={styles.profileMetaValue}>{department}</span>
              </div>
              {contact?.email && (
                <div className={styles.profileMetaRow}>
                  <span className={styles.profileMetaLabel}>Official Email</span>
                  <span className={styles.profileMetaValue}>{contact.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Roster Navigation Cycling Panel */}
          {(previous || next) && (
            <div className={styles.profilePanel}>
              <h3 className={styles.profilePanelTitle}>Roster Navigation</h3>
              <div className={styles.profilePanelList}>
                {previous && (
                  <Link
                    to={`/team/${previous.employeeId}`}
                    className={styles.profileInfoCard}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <span className={styles.profileInfoCardLabel}>
                      ← Previous Profile
                    </span>
                    <p className={styles.profileInfoCardValue}>{previous.name}</p>
                  </Link>
                )}
                {next && (
                  <Link
                    to={`/team/${next.employeeId}`}
                    className={styles.profileInfoCard}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <span className={styles.profileInfoCardLabel}>
                      Next Profile →
                    </span>
                    <p className={styles.profileInfoCardValue}>{next.name}</p>
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