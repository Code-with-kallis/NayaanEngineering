// src/pages/About/About.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaBuilding, 
  FaAward, 
  FaCertificate, 
  FaDraftingCompass, 
  FaHardHat, 
  FaCogs, 
  FaArrowRight, 
  FaShieldAlt, 
  FaMapMarkerAlt,
  FaCheckCircle
} from "react-icons/fa";
import AboutHero from "../../components/about/AboutHero";
import TeamSection from "../../components/team/TeamSection";
import EmployeeModal from "../../components/team/EmployeeModal";
import showcaseImage from "../../assets/images/about/Seismic-Safety-&-Structural-Design.webp";
import styles from "./About.module.css";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Us & Corporate Profile | Nayaab Engineering Innovations",
  "description": "Learn about Nayaab Engineering Innovations Pvt. Ltd., DPIIT recognized corporate engineering firm in Jammu & Kashmir. Explore our leadership, architecture team, and project history.",
  "publisher": {
    "@type": "Organization",
    "name": "Nayaab Engineering Innovations Private Limited",
    "url": "https://www.nayaabengineering.com"
  }
};

const SECTION_CONTENT = [
  {
    id: "leadership",
    eyebrow: "Direction & governance",
    title: "Leadership Team",
    description:
      "The Board of Directors setting corporate direction, engineering standards, and strategy for Nayaab Engineering Innovations.",
  },
  {
    id: "architecture",
    eyebrow: "Concept & planning",
    title: "Architecture & Design Team",
    description:
      "Designers translating client vision into buildable CAD architectural and structural plans.",
  },
  {
    id: "construction",
    eyebrow: "On-site execution",
    title: "Field Operations Team",
    description:
      "Skilled engineers, technicians, and field supervisors executing projects safely on the ground.",
  },
];

