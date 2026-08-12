import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaEnvelope, 
  FaQrcode,
  FaBuilding,
  FaAward,
  FaLock,
  FaUserCheck,
  FaIdBadge
} from "react-icons/fa";
import { getEmployeeById } from "../../data/team";
import logo from "/logo-original.png";
import styles from "./TeamProfile.module.css";

function TeamProfile() {
  const { employeeId } = useParams();
  const employee = getEmployeeById(employeeId);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (employee) {
      document.title = `${employee.name} | Official ID Verification | NEIPL`;
      window.scrollTo(0, 0);

      // Simulate official security database check on QR scan
      const timer = setTimeout(() => {
        setIsVerifying(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [employee]);

  if (!employee) {
    return <Navigate to="/about" replace />;
  }

  const {
    employeeId: id,
    name,
    designation,
    department,
    contact,
    bio,
    image,
    gender,
    skills = [],
  } = employee;

  // 1. INITIAL SECURITY VERIFICATION LOADER SCREEN
  if (isVerifying) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingBrand}>
            <img src={logo} alt="NEIPL Logo" className={styles.loadingLogo} />
            <span className={styles.loadingBrandTitle}>NEIPL SECURITY PORTAL</span>
          </div>

          <div className={styles.spinnerContainer}>
            <div className={styles.pulseRing} />
            <FaLock className={styles.lockIcon} />
          </div>

          <div className={styles.loadingTextGroup}>
            <h2 className={styles.loadingTitle}>Verifying Employee Credentials...</h2>
            <p className={styles.loadingSub}>Authenticating Record ID #{id?.toUpperCase()}</p>
          </div>
        </div>
      </main>
    );
  }

  // 2. VERIFIED IDENTITY PROFILE VIEW
  return (
    <main id="main" className={styles.profilePage}>
      <div className={styles.container}>
        {/* Top Status Header */}
        <div className={styles.topNav}>
          <div className={styles.verificationStatusHeader}>
            <FaCheckCircle className={styles.statusHeaderIcon} />
            <span>Official Identity Record Verified</span>
          </div>
        </div>

        {/* ID Card Wrapper (Card style on Desktop, Direct Content on Mobile) */}
        <div className={styles.idCardContainer}>
          {/* Header Banner */}
          <div className={styles.cardHeader}>
            <div className={styles.brandInfo}>
              <img src={logo} alt="NEIPL Logo" className={styles.cardLogo} />
              <div>
                <span className={styles.companyTitle}>NAYAAB ENGINEERING INNOVATIONS PVT LTD</span>
                <span className={styles.cardSubtitle}>Corporate Identity &amp; Verification Portal</span>
              </div>
            </div>

            <div className={styles.verifiedBadge}>
              <FaShieldAlt className={styles.badgeIcon} />
              <span>VERIFIED RECORD</span>
            </div>
          </div>

          {/* Main Credentials Body */}
          <div className={styles.cardBody}>
            {/* Left/Top Column — Photo & Verification Badges */}
            <div className={styles.photoColumn}>
              <div className={styles.photoWrapper}>
                <div className={styles.avatarFrame}>
                  <img
                    src={image || "/images/team/placeholder.jpg"}
                    alt={name}
                    className={styles.avatarImage}
                  />
                </div>

                {/* Status Indicator (Placed Outside Image Frame) */}
                <div className={styles.statusIndicator}>
                  <span className={styles.statusDot} />
                  <span>STATUS: ACTIVE</span>
                </div>
              </div>

              <div className={styles.idMetaBlock}>
                <span className={styles.idMetaLabel}>EMPLOYEE ID</span>
                <span className={styles.idMetaValue}>{id?.toUpperCase()}</span>
              </div>

              {/* Essential Verification Data Grid */}
              <div className={styles.verificationDataGrid}>
                <div className={styles.verMetaItem}>
                  <span className={styles.verMetaLabel}>Gender</span>
                  <span className={styles.verMetaValue}>{gender || "Male"}</span>
                </div>
                <div className={styles.verMetaItem}>
                  <span className={styles.verMetaLabel}>Authority</span>
                  <span className={styles.verMetaValue}>NEIPL HR / RoC</span>
                </div>
              </div>

              {/* QR Verification Badge */}
              <div className={styles.qrVerificationBox}>
                <FaQrcode className={styles.qrIcon} />
                <div className={styles.qrTextGroup}>
                  <span className={styles.qrTitle}>Authentic Record</span>
                  <span className={styles.qrSub}>Encrypted Security Key Matched</span>
                </div>
              </div>
            </div>

            {/* Right/Bottom Column — Employee Details */}
            <div className={styles.infoColumn}>
              <div className={styles.personHeader}>
                <span className={styles.deptBadge}>
                  <FaBuilding className={styles.deptIcon} />
                  {department}
                </span>
                <h1 className={styles.personName}>{name}</h1>
                <p className={styles.personDesignation}>{designation}</p>
              </div>

              {/* Official Credentials Detail Table */}
              <div className={styles.credentialsTable}>
                <div className={styles.credRow}>
                  <span className={styles.credLabel}>
                    <FaIdBadge className={styles.credIcon} /> System ID
                  </span>
                  <span className={styles.credValue}>{id?.toUpperCase()}</span>
                </div>
                <div className={styles.credRow}>
                  <span className={styles.credLabel}>
                    <FaUserCheck className={styles.credIcon} /> Record Type
                  </span>
                  <span className={styles.credValue}>Permanent Executive</span>
                </div>
                <div className={styles.credRow}>
                  <span className={styles.credLabel}>
                    <FaBuilding className={styles.credIcon} /> Registration
                  </span>
                  <span className={styles.credValue}>RoC Jammu &amp; Kashmir</span>
                </div>
              </div>

              {/* Overview Section */}
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionHeading}>Professional Overview</h2>
                <p className={styles.overviewText}>
                  {bio ||
                    `${name} serves as ${designation} within ${department} at Nayaab Engineering Innovations Pvt. Ltd., leading key technical operations and field execution.`}
                </p>
              </div>

              {/* Core Competencies */}
              {skills.length > 0 && (
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Core Competencies &amp; Skills</h2>
                  <div className={styles.skillsList}>
                    {skills.map((skill) => (
                      <span key={skill} className={styles.skillChip}>
                        <FaAward className={styles.skillIcon} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Action & Record Metadata */}
              <div className={styles.actionFooter}>
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className={styles.emailBtn}
                  >
                    <FaEnvelope />
                    <span>Send Official Email</span>
                  </a>
                )}
                <div className={styles.recordMeta}>
                  <span>System Entry: <strong>VERIFIED</strong></span>
                  <span>Security Protocol: <strong>NEIPL-SEC-v2</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Text Link Footer */}
          <div className={styles.cardFooter}>
            <a 
              href="https://www.nayaabengineering.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.websiteLink}
            >
              www.nayaabengineering.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TeamProfile;