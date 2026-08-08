import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaPlay, 
  FaSquare, 
  FaMicrochip, 
  FaAward, 
  FaUsers, 
  FaCheckCircle, 
  FaShieldAlt,
  FaUserTie
} from "react-icons/fa";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import styles from "./About.module.css";

const DIRECTORS = [
  {
    name: "Junaid Bilal Sheikh",
    role: "Director",
    image: "/assets/team/director-01.webp"
  },
  {
    name: "Aaqib Nazir Tantary",
    role: "Director",
    image: "/assets/team/director-02.webp"
  },
  {
    name: "Saajid Rashid Malik",
    role: "Director",
    image: "/assets/team/director-03.webp"
  }
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Initial Consultation & Design Brief",
    description: "We understand your architectural vision, site topography, and project requirements to map out a clear technical roadmap."
  },
  {
    step: "02",
    title: "Structural Engineering & 3D Design",
    description: "Our team develops 2D architectural layouts, 3D exterior visualizations, and compliant structural load calculations."
  },
  {
    step: "03",
    title: "On-Site Execution & Quality Control",
    description: "Rigorous site supervision ensuring structural integrity, material quality assurance, and adherence to safety norms."
  },
  {
    step: "04",
    title: "Final Review & Handover",
    description: "Comprehensive structural evaluation and technical sign-off for a seamless and secure project handover."
  }
];

