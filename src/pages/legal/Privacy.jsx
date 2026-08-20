// src/pages/legal/Privacy.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaUserShield, FaArrowLeft } from "react-icons/fa";
import styles from "./Legal.module.css";
import logo from "/logo.png";

const Privacy = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main className={styles.legalPage}>
      <Helmet>
        <title>Privacy Policy | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Privacy Policy for Nayaab Engineering Innovations Pvt. Ltd. Learn how we handle client documentation, data protection, and privacy compliance."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/privacy" />
      </Helmet>
      {/* Floating Bottom Back Button */}
      <button
        onClick={handleGoBack}
        className={styles.floatingBackBtn}
        aria-label="Back"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* Centered Top Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.centeredLogoWrapper}>
            <img
              src={logo}
              alt="Nayaab Engineering Innovations"
              className={styles.pageLogo}
              onClick={handleGoBack}
              title="Return to previous page"
            />
          </div>

          <div className={styles.headerBadge}>
            <FaUserShield />
            <span>DATA PRIVACY &amp; SECURITY</span>
          </div>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Compliance: Digital Personal Data Protection (DPDP) Act &amp; IT Act 2000
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.legalLayout}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
              <h3 className={styles.tocTitle}>Contents</h3>
              <nav className={styles.tocNav}>
                <a href="#overview">1. Data Controller Overview</a>
                <a href="#collection">2. Information Collected</a>
                <a href="#usage">3. Purpose of Processing</a>
                <a href="#newsletter">4. Newsletter Inquiries</a>
                <a href="#sharing">5. Third-Party Disclosures</a>
                <a href="#security">6. Data Security</a>
                <a href="#retention">7. Retention Schedule</a>
                <a href="#rights">8. Your Statutory Rights</a>
                <a href="#cookies">9. Cookies &amp; Storage</a>
                <a href="#grievance">10. Grievance Desk</a>
              </nav>
            </aside>

            {/* Document Body */}
            <article className={styles.documentBody}>
              <section id="overview" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>01</span> Data Controller Overview
                </h2>
                <p>
                  <strong>Nayaab Engineering Innovations Private Limited</strong> (CIN: U42900JK2024PTC015987) values your privacy[cite: 14]. This policy explains how we collect and safeguard personal information obtained through our contact and consultation portals[cite: 1].
                </p>
              </section>

              <section id="collection" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>02</span> Information Collected
                </h2>
                <p>We collect only parameters necessary for technical estimations and service delivery:</p>
                <ul className={styles.clauseList}>
                  <li><strong>Project Consultations:</strong> Name, phone number, email address, site location, and structural requirements[cite: 1].</li>
                  <li><strong>Newsletter Updates:</strong> Email address submitted via our footer updates form[cite: 1].</li>
                </ul>
              </section>

              <section id="usage" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>03</span> Purpose of Processing
                </h2>
                <div className={styles.factList}>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Project Estimations</span>
                    <strong className={styles.factValue}>Preparing structural estimates &amp; CAD blueprints</strong>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Client Consultation</span>
                    <strong className={styles.factValue}>Direct engineering discussions &amp; site visit setups</strong>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Statutory Compliance</span>
                    <strong className={styles.factValue}>Tax invoicing &amp; municipal compliance records</strong>
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Platform Security</span>
                    <strong className={styles.factValue}>Spam prevention &amp; bot verification</strong>
                  </div>
                </div>
              </section>

              <section id="newsletter" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>04</span> Newsletter Inquiries
                </h2>
                <p>
                  Email addresses submitted for updates are used exclusively for sending project releases and architectural insights[cite: 1].
                </p>
                <div className={styles.editorialQuote}>
                  <strong>Anti-Spam Commitment:</strong> We do not sell or exchange subscriber records. You may unsubscribe at any time by emailing <a href="mailto:info@nayaabengineering.com">info@nayaabengineering.com</a> with the subject <em>"Unsubscribe"</em>[cite: 1].
                </div>
              </section>

              <section id="sharing" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>05</span> Third-Party Disclosures
                </h2>
                <p>
                  <strong>We do not sell, rent, or trade personal data.</strong> Disclosures are limited to secure form delivery gateways strictly to deliver your inquiry to our corporate mailbox.
                </p>
              </section>

              <section id="security" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>06</span> Data Security
                </h2>
                <p>
                  All digital transmissions are protected by TLS/SSL encryption. Client blueprints and project files are stored on secure internal servers accessible only to authorized engineering personnel.
                </p>
              </section>

              <section id="retention" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>07</span> Retention Schedule
                </h2>
                <ul className={styles.clauseList}>
                  <li>Non-contracting inquiry records are removed after 24 months.</li>
                  <li>Structural and CAD calculation files are archived permanently for safety audits.</li>
                  <li>Invoicing and tax records are retained for 8 financial years under Indian taxation laws.</li>
                </ul>
              </section>

              <section id="rights" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>08</span> Your Statutory Rights
                </h2>
                <p>
                  Under Indian Data Protection laws, you retain the right to access, rectify, or request the deletion of your personal records from our communication databases.
                </p>
              </section>

              <section id="cookies" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>09</span> Cookies &amp; Storage
                </h2>
                <p>
                  We utilize lightweight client-side storage only to prevent duplicate subscription prompts. We do not employ third-party surveillance tracking pixels.
                </p>
              </section>

              <section id="grievance" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>10</span> Grievance Desk
                </h2>
                <div className={styles.contactBlock}>
                  <strong>Grievance Officer | Nayaab Engineering Innovations Pvt. Ltd.</strong>
                  <span>3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar, Baramulla, J&amp;K - 193101[cite: 1, 14]</span>
                  <span>Email: <a href="mailto:info@nayaabengineering.com">info@nayaabengineering.com</a>[cite: 1]</span>
                  <span>Phone: <a href="tel:+911952455465">+91 1952-455465</a>[cite: 1]</span>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Privacy;