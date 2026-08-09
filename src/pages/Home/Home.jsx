import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaSquare,
  FaMicrochip,
  FaAward,
  FaUsers,
  FaCheckCircle,
  FaShieldAlt,
  FaDraftingCompass,
  FaBuilding,
  FaHardHat,
  FaClipboardList,
  FaProjectDiagram,
  FaKey,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaTimes,
  FaShareAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarCheck,
  FaLayerGroup,
} from "react-icons/fa";
import Hero from "../../components/home/Hero";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import { PROJECTS_DATA } from "../../data/projects";
import styles from "./Home.module.css";

const highlightItems = [
  {
    icon: <FaRegCalendarCheck className={styles.highlightIcon} />,
    title: "Est. 2022",
    subtitle: "Incorporated in Baramulla, J&K",
  },
  {
    icon: <FaAward className={styles.highlightIcon} />,
    title: "DPIIT Recognized",
    subtitle: "Civil Engineering Startup",
  },
  {
    icon: <FaLayerGroup className={styles.highlightIcon} />,
    title: "Multi-Discipline",
    subtitle: "Architecture to Structural Design",
  },
  {
    icon: <FaProjectDiagram className={styles.highlightIcon} />,
    title: "End-to-End",
    subtitle: "Concept to Turnkey Execution",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Initial Consultation & Design Brief",
    description:
      "We understand your architectural vision, site topography, and project requirements to map out a clear technical roadmap.",
  },
  {
    step: "02",
    title: "Structural Engineering & 3D Design",
    description:
      "Our team develops 2D architectural layouts, 3D exterior visualizations, and compliant structural load calculations.",
  },
  {
    step: "03",
    title: "On-Site Execution & Quality Control",
    description:
      "Rigorous site supervision ensuring structural integrity, material quality assurance, and adherence to safety norms.",
  },
  {
    step: "04",
    title: "Final Review & Handover",
    description:
      "Comprehensive structural evaluation and technical sign-off for a seamless and secure project handover.",
  },
];