export default function About() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <main className={styles.aboutPage}>
      {/* ================= HERO SECTION ================= */}
      <section className={styles.heroSection}>
        <div className={styles.breadcrumb}>
          <FaHome className={styles.homeIcon} />
          <span>Home</span>
          <span className={styles.slash}>/</span>
          <strong className={styles.activeBreadcrumb}>About</strong>
        </div>

        <h1 className={styles.heroTitle}>
          Crafting Spaces, <span className={styles.titleMuted}>Shaping Futures</span>
        </h1>

        <p className={styles.heroSubtitle}>
          At Nayaab Engineering Innovations, every project begins with purpose and is driven by technical precision. 
          We bring together structural compliance, modern architectural planning, and disciplined site execution across Jammu &amp; Kashmir.
        </p>

        <Link to="/contact" className={styles.heroBtn}>
          Contact Us
        </Link>

        {/* 3-IMAGE HERO GALLERY COMPOSITION WITH CUT CORNERS */}
        <div className={styles.heroGallery}>
          <div className={styles.heroImgLeft}>
            <img src="/assets/projects/proj-01.webp" alt="Civil Engineering Site" />
          </div>

          <div className={styles.heroImgCenter}>
            <img src="/assets/projects/proj-04.webp" alt="3D Architectural Visualization" />
            <button 
              className={styles.playBtn} 
              onClick={() => setIsVideoOpen(true)}
              aria-label="Play Overview Video"
            >
              <FaPlay className={styles.playIcon} />
            </button>
          </div>

          <div className={styles.heroImgRight}>
            <img src="/assets/projects/proj-02.webp" alt="Construction Management" />
          </div>
        </div>
      </section>

      {/* ================= STATS BENTO GRID SECTION ================= */}
      <section className={styles.statsSection}>
        <div className={styles.sectionTagRow}>
          <FaSquare className={styles.tagSquareIcon} />
          <span>About Our Company</span>
        </div>

        <div className={styles.sectionHeaderCentered}>
          <h2 className={styles.sectionTitle}>
            Driven by Quality.
          </h2>
          <p className={styles.sectionDescription}>
            Bringing a hands-on, client-first approach to civil and architectural engineering. 
            Incorporated in 2024 and headquartered in Baramulla, we combine formal corporate standards with regional expertise.
          </p>
        </div>

        {/* BENTO GRID WITH REAL COMPANY DATA */}
        <div className={styles.bentoGrid}>
          {/* Card 1: Main Company Profile */}
          <div className={`${styles.bentoCard} ${styles.cardLarge}`}>
            <div className={styles.brandHeader}>
              <div className={styles.logoBadge}>NEI</div>
              <span className={styles.brandName}>Nayaab Engineering</span>
            </div>
            <div className={styles.bigStatNum}>2024</div>
            <p className={styles.bentoText}>
              Incorporated as a Private Limited Engineering Company (CIN: U42900JK2024PTC015987) under RoC Jammu.
            </p>
            <div className={styles.avatarStack}>
              <div className={styles.avatar} title="Junaid Bilal Sheikh">J</div>
              <div className={styles.avatar} title="Aaqib Nazir Tantary">A</div>
              <div className={styles.avatar} title="Saajid Rashid Malik">S</div>
              <div className={styles.avatarPlus}>+</div>
            </div>
          </div>

          {/* Card 2 & 3 Stack (Middle) */}
          <div className={styles.bentoStack}>
            <div className={styles.bentoCard}>
              <div className={styles.cardIconBox}>
                <FaMicrochip />
              </div>
              <h4 className={styles.cardSmallTitle}>Modern Technology</h4>
              <p className={styles.cardSmallDesc}>
                We integrate 3D CAD modeling, elevation renders, and structural engineering software for technical accuracy.
              </p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.cardIconBox}>
                <FaAward />
              </div>
              <div className={styles.mediumStatNum}>DPIIT</div>
              <p className={styles.cardSmallDesc}>Recognized Startup in Construction &amp; Civil Engineering by Govt. of India.</p>
            </div>
          </div>

          {/* Card 4 & 5 Stack (Right) */}
          <div className={styles.bentoStack}>
            <div className={styles.bentoCard}>
              <div className={styles.cardIconBox}>
                <FaCheckCircle />
              </div>
              <div className={styles.mediumStatNum}>100%</div>
              <p className={styles.cardSmallDesc}>Commitment to structural safety, material standards, and compliance.</p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.cardIconBox}>
                <FaUsers />
              </div>
              <h4 className={styles.cardSmallTitle}>Experienced Leadership</h4>
              <p className={styles.cardSmallDesc}>
                Led by a board of three directors dedicated to advancing infrastructure and residential builds in J&amp;K.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.centerBtnRow}>
          <Link to="/projects" className={styles.outlineBtn}>
            Learn More
          </Link>
        </div>
      </section>

      {/* ================= WHY BUILDERS TRUST US SECTION ================= */}
      <section className={styles.whyTrustSection}>
        <div className={styles.sectionTagRow}>
          <FaSquare className={styles.tagSquareIcon} />
          <span>Why Choose Us</span>
        </div>

        <div className={styles.splitHeader}>
          <h2 className={styles.splitTitle}>
            Why Clients &amp; Builders<br />Trust Nayaab Engineering
          </h2>
          <p className={styles.splitDesc}>
            From custom residential villas to commercial builds, we deliver end-to-end precision by combining 
            regional architectural knowledge with strict civil engineering safety standards.
          </p>
        </div>

        <div className={styles.splitContentGrid}>
          <div className={styles.splitImageCard}>
            <img src="/assets/projects/proj-03.webp" alt="Site Supervision" />
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <FaShieldAlt />
              </div>
              <div>
                <h3>Experienced Technical Team</h3>
                <p>
                  Engineers and architects with hands-on understanding of regional terrain, soil specifications, and climate demands.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <FaAward />
              </div>
              <div>
                <h3>Rigorous Quality Control</h3>
                <p>
                  Multi-point inspection checks at every stage, from foundation excavation to roof truss installation.
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <FaUsers />
              </div>
              <div>
                <h3>Client-Centered Transparency</h3>
                <p>
                  Clear project estimation, regular site progress reporting, and collaborative design adjustments throughout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4-STEP PROCESS SECTION ================= */}
      <section className={styles.processSection}>
        <div className={styles.sectionTagRow}>
          <FaSquare className={styles.tagSquareIcon} />
          <span>Our Process</span>
        </div>

        <div className={styles.splitHeader}>
          <h2 className={styles.splitTitle}>
            Our 4-Step Process to a<br />Successful Build
          </h2>
          <p className={styles.splitDesc}>
            A structured engineering workflow ensuring complete structural integrity, transparent communication, and timely execution.
          </p>
        </div>

        <div className={styles.processGrid}>
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className={styles.processCard}>
              <span className={styles.stepNum}>{item.step}</span>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DIRECTORS / TEAM SECTION ================= */}
      <section className={styles.teamSection}>
        <div className={styles.teamHeaderRow}>
          <div>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>Our Team</span>
            </div>
            <h2 className={styles.sectionTitleLeft}>
              Meet the Experts Behind Nayaab
            </h2>
          </div>
          <Link to="/team" className={styles.outlineBtn}>
            View All Team
          </Link>
        </div>

        <div className={styles.teamGrid}>
          {DIRECTORS.map((member, idx) => (
            <div key={idx} className={styles.teamCard}>
              <div className={styles.teamImgWrapper}>
                <div className={styles.avatarPlaceholder}>
                  <FaUserTie />
                </div>
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= START YOUR PROJECT SECTION (FORM) ================= */}
      <section className={styles.startProjectSection}>
        <ContactForm
          eyebrow="START YOUR PROJECT"
          title="Start Your Project With Us"
          subtitle="Ready to transform your vision into structural reality? Send us a message and our engineering team will get back to you promptly."
        />
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.ctaCard}>
          <div className={styles.sectionTagRowCenter}>
            <FaSquare className={styles.tagSquareIcon} />
            <span>Get Started</span>
          </div>
          <h2 className={styles.ctaTitle}>Ready to Build Your Vision?</h2>
          <p className={styles.ctaDesc}>
            Whether you need structural planning, 3D visualization, or full site supervision, 
            Nayaab Engineering Innovations is ready to assist you.
          </p>
          <div className={styles.ctaBtnGroup}>
            <Link to="/contact" className={styles.ctaPrimaryBtn}>
              Contact Us
            </Link>
            <Link to="/projects" className={styles.ctaSecondaryBtn}>
              Our Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}