export default function About() {
  const [sections, setSections] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    let isMounted = true;

    import("../../data/team")
      .then(({ getMembersBySection }) => {
        if (!isMounted) return;
        const populatedSections = SECTION_CONTENT.map((section) => ({
          ...section,
          members: getMembersBySection ? getMembersBySection(section.id) : [],
        }));
        setSections(populatedSections);
      })
      .catch((err) => {
        console.error("Error loading team data:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingTeam(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(`.${styles.revealOnScroll}`);
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main id="main" className={styles.aboutPage}>
      <Helmet>
        <title>About Us &amp; Corporate Profile | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Learn about Nayaab Engineering Innovations Pvt. Ltd., DPIIT recognized corporate engineering firm in Jammu &amp; Kashmir. Explore our leadership, architecture team, and project history."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Us &amp; Corporate Profile | Nayaab Engineering Innovations" />
        <meta
          property="og:description"
          content="DPIIT recognized corporate engineering firm in Baramulla, Jammu &amp; Kashmir. Explore our leadership, design team, and engineering capabilities."
        />
        <meta property="og:url" content="https://www.nayaabengineering.com/about" />
        <meta property="og:image" content="https://www.nayaabengineering.com/logo-full.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Nayaab Engineering Innovations" />
        <meta name="twitter:description" content="DPIIT recognized corporate engineering firm in Jammu &amp; Kashmir." />
        <script type="application/ld+json">{JSON.stringify(aboutSchema)}</script>
      </Helmet>

      {/* 1. Hero Section */}
      <section className={styles.heroWrapper}>
        <AboutHero />
      </section>

      {/* 2. Corporate Overview & DPIIT Certification */}
      <section id="corporate-profile" className={styles.overviewSection}>
        <div className={styles.container}>
          <div className={styles.overviewGrid}>
            <div className={`${styles.overviewTextContent} ${styles.revealOnScroll}`}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.eyebrowSquare} />
                <span>CORPORATE OVERVIEW</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Fostering Regional Infrastructure with Engineering Precision
              </h2>
              <p className={styles.bodyParagraph}>
                <strong>Nayaab Engineering Innovations Private Limited</strong> is a Baramulla-based engineering consultancy and contracting firm incorporated in May 2024. We integrate structural resilience, practical architectural planning, and execution standards tailored to regional terrains.
              </p>
              <p className={styles.bodyParagraph}>
                As a recognized DPIIT startup enterprise under the Startup India initiative, we deliver transparent project management, technical site coordination, and turnkey construction solutions.
              </p>
            </div>

            <div className={`${styles.dpiitCard} ${styles.revealOnScroll} ${styles.revealDelay1}`}>
              <div className={styles.dpiitHeader}>
                <FaAward className={styles.dpiitIcon} />
                <div>
                  <span className={styles.dpiitBadgeTag}>GOVT OF INDIA RECOGNIZED</span>
                  <h3 className={styles.dpiitTitle}>DPIIT Recognized Startup</h3>
                </div>
              </div>
              <p className={styles.dpiitText}>
                Officially recognized under the Startup India scheme in the <strong>Construction &amp; Engineering Sector</strong>.
              </p>
              <div className={styles.dpiitMetaGrid}>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Certificate No.</span>
                  <span className={styles.metaValue}>DIPP180810</span>
                </div>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Sector</span>
                  <span className={styles.metaValue}>Construction &amp; Engineering</span>
                </div>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Recognition Date</span>
                  <span className={styles.metaValue}>21 Oct 2024</span>
                </div>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Validity</span>
                  <span className={styles.metaValue}>Through May 2034</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architectural & Structural Engineering Showcase */}
      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={`${styles.visionImageWrapper} ${styles.revealOnScroll}`}>
              <img 
                src={showcaseImage} 
                alt="Seismic Safety and Structural Design Showcase" 
                loading="lazy" 
                decoding="async" 
              />
              <div className={styles.visionFloatingBadge}>
                <span className={styles.badgeText}>Seismic Safety &amp; Structural Design</span>
              </div>
            </div>

            <div className={`${styles.visionContent} ${styles.revealOnScroll} ${styles.revealDelay1}`}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.eyebrowSquare} />
                <span>ENGINEERING PHILOSOPHY</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Built for Resilience, Engineered for Kashmir’s Terrain
              </h2>
              <p className={styles.bodyParagraph}>
                Every blueprint and structural calculation developed at NEIPL is customized for high-altitude topography, seismic compliance standards (IS 1893 Zone V), and local environmental demands.
              </p>
              <div className={styles.visionPillars}>
                <div className={styles.pillarItem}>
                  <FaCheckCircle className={styles.pillarIcon} />
                  <div>
                    <strong>Parametric 3D Modeling &amp; CAD Blueprints</strong>
                    <p>Photorealistic elevations and integrated structural drafts prior to site mobilization.</p>
                  </div>
                </div>
                <div className={styles.pillarItem}>
                  <FaCheckCircle className={styles.pillarIcon} />
                  <div>
                    <strong>End-to-End Turnkey Execution</strong>
                    <p>From soil investigation and foundation piling to structural framing and final handover.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Company Fact Sheet */}
      <section className={styles.factSheetSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeaderCentered} ${styles.revealOnScroll}`}>
            <div className={styles.sectionEyebrowCenter}>
              <span className={styles.eyebrowSquare} />
              <span>TRANSPARENCY &amp; CREDENTIALS</span>
            </div>
            <h2 className={styles.sectionTitle}>Company Fact Sheet</h2>
            <p className={styles.sectionDesc}>
              Verified corporate credentials and registry information under the Ministry of Corporate Affairs (MCA).
            </p>
          </div>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay1}`}>
              <div className={styles.bentoIconBox}>
                <FaBuilding />
              </div>
              <span className={styles.bentoLabel}>Legal Registration</span>
              <h3 className={styles.bentoValue}>Private Limited</h3>
              <p className={styles.bentoSubtext}>Incorporated on May 03, 2024 under RoC Jammu</p>
            </div>

            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay2}`}>
              <div className={styles.bentoIconBox}>
                <FaCertificate />
              </div>
              <span className={styles.bentoLabel}>Corporate ID (CIN)</span>
              <h3 className={styles.bentoValueCIN}>U42900JK2024PTC015987</h3>
              <p className={styles.bentoSubtext}>Active e-Filing &amp; Compliance Status</p>
            </div>

            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay3}`}>
              <div className={styles.bentoIconBox}>
                <FaMapMarkerAlt />
              </div>
              <span className={styles.bentoLabel}>Headquarters</span>
              <h3 className={styles.bentoValue}>Baramulla, J&amp;K</h3>
              <p className={styles.bentoSubtext}>Qutub Complex, Opposite J&amp;K Bank (TP), Baramulla, Jammu &amp; Kashmir - 193101.</p>
            </div>

            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay4}`}>
              <div className={styles.bentoIconBox}>
                <FaCogs />
              </div>
              <span className={styles.bentoLabel}>Core Industry</span>
              <h3 className={styles.bentoValue}>Civil Engineering</h3>
              <p className={styles.bentoSubtext}>NIC Code 42 — Civil Construction &amp; Structural Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Service Capabilities */}
      <section className={styles.capabilitiesSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeaderLeft} ${styles.revealOnScroll}`}>
            <div className={styles.sectionEyebrow}>
              <span className={styles.eyebrowSquare} />
              <span>WHAT WE DO</span>
            </div>
            <h2 className={styles.sectionTitle}>Core Engineering Capabilities</h2>
          </div>

          <div className={styles.capabilitiesGrid}>
            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay1}`}>
              <div className={styles.capHeader}>
                <FaHardHat className={styles.capIcon} />
                <h3>Civil &amp; Structural Engineering</h3>
              </div>
              <p>
                Comprehensive structural analysis, technical calculation sheets, and execution oversight for residential, commercial, and institutional projects.
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay2}`}>
              <div className={styles.capHeader}>
                <FaDraftingCompass className={styles.capIcon} />
                <h3>Architectural &amp; CAD Planning</h3>
              </div>
              <p>
                2D/3D building layouts, BIM coordination, structural reinforcement details, and pre-construction documentation.
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay3}`}>
              <div className={styles.capHeader}>
                <FaCogs className={styles.capIcon} />
                <h3>Project Supervision &amp; QA/QC</h3>
              </div>
              <p>
                Field monitoring, non-destructive material quality control, schedule tracking, and safety compliance management.
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay4}`}>
              <div className={styles.capHeader}>
                <FaShieldAlt className={styles.capIcon} />
                <h3>Turnkey Execution &amp; Fit-Outs</h3>
              </div>
              <p>
                End-to-end site developments, commercial interiors, structural retrofit work, and comprehensive spatial handovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Team Roster */}
      <section id="team-roster" className={styles.teamRosterSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeaderCentered} ${styles.revealOnScroll}`}>
            <div className={styles.sectionEyebrowCenter}>
              <span className={styles.eyebrowSquare} />
              <span>IN-HOUSE LEADERSHIP &amp; TALENT</span>
            </div>
            <h2 className={styles.sectionTitle}>Meet Our Engineering &amp; Design Team</h2>
            <p className={styles.sectionDesc}>
              A multidisciplinary group of certified civil engineers, CAD architects, and site supervisors executing projects across Jammu &amp; Kashmir.
            </p>
          </div>

          <div className={styles.sectionsWrapper}>
            {loadingTeam ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#71717A" }}>
                Loading team members...
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.id}>
                  <TeamSection
                    id={section.id}
                    title={section.title}
                    description={section.description}
                    members={section.members}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={`${styles.ctaBox} ${styles.revealOnScroll}`}>
            <h2 className={styles.ctaTitle}>Ready to Discuss Your Next Engineering Project?</h2>
            <p className={styles.ctaText}>
              Reach out to our engineering and architectural design team in Baramulla for consultations, structural plans, or project execution.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.ctaPrimaryBtn}>
                <span>Contact Us</span>
                <FaArrowRight />
              </Link>
              <a href="tel:+911952455465" className={styles.ctaSecondaryBtn}>
                Call +91 1952-455465
              </a>
            </div>
          </div>
        </div>
      </section>

      <EmployeeModal />
    </main>
  );
}