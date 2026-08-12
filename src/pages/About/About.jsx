import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaBuilding, 
  FaAward, 
  FaCertificate, 
  FaDraftingCompass, 
  FaHardHat, 
  FaCogs, 
  FaArrowRight, 
  FaShieldAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import AboutHero from "../../components/about/AboutHero";
import TeamSection from "../../components/team/TeamSection";
import EmployeeModal from "../../components/team/EmployeeModal";
import { getMembersBySection, teamMembers } from "../../data/team";
import styles from "./About.module.css";

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

function About() {
  useEffect(() => {
    document.title = "About Us & Corporate Profile | Nayaab Engineering Innovations";
    window.scrollTo(0, 0);
  }, []);

  const sections = SECTION_CONTENT.map((section) => ({
    ...section,
    members: getMembersBySection(section.id),
  }));

  return (
    <main id="main" className={styles.aboutPage}>
      {/* 1. Hero Section */}
      <AboutHero
        eyebrow="ABOUT NAYAAB ENGINEERING"
        title="Engineering What Comes Next in J&K"
        subtitle="Nayaab Engineering Innovations Pvt. Ltd. combines formal corporate standards with startup agility to deliver civil construction, structural engineering, and technical design across Jammu & Kashmir."
        stats={[
          { value: "2024", label: "Founded in Baramulla" },
          { value: "DPIIT", label: "Recognized Startup" },
          { value: `${teamMembers.length}`, label: "In-House Specialists" },
        ]}
        primaryAction={{ href: "/contact", label: "Start a Project" }}
        secondaryAction={{ href: "#corporate-profile", label: "Company Profile" }}
      />

      {/* 2. Corporate Profile & DPIIT Recognition Banner */}
      <section id="corporate-profile" className={styles.overviewSection}>
        <div className={styles.container}>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewTextContent}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.eyebrowSquare} />
                <span>CORPORATE OVERVIEW</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Fostering Regional Infrastructure with Engineering Precision
              </h2>
              <p className={styles.bodyParagraph}>
                <strong>Nayaab Engineering Innovations Private Limited</strong> is a Baramulla, Jammu & Kashmir-based civil engineering and construction company incorporated in May 2024. We bring together structural integrity, practical design thinking, and modern technical planning for regional development.
              </p>
              <p className={styles.bodyParagraph}>
                As an active private limited enterprise and a government-recognized DPIIT startup, we provide structured project execution, civil design coordination, and turnkey solutions with corporate transparency.
              </p>
            </div>

            {/* DPIIT Recognition Card */}
            <div className={styles.dpiitCard}>
              <div className={styles.dpiitHeader}>
                <FaAward className={styles.dpiitIcon} />
                <div>
                  <span className={styles.dpiitBadgeTag}>GOVT OF INDIA RECOGNIZED</span>
                  <h3 className={styles.dpiitTitle}>DPIIT Recognized Startup</h3>
                </div>
              </div>
              <p className={styles.dpiitText}>
                Officially acknowledged under Startup India Scheme in the <strong>Construction & Engineering Sector</strong>.
              </p>
              <div className={styles.dpiitMetaGrid}>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Certificate No.</span>
                  <span className={styles.metaValue}>DIPP180810</span>
                </div>
                <div className={styles.dpiitMetaItem}>
                  <span className={styles.metaLabel}>Sector</span>
                  <span className={styles.metaValue}>Construction & Engineering</span>
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

      {/* 3. Company Fact Sheet / Bento Grid */}
      <section className={styles.factSheetSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCentered}>
            <div className={styles.sectionEyebrowCenter}>
              <span className={styles.eyebrowSquare} />
              <span>TRANSPARENCY & CREDENTIALS</span>
            </div>
            <h2 className={styles.sectionTitle}>Company Fact Sheet</h2>
            <p className={styles.sectionDesc}>
              Verified corporate credentials and registry information under MCA (Ministry of Corporate Affairs).
            </p>
          </div>

          <div className={styles.bentoGrid}>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIconBox}>
                <FaBuilding />
              </div>
              <span className={styles.bentoLabel}>Legal Registration</span>
              <h3 className={styles.bentoValue}>Private Limited</h3>
              <p className={styles.bentoSubtext}>Incorporated on May 03, 2024 under RoC Jammu</p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.bentoIconBox}>
                <FaCertificate />
              </div>
              <span className={styles.bentoLabel}>Corporate ID (CIN)</span>
              <h3 className={styles.bentoValueCIN}>U42900JK2024PTC015987</h3>
              <p className={styles.bentoSubtext}>Active e-Filing & Compliance Status</p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.bentoIconBox}>
                <FaMapMarkerAlt />
              </div>
              <span className={styles.bentoLabel}>Headquarters</span>
              <h3 className={styles.bentoValue}>Baramulla, J&K</h3>
              <p className={styles.bentoSubtext}>Sangri Colony, Baramulla, J&K - 193101</p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.bentoIconBox}>
                <FaCogs />
              </div>
              <span className={styles.bentoLabel}>Core Industry</span>
              <h3 className={styles.bentoValue}>Civil Engineering</h3>
              <p className={styles.bentoSubtext}>NIC Code 42 — Civil Construction & Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Service Capabilities */}
      <section className={styles.capabilitiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionEyebrow}>
              <span className={styles.eyebrowSquare} />
              <span>WHAT WE DO</span>
            </div>
            <h2 className={styles.sectionTitle}>Core Engineering Capabilities</h2>
          </div>

          <div className={styles.capabilitiesGrid}>
            <div className={styles.capabilityCard}>
              <div className={styles.capHeader}>
                <FaHardHat className={styles.capIcon} />
                <h3>Civil & Structural Engineering</h3>
              </div>
              <p>
                Comprehensive structural analysis, technical planning, and execution management for residential, commercial, and public infrastructure projects.
              </p>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.capHeader}>
                <FaDraftingCompass className={styles.capIcon} />
                <h3>Architectural & CAD Planning</h3>
              </div>
              <p>
                Computer-Aided Design (CAD) drafting, 2D/3D building modeling, structural layout blueprints, and pre-construction technical documentation.
              </p>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.capHeader}>
                <FaCogs className={styles.capIcon} />
                <h3>Construction Project Management</h3>
              </div>
              <p>
                On-site supervision, quality control, material testing coordination, and timely execution following strict safety guidelines.
              </p>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.capHeader}>
                <FaShieldAlt className={styles.capIcon} />
                <h3>Turnkey Execution & Interiors</h3>
              </div>
              <p>
                End-to-end site development, institutional spatial planning, commercial fit-outs, and turnkey building solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Roster Sections */}
      <section className={styles.teamRosterSection}>
        <div className={styles.sectionsWrapper}>
          {sections.map((section) => (
            <TeamSection
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
              members={section.members}
            />
          ))}
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
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

      {/* Profile Popup Modal */}
      <EmployeeModal />
    </main>
  );
}

export default About;