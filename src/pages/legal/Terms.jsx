// src/pages/legal/Terms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileContract, FaArrowLeft } from "react-icons/fa";
import styles from "./Legal.module.css";
import logo from "/logo.png";

const Terms = () => {
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
            <FaFileContract />
            <span>LEGAL GOVERNANCE</span>
          </div>
          <h1 className={styles.pageTitle}>Terms &amp; Conditions</h1>
          <p className={styles.lastUpdated}>
            Document ID: NEI-TOS-V1
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
                <a href="#acceptance">1. Acceptance of Terms</a>
                <a href="#corporate-profile">2. Corporate Entity</a>
                <a href="#engineering-scope">3. Engineering Scope</a>
                <a href="#ip-rights">4. Intellectual Property</a>
                <a href="#approvals">5. Permits &amp; Compliance</a>
                <a href="#billing">6. Quotations &amp; Payments</a>
                <a href="#liability">7. Limitation of Liability</a>
                <a href="#jurisdiction">8. Governing Jurisdiction</a>
                <a href="#contact">9. Contact Information</a>
              </nav>
            </aside>

            {/* Document Body */}
            <article className={styles.documentBody}>
              <section id="acceptance" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>01</span> Acceptance of Terms
                </h2>
                <p>
                  These Terms and Conditions govern your engagement with <strong>Nayaab Engineering Innovations Private Limited</strong>. By commissioning architectural drawings, requesting structural estimates, or utilizing our civil construction services, you agree to comply with these terms.
                </p>
              </section>

              <section id="corporate-profile" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>02</span> Corporate Entity &amp; Registry
                </h2>
                <p>
                  Nayaab Engineering Innovations Private Limited is a registered private limited company under the Companies Act, 2013 with the Ministry of Corporate Affairs (MCA), Government of India[cite: 14].
                </p>
                <div className={styles.factList}>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Corporate ID (CIN)</span>
                    <strong className={styles.factValue}>U42900JK2024PTC015987</strong>[cite: 14]
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Startup India Recognition</span>
                    <strong className={styles.factValue}>DPIIT Certificate DIPP180810</strong>[cite: 14]
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Industry Code</span>
                    <strong className={styles.factValue}>NIC Code 42 — Civil Construction</strong>[cite: 14]
                  </div>
                  <div className={styles.factRow}>
                    <span className={styles.factLabel}>Registrar Office</span>
                    <strong className={styles.factValue}>RoC Jammu, J&amp;K</strong>[cite: 14]
                  </div>
                </div>
              </section>

              <section id="engineering-scope" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>03</span> Engineering &amp; Turnkey Scope
                </h2>
                <p>
                  Our services encompass 3D architectural modeling, structural analysis, CAD drafting, and turnkey construction management:
                </p>
                <ul className={styles.clauseList}>
                  <li><strong>Conceptual Visualizations:</strong> 3D renders and isometric elevations are conceptual and finalized through on-site geotechnical evaluations.</li>
                  <li><strong>Sealed Drawings:</strong> Only blueprints verified and signed by our certified structural engineers serve as physical construction specifications.</li>
                </ul>
              </section>

              <section id="ip-rights" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>04</span> Intellectual Property
                </h2>
                <p>
                  All structural blueprints, CAD sheets, 3D renderings, and technical documentation developed by Nayaab Engineering Innovations Pvt. Ltd. remain company intellectual property. Clients are granted a single-structure deployment license upon complete fee settlement.
                </p>
              </section>

              <section id="approvals" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>05</span> Municipal Approvals &amp; Seismic Safety
                </h2>
                <p>
                  Our structural designs comply with Indian Standard (IS) codes for high-risk Seismic Zone-V conditions prevalent across Jammu &amp; Kashmir[cite: 14].
                </p>
                <ul className={styles.clauseList}>
                  <li><strong>Municipal Sanctions:</strong> Property owners are responsible for local town planning clearances unless contracted under our complete turnkey liaison scope.</li>
                  <li><strong>Site Boundaries:</strong> Clients must ensure accurate land demarcation and unhindered site access for soil testing.</li>
                </ul>
              </section>

              <section id="billing" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>06</span> Quotations &amp; Milestone Billing
                </h2>
                <p>
                  Project estimates are valid for 30 calendar days due to market fluctuations in steel, cement, and logistics indices. On-site execution progresses per contract milestone schedules.
                </p>
              </section>

              <section id="liability" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>07</span> Limitation of Liability
                </h2>
                <p>
                  Nayaab Engineering Innovations Pvt. Ltd. is not liable for execution delays caused by <strong>Force Majeure events</strong>, including severe weather disruptions (snowstorms, landslides), national highway logistical closures, or government transit restrictions.
                </p>
              </section>

              <section id="jurisdiction" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>08</span> Governing Jurisdiction
                </h2>
                <p>
                  These Terms are governed by the laws of India. Any dispute that cannot be resolved mutually shall fall under the exclusive jurisdiction of the competent courts in <strong>Baramulla / Srinagar, Jammu &amp; Kashmir</strong>.
                </p>
              </section>

              <section id="contact" className={styles.clause}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNumber}>09</span> Legal Desk Contact
                </h2>
                <div className={styles.contactBlock}>
                  <strong>Nayaab Engineering Innovations Pvt. Ltd.</strong>
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

export default Terms;