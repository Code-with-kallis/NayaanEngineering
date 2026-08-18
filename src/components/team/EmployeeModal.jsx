// src/components/team/EmployeeModal.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  const [activeEmployee, setActiveEmployee] = useState(null);

  const checkActiveEmployee = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get("member") || params.get("id");
    const hashId = window.location.hash ? window.location.hash.replace("#", "").trim() : "";
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
  }, []);

  // Sync with browser history and direct link mounts
  useEffect(() => {
    checkActiveEmployee();

    const handleUrlChange = () => {
      checkActiveEmployee();
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [checkActiveEmployee]);

  // Lock background scroll without resetting scroll position
  useEffect(() => {
    if (activeEmployee) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeEmployee]);

  const handleClose = () => {
    setActiveEmployee(null);
    
    // Cleanly strip query params without triggering route navigation
    const url = new URL(window.location.href);
    url.searchParams.delete("member");
    url.searchParams.delete("id");
    url.hash = "";
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeEmployee) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeEmployee]);

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
              <h3 className={styles.blockTitle}>Core Competencies &amp; Skills</h3>
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