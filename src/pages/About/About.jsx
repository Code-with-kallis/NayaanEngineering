import { useEffect, useRef } from "react";
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
  FaMapMarkerAlt,
  FaCube,
  FaLayerGroup,
  FaCheckCircle
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

// Single 3D House Asset
const HOUSE_3D_IMAGE = "assets/about/3d-house.png";

function About() {
  const splitSectionRef = useRef(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    document.title = "About Us & Corporate Profile | Nayaab Engineering Innovations";
    window.scrollTo(0, 0);

    // 1. Intersection Observer for Smooth Slide-in Transition
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(
      `.${styles.revealOnScroll}, .${styles.fullBleedSplitSection}`
    );
    animatedElements.forEach((el) => observer.observe(el));

    // 2. Single-Scroll Lock Handler (Hero -> Showcase)
    // `offsetTop` forces the browser to synchronously recompute layout the
    // instant it's read. The old handlers read it on every single touchmove
    // event, so every frame of a mobile scroll gesture paid for a layout
    // recalculation before the browser could paint — that's the lag. We
    // measure it once instead, and only re-measure when the layout could
    // actually have changed.
    let splitTop = 0;
    const measureSplitTop = () => {
      if (splitSectionRef.current) {
        splitTop = splitSectionRef.current.offsetTop;
      }
    };
    measureSplitTop();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measureSplitTop, 150);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", measureSplitTop);

    const scrollToTarget = (targetTop) => {
      isLockedRef.current = true;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      setTimeout(() => {
        isLockedRef.current = false;
      }, 950);
    };

    // Desktop Wheel Event Handler
    const handleWheel = (e) => {
      const currentScroll = window.scrollY || window.pageYOffset;

      if (currentScroll < splitTop - 30) {
        if (e.deltaY > 0) {
          e.preventDefault();
          if (!isLockedRef.current) {
            scrollToTarget(splitTop);
          }
        }
      } else if (isLockedRef.current) {
        e.preventDefault();
      }
    };

    // Mobile Touch Gesture Handler
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentScroll = window.scrollY || window.pageYOffset;

      // Past the hero and not mid-lock: bail out before doing ANY work so the
      // browser's native, GPU-driven touch scrolling takes over completely —
      // this is what fixes scrolling from the hero down through the rest of
      // the page.
      if (currentScroll >= splitTop - 30 && !isLockedRef.current) return;

      if (isLockedRef.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      const touchCurrentY = e.touches[0].clientY;
      const diffY = touchStartY - touchCurrentY;

      if (diffY > 15) {
        if (e.cancelable) e.preventDefault();
        scrollToTarget(splitTop);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", measureSplitTop);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const sections = SECTION_CONTENT.map((section) => ({
    ...section,
    members: getMembersBySection(section.id),
  }));

  return (
    <main id="main" className={styles.aboutPage}>
      {/* 1. Hero Section */}
      <section className={styles.heroWrapper}>
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
      </section>

      {/* 2. FULL-SCREEN 50/50 SPLIT: 3D MODEL (LEFT) + TYPOGRAPHY SHOWCASE (RIGHT) */}
      <section 
        ref={splitSectionRef}
        className={styles.fullBleedSplitSection} 
        aria-label="3D Architectural Visualization and Engineering Scope"
      >
        {/* Left Side: Pure 3D House Visual (Slides from Left) */}
        <div className={styles.splitHalfLeft}>
          <div 
            className={styles.splitBackground} 
            style={{ backgroundImage: `url(${HOUSE_3D_IMAGE})` }}
          />
          <div className={styles.ambientGlowLeft} />
        </div>

        {/* Right Side: High-Impact Typography & Engineering Scope (Slides from Right) */}
        <div className={styles.splitHalfRight}>
          <div className={styles.typographyContentWrapper}>
            <div className={styles.typoEyebrowBadge}>
              <FaCube className={styles.badgeIcon} />
              <span>3D MODELING &amp; ARCHITECTURAL DESIGN</span>
            </div>

            <h2 className={styles.typoMainHeading}>
              From 3D Concept Modeling <br />
              <span>To Built Reality</span>
            </h2>

            <p className={styles.typoDescription}>
              We transform architectural concepts into buildable CAD blueprints and photorealistic 3D models with structural precision tailored for Jammu &amp; Kashmir’s terrain.
            </p>

            {/* Feature Highlights List */}
            <div className={styles.typoFeatureList}>
              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaLayerGroup />
                </div>
                <div className={styles.featureText}>
                  <h4>3D Architectural CAD &amp; BIM Modeling</h4>
                  <p>Comprehensive 2D blueprints, elevation renders, and structural layouts.</p>
                </div>
              </div>

              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaDraftingCompass />
                </div>
                <div className={styles.featureText}>
                  <h4>Structural Load &amp; Seismic Design</h4>
                  <p>Engineered to meet Indian Standard (IS) codes for Zone-V seismic safety.</p>
                </div>
              </div>

              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaHardHat />
                </div>
                <div className={styles.featureText}>
                  <h4>Turnkey On-Site Execution</h4>
                  <p>Direct supervision and execution from foundation to final fit-out.</p>
                </div>
              </div>
            </div>

            {/* Bottom Meta Pill */}
            <div className={styles.typoBottomBar}>
              <span className={styles.typoLocationTag}>
                <FaMapMarkerAlt /> Central Design Studio • Baramulla, J&amp;K
              </span>
              <Link to="/contact" className={styles.typoActionLink}>
                <span>Explore Technical Scope</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Corporate Profile & DPIIT Recognition Banner */}
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
                <strong>Nayaab Engineering Innovations Private Limited</strong> is a Baramulla, Jammu & Kashmir-based civil engineering and construction company incorporated in May 2024[cite: 17]. We bring together structural integrity, practical design thinking, and modern technical planning for regional development[cite: 17].
              </p>
              <p className={styles.bodyParagraph}>
                As an active private limited enterprise and a government-recognized DPIIT startup, we provide structured project execution, civil design coordination, and turnkey solutions with corporate transparency[cite: 17].
              </p>
            </div>

            {/* DPIIT Recognition Card */}
            <div className={`${styles.dpiitCard} ${styles.revealOnScroll} ${styles.revealDelay1}`}>
              <div className={styles.dpiitHeader}>
                <FaAward className={styles.dpiitIcon} />
                <div>
                  <span className={styles.dpiitBadgeTag}>GOVT OF INDIA RECOGNIZED</span>
                  <h3 className={styles.dpiitTitle}>DPIIT Recognized Startup</h3>
                </div>
              </div>
              <p className={styles.dpiitText}>
                Officially acknowledged under Startup India Scheme in the <strong>Construction & Engineering Sector</strong>[cite: 17].
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

      {/* 4. Company Fact Sheet / Bento Grid */}
      <section className={styles.factSheetSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeaderCentered} ${styles.revealOnScroll}`}>
            <div className={styles.sectionEyebrowCenter}>
              <span className={styles.eyebrowSquare} />
              <span>TRANSPARENCY & CREDENTIALS</span>
            </div>
            <h2 className={styles.sectionTitle}>Company Fact Sheet</h2>
            <p className={styles.sectionDesc}>
              Verified corporate credentials and registry information under MCA (Ministry of Corporate Affairs)[cite: 17].
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
              <p className={styles.bentoSubtext}>Active e-Filing & Compliance Status</p>
            </div>

            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay3}`}>
              <div className={styles.bentoIconBox}>
                <FaMapMarkerAlt />
              </div>
              <span className={styles.bentoLabel}>Headquarters</span>
              <h3 className={styles.bentoValue}>Baramulla, J&K</h3>
              <p className={styles.bentoSubtext}>Sangri Colony, Baramulla, J&K - 193101</p>
            </div>

            <div className={`${styles.bentoCard} ${styles.revealOnScroll} ${styles.revealDelay4}`}>
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
                <h3>Civil & Structural Engineering</h3>
              </div>
              <p>
                Comprehensive structural analysis, technical planning, and execution management for residential, commercial, and public infrastructure projects[cite: 17].
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay2}`}>
              <div className={styles.capHeader}>
                <FaDraftingCompass className={styles.capIcon} />
                <h3>Architectural & CAD Planning</h3>
              </div>
              <p>
                Computer-Aided Design (CAD) drafting, 2D/3D building modeling, structural layout blueprints, and pre-construction technical documentation[cite: 17].
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay3}`}>
              <div className={styles.capHeader}>
                <FaCogs className={styles.capIcon} />
                <h3>Construction Project Management</h3>
              </div>
              <p>
                On-site supervision, quality control, material testing coordination, and timely execution following strict safety guidelines[cite: 17].
              </p>
            </div>

            <div className={`${styles.capabilityCard} ${styles.revealOnScroll} ${styles.revealDelay4}`}>
              <div className={styles.capHeader}>
                <FaShieldAlt className={styles.capIcon} />
                <h3>Turnkey Execution & Interiors</h3>
              </div>
              <p>
                End-to-end site development, institutional spatial planning, commercial fit-outs, and turnkey building solutions[cite: 17].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Team Roster Sections */}
      <section className={styles.teamRosterSection}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeaderCentered} ${styles.revealOnScroll}`}>
            <div className={styles.sectionEyebrowCenter}>
              <span className={styles.eyebrowSquare} />
              <span>IN-HOUSE LEADERSHIP & TALENT</span>
            </div>
            <h2 className={styles.sectionTitle}>Meet Our Engineering & Design Team</h2>
            <p className={styles.sectionDesc}>
              A multidisciplinary collective of certified civil engineers, CAD architects, and site supervisors executing projects across Jammu & Kashmir.
            </p>
          </div>

          <div className={styles.sectionsWrapper}>
            {sections.map((section) => (
              <div key={section.id} className={styles.revealOnScroll}>
                <TeamSection
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  members={section.members}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={`${styles.ctaBox} ${styles.revealOnScroll}`}>
            <h2 className={styles.ctaTitle}>Ready to Discuss Your Next Engineering Project?</h2>
            <p className={styles.ctaText}>
              Reach out to our engineering and architectural design team in Baramulla for consultations, structural plans, or project execution[cite: 17].
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