import React, { useState, useEffect, useCallback, useRef } from "react";
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
  FaPalette,
  FaClipboardCheck,
  FaProjectDiagram,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarCheck,
  FaLayerGroup,
} from "react-icons/fa";
import Hero from "../../components/home/Hero";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import ProjectDrawer from "../../components/projects/ProjectDrawer";
import { supabase } from "../../lib/supabaseClient";
import { PROJECTS_DATA as fallbackProjects } from "../../data/projects";
import { SERVICES_DATA } from "../../data/services";
import styles from "./Home.module.css";

const SERVICE_ICONS = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaHardHat: <FaHardHat />,
  FaPalette: <FaPalette />,
  FaClipboardCheck: <FaClipboardCheck />,
};

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
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const servicesScrollRef = useRef(null);

  // Fetch Live Featured Projects from Supabase
  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category,
            location: item.location,
            duration: item.duration,
            summary: item.summary,
            deliverables: item.deliverables || [],
            description: item.description,
            coverImage: item.cover_image,
            galleryImages: item.gallery_images || [],
          }));
          setProjects(formatted);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.error("Error loading live projects on Home:", err);
        setProjects(fallbackProjects);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  const featuredProjects = projects.slice(0, 3);

  // Smooth Scroll Services Track
  const scrollServices = (direction) => {
    if (servicesScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      servicesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Sync state with URL Hash (#project-slug)
  useEffect(() => {
    if (projects.length === 0) return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = projects.find((p) => p.slug === hash || String(p.id) === hash);
        if (found) setSelectedProject(found);
      } else {
        setSelectedProject(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [projects]);

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
    ? projects.findIndex((p) => (p.slug || p.id) === (selectedProject.slug || selectedProject.id))
    : 0;

  const handleNextProject = useCallback(() => {
    if (projects.length === 0) return;
    const nextIdx = (currentModalIndex + 1) % projects.length;
    openProjectModal(projects[nextIdx]);
  }, [currentModalIndex, projects]);

  const handlePrevProject = useCallback(() => {
    if (projects.length === 0) return;
    const prevIdx = (currentModalIndex - 1 + projects.length) % projects.length;
    openProjectModal(projects[prevIdx]);
  }, [currentModalIndex, projects]);

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
            <h2 className={styles.splitTitle}>Driven by Quality</h2>
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

        {loadingProjects ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
            Loading featured work...
          </div>
        ) : (
          <div className={styles.projectGrid}>
            {featuredProjects.map((project) => {
              const cover = project.coverImage || project.cover_image || project.image;
              return (
                <article
                  key={project.id || project.slug}
                  className={styles.projectCard}
                  onClick={() => openProjectModal(project)}
                >
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={cover}
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
              );
            })}
          </div>
        )}

        <div className={styles.viewAllWrapper}>
          <Link to="/projects" className={styles.viewAllBtn}>
            <span>View All Projects</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* 4. DYNAMIC CORE SERVICES SECTION (HORIZONTAL SWIPE) */}
      <section className={styles.servicesPreview}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>What We Do</span>
            </div>
            <h2 className={styles.splitTitle}>Our Core Services</h2>
          </div>

          <div className={styles.splitHeaderRightControls}>
            <p className={styles.splitDesc}>
              End-to-end civil engineering and construction solutions across Jammu &amp; Kashmir.
            </p>
            {/* Scroll Control Arrows */}
            <div className={styles.sliderControls}>
              <button
                className={styles.sliderArrowBtn}
                onClick={() => scrollServices("left")}
                aria-label="Scroll services left"
              >
                <FaChevronLeft />
              </button>
              <button
                className={styles.sliderArrowBtn}
                onClick={() => scrollServices("right")}
                aria-label="Scroll services right"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* SWIPABLE HORIZONTAL TRACK */}
        <div className={styles.serviceGridSlider} ref={servicesScrollRef}>
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id || service.slug}
              to={`/services/${service.slug}`}
              className={styles.serviceCard}
            >
              <div className={styles.serviceIconBox}>
                {SERVICE_ICONS[service.icon] || <FaBuilding />}
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDesc}</p>
              <div className={styles.serviceLinkBtn}>
                <span>Explore Details</span>
                <FaArrowRight className={styles.serviceArrow} />
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link to="/services" className={styles.viewAllBtn}>
            <span>View All Services</span>
            <FaArrowRight />
          </Link>
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
            <img src="/assets/team/junaid.jpg" alt="Site Supervision" />
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

      {/* MODULAR PROJECT POPUP DRAWER */}
      <ProjectDrawer 
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={closeProjectModal}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        currentIndex={currentModalIndex}
        totalProjects={projects.length}
      />
    </>
  );
};

export default Home;