const Home = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  const featuredProjects = PROJECTS_DATA.slice(0, 3);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = PROJECTS_DATA.find((p) => p.slug === hash || String(p.id) === hash);
        if (found) setSelectedProject(found);
      } else {
        setSelectedProject(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    window.history.pushState(null, "", `#${project.slug}`);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  };

  const currentModalIndex = selectedProject
    ? PROJECTS_DATA.findIndex((p) => (p.slug || p.id) === (selectedProject.slug || selectedProject.id))
    : 0;

  const handleNextProject = useCallback(() => {
    if (PROJECTS_DATA.length === 0) return;
    const nextIdx = (currentModalIndex + 1) % PROJECTS_DATA.length;
    openProjectModal(PROJECTS_DATA[nextIdx]);
  }, [currentModalIndex]);

  const handlePrevProject = useCallback(() => {
    if (PROJECTS_DATA.length === 0) return;
    const prevIdx = (currentModalIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    openProjectModal(PROJECTS_DATA[prevIdx]);
  }, [currentModalIndex]);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeProjectModal();
      if (e.key === "ArrowLeft") handlePrevProject();
      if (e.key === "ArrowRight") handleNextProject();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, handleNextProject, handlePrevProject]);

  const handleCopyLink = () => {
    if (!selectedProject) return;
    const shareableUrl = `${window.location.origin}${window.location.pathname}#${selectedProject.slug}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);

    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. ABOUT OUR COMPANY */}
      <section className={styles.statsSection}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>About Our Company</span>
            </div>
            <h2 className={styles.splitTitle}>
            Driven by Quality
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              Bringing a hands-on, client-first approach to civil and architectural engineering.
              Incorporated in 2022 and headquartered in Baramulla, we combine formal corporate standards with regional expertise.
            </p>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className={styles.bentoGrid}>
          {/* Card 1: Main Profile with Center Watermark */}
          <div className={`${styles.bentoCard} ${styles.cardLarge}`}>
            <img 
              src="/logo.png" 
              alt="" 
              className={styles.cardWatermarkCenter} 
              aria-hidden="true" 
            />

            <div className={styles.cardContentRelative}>
              <div className={styles.brandHeader}>
                <span className={styles.brandName}>Nayaab Engineering</span>
              </div>
              <div className={styles.bigStatNum}>2022</div>
              <p className={styles.bentoText}>
                Incorporated as a Private Limited Engineering Company (CIN: U42900JK2022PTC015987) under RoC Jammu.
              </p>
              <div className={styles.avatarStack}>
                <div className={styles.avatar} title="Junaid Bilal Sheikh">J</div>
                <div className={styles.avatar} title="Aaqib Nazir Tantary">A</div>
                <div className={styles.avatar} title="Saajid Rashid Malik">S</div>
                <div className={styles.avatarPlus}>+</div>
              </div>
            </div>
          </div>

          {/* Card 2 & 3 Stack */}
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

          {/* Card 4 & 5 Stack */}
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
      </section>

      {/* 3. FEATURED WORK */}
      <section className={styles.projectsPreview}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>Featured Work</span>
            </div>
            <h2 className={styles.splitTitle}>Our Completed Projects</h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              Explore a selection of our architectural planning, 3D visualization, and structural engineering developments.
            </p>
          </div>
        </div>

        <div className={styles.projectGrid}>
          {featuredProjects.map((project) => (
            <article
              key={project.id || project.slug}
              className={styles.projectCard}
              onClick={() => openProjectModal(project)}
            >
              <div className={styles.cardImageWrapper}>
                <img
                  src={project.coverImage || project.image}
                  alt={project.title}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardSummary}>
                  {project.summary || project.description}
                </p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <FaMapMarkerAlt className={styles.metaIcon} />
                    <span>{project.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaClock className={styles.metaIcon} />
                    <span>{project.duration || project.year}</span>
                  </div>
                </div>

                <button
                  className={styles.viewDetailBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openProjectModal(project);
                  }}
                >
                  <span>View Details</span>
                  <FaArrowRight className={styles.linkArrow} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link to="/projects" className={styles.viewAllBtn}>
            <span>View All Projects</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* 4. CORE SERVICES SECTION */}
      <section className={styles.servicesPreview}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>What We Do</span>
            </div>
            <h2 className={styles.splitTitle}>Our Core Services</h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              End-to-end civil engineering and construction solutions, tailored to
              residential, commercial, and regional infrastructure needs.
            </p>
          </div>
        </div>

        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <FaDraftingCompass className={styles.serviceIcon} />
            <h3>Architectural Design</h3>
            <p>
              Complete 2D floor plans, 3D exterior visualization, and architectural elevation modeling.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaBuilding className={styles.serviceIcon} />
            <h3>Structural Engineering</h3>
            <p>
              Structural load estimation, feasibility analysis, reinforced concrete design, and technical safety compliance.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaHardHat className={styles.serviceIcon} />
            <h3>Construction Management</h3>
            <p>
              Full on-site supervision, scheduling oversight, and quality-controlled site execution.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaClipboardList className={styles.serviceIcon} />
            <h3>Engineering Consultancy</h3>
            <p>
              Technical advisory, site topography evaluation, structural review, and compliance support.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaProjectDiagram className={styles.serviceIcon} />
            <h3>Project Planning</h3>
            <p>
              Detailed project estimation, resource allocation, structural budgeting, and schedule management.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaKey className={styles.serviceIcon} />
            <h3>Turnkey Solutions</h3>
            <p>
              Complete end-to-end project management from initial design drafting to final building handover.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY BUILDERS & CLIENTS TRUST US */}
      <section className={styles.whyTrustSection}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>Why Choose Us</span>
            </div>
            <h2 className={styles.splitTitle}>
              Why Clients &amp; Builders<br />Trust Nayaab Engineering
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              From custom residential villas to commercial builds, we deliver end-to-end precision by combining
              regional architectural knowledge with strict civil engineering safety standards.
            </p>
          </div>
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

      {/* 6. OUR 4-STEP PROCESS */}
      <section className={styles.processSection}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>Our Process</span>
            </div>
            <h2 className={styles.splitTitle}>
              Our 4-Step Process to a<br />Successful Build
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              A structured engineering workflow ensuring complete structural integrity, transparent communication, and timely execution.
            </p>
          </div>
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

      {/* 7. INFINITE AUTO-MOVING TICKER SECTION */}
      <section className={styles.tickerSection}>
        <div className={styles.tickerContainer}>
          <div className={styles.tickerTrack}>
            {highlightItems.map((item, index) => (
              <div className={styles.tickerItem} key={`ticker-1-${index}`}>
                {item.icon}
                <div className={styles.tickerContent}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span className={styles.tickerDot}>•</span>
              </div>
            ))}

            {highlightItems.map((item, index) => (
              <div className={styles.tickerItem} key={`ticker-2-${index}`}>
                {item.icon}
                <div className={styles.tickerContent}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span className={styles.tickerDot}>•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <ContactForm
        eyebrow="GET IN TOUCH"
        title="Let's talk"
        subtitle="To request a quote or meet for coffee at our Baramulla office, contact us directly or fill out the form below."
      />

      {/* PROJECT POPUP MODAL DRAWER */}
      {selectedProject &&
        createPortal(
          <div className={styles.drawerOverlay} onClick={closeProjectModal}>
            <aside
              className={styles.drawerPanel}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <header className={styles.drawerHeader}>
                <div className={styles.categoryBadge}>
                  <span>{selectedProject.category || "Engineering"}</span>
                </div>

                <div className={styles.drawerActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={handleCopyLink}
                    title="Copy direct project link"
                  >
                    {copied ? <FaCheck className={styles.successIcon} /> : <FaShareAlt />}
                  </button>

                  <div className={styles.divider} />

                  <div className={styles.navGroup}>
                    <button
                      className={styles.iconBtn}
                      onClick={handlePrevProject}
                      title="Previous project"
                    >
                      <FaChevronLeft />
                    </button>
                    <span className={styles.navCounter}>
                      {String(currentModalIndex + 1).padStart(2, "0")} /{" "}
                      {String(PROJECTS_DATA.length).padStart(2, "0")}
                    </span>
                    <button
                      className={styles.iconBtn}
                      onClick={handleNextProject}
                      title="Next project"
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  <div className={styles.divider} />

                  <button
                    className={styles.closeBtn}
                    onClick={closeProjectModal}
                    title="Close drawer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </header>

              <div className={styles.drawerContent}>
                <h1 className={styles.drawerTitle}>{selectedProject.title}</h1>

                <div className={styles.drawerMetaRow}>
                  <div className={styles.drawerMetaItem}>
                    <FaMapMarkerAlt className={styles.accentIcon} />
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className={styles.drawerMetaItem}>
                    <FaClock className={styles.accentIcon} />
                    <span>{selectedProject.duration || selectedProject.year}</span>
                  </div>
                </div>

                <div className={styles.drawerCoverWrapper}>
                  <img
                    src={selectedProject.coverImage || selectedProject.image}
                    alt={selectedProject.title}
                  />
                </div>

                <section className={styles.drawerSection}>
                  <h3>Project Overview</h3>
                  <p>{selectedProject.description || selectedProject.summary}</p>
                </section>

                {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                  <section className={styles.drawerSection}>
                    <h3>Project Gallery ({selectedProject.gallery.length} Images)</h3>
                    <div className={styles.galleryGrid}>
                      {selectedProject.gallery.map((img, idx) => (
                        <div key={idx} className={styles.galleryCard}>
                          <img
                            src={img.url || img}
                            alt={img.caption || `Gallery ${idx + 1}`}
                            loading="lazy"
                          />
                          {img.caption && (
                            <p className={styles.galleryCaption}>{img.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className={styles.drawerSection}>
                  <h3>Key Deliverables</h3>
                  <ul className={styles.deliverablesList}>
                    <li>
                      <FaCheckCircle className={styles.checkIcon} />
                      <span>Full architectural &amp; structural engineering compliance.</span>
                    </li>
                    <li>
                      <FaCheckCircle className={styles.checkIcon} />
                      <span>On-time execution with continuous site supervision.</span>
                    </li>
                    <li>
                      <FaCheckCircle className={styles.checkIcon} />
                      <span>High-durability structural material selection.</span>
                    </li>
                  </ul>
                </section>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
};

export default Home;