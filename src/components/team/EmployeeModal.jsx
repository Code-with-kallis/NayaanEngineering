import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { 
  FaTimes, 
  FaEnvelope, 
  FaBuilding, 
  FaAward, 
  FaQuoteLeft, 
  FaIdCard 
} from "react-icons/fa";
import { teamMembers, getEmployeeById } from "../../data/team";
import styles from "./EmployeeModal.module.css";

function EmployeeModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeEmployee, setActiveEmployee] = useState(null);

  useEffect(() => {
    // 1. Check Query Params (?member=neipl-0101 or ?id=neipl-0101)
    const paramId = searchParams.get("member") || searchParams.get("id");

    // 2. Fallback to URL Hash (#neipl-0101)
    const hashId = location.hash ? location.hash.replace("#", "").trim() : "";

    const targetId = (paramId || hashId || "").toLowerCase();

    if (targetId) {
      const found =
        teamMembers.find(
          (m) =>
            (m.employeeId && m.employeeId.toLowerCase() === targetId) ||
            (m.id && m.id.toLowerCase() === targetId)
        ) || (getEmployeeById ? getEmployeeById(targetId) : null);

      setActiveEmployee(found || null);
    } else {
      setActiveEmployee(null);
    }
  }, [location, searchParams]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (activeEmployee) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeEmployee]);

  const handleClose = () => {
    setActiveEmployee(null);
    // Clear query params & hash cleanly from URL
    navigate(location.pathname, { replace: true });
  };

  if (!activeEmployee) return null;

  const {
    employeeId: id,
    name,
    designation,
    department,
    contact,
    bio,
    quote,
    image,
    skills = [],
  } = activeEmployee;

  return (
    <div className={styles.overlay} onClick={handleClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          type="button" 
          className={styles.closeBtn} 
          onClick={handleClose} 
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <span className={styles.deptBadge}>
            <FaBuilding /> {department}
          </span>
          <span className={styles.idTag}>
            <FaIdCard /> ID: {id?.toUpperCase()}
          </span>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Top Profile Summary */}
          <div className={styles.profileSummary}>
            <div className={styles.avatarFrame}>
              <img
                src={image || "/images/team/placeholder.jpg"}
                alt={name}
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.summaryDetails}>
              <h2 className={styles.memberName}>{name}</h2>
              <p className={styles.memberDesignation}>{designation}</p>

              {contact?.email && (
                <a href={`mailto:${contact.email}`} className={styles.emailBtn}>
                  <FaEnvelope />
                  <span>Send Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Quote Block */}
          {quote && (
            <div className={styles.quoteBox}>
              <FaQuoteLeft className={styles.quoteIcon} />
              <p className={styles.quoteText}>“{quote}”</p>
            </div>
          )}

          {/* Biography Block */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.blockTitle}>Professional Overview</h3>
            <p className={styles.blockBody}>
              {bio ||
                `${name} serves as ${designation} within ${department} at Nayaab Engineering Innovations Pvt. Ltd., leading key technical operations and field execution.`}
            </p>
          </div>

          {/* Core Competencies */}
          {skills.length > 0 && (
            <div className={styles.sectionBlock}>
              <h3 className={styles.blockTitle}>Core Competencies & Skills</h3>
              <div className={styles.skillsGrid}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.skillChip}>
                    <FaAward className={styles.skillIcon} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeModal;