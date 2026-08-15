// src/pages/Home/Home.jsx
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
  FaHardHat,
  FaProjectDiagram,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaRegCalendarCheck,
  FaLayerGroup,
  FaCube,
  FaStar,
} from "react-icons/fa";
import Hero from "../../components/home/Hero";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import ProjectDrawer from "../../components/projects/ProjectDrawer";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Home.module.css";

const HOUSE_3D_IMAGE = "assets/home/3d-house.png";

const highlightItems = [
  {
    icon: <FaRegCalendarCheck className={styles.highlightIcon} />,
    title: "Est. 2022",
    subtitle: "Founded in Baramulla, J&K",
  },
  {
    icon: <FaAward className={styles.highlightIcon} />,
    title: "DPIIT Recognized 2024",
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

const BRAND_PLATFORMS = [
  {
    name: "DPIIT",
    sub: "#startupindia",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgDpiit}`}>
        <FaAward className={styles.badgeSvgIcon} />
      </span>
    ),
  },
  {
    name: "StartupJK",
    sub: "Govt. of J&K",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgJk}`}>JK</span>
    ),
  },
  {
    name: "Google",
    sub: "Verified Business",
    icon: (
      <svg viewBox="0 0 24 24" className={styles.brandSvg}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    ),
  },
  {
    name: "Justdial",
    sub: "4.7 ★ Rated",
    isRating: true,
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgJustdial}`}>JD</span>
    ),
  },
  {
    name: "Dun & Bradstreet",
    sub: "Global Registry",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgDnb}`}>d&amp;b</span>
    ),
  },
  {
    name: "Zauba Corp",
    sub: "MCA / RoC Listed",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgZauba}`}>Z</span>
    ),
  },
  {
    name: "Tofler",
    sub: "Corporate Profile",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgTofler}`}>T</span>
    ),
  },
  {
    name: "The Company Check",
    sub: "Verified Registry",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgTcc}`}>✓</span>
    ),
  },
  {
    name: "Neusource",
    sub: "Civil Classified",
    icon: (
      <span className={`${styles.brandBadge} ${styles.bgNeu}`}>N</span>
    ),
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

  const splitSectionRef = useRef(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // 1. Entrance Observer: Unobserve immediately once visible to free up mobile GPU/CPU
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
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(
      `.${styles.revealOnScroll}, .${styles.fullBleedSplitSection}`
    );
    animatedElements.forEach((el) => observer.observe(el));

    // 2. Scroll lock logic ONLY for Desktop with precise pointer
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    let cleanupScrollLock = () => {};

    if (!isCoarsePointer && window.innerWidth > 1024) {
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

      const handleWheel = (e) => {
        if (!splitSectionRef.current) return;
        const currentScroll = window.scrollY || window.pageYOffset;
        const splitTop = splitSectionRef.current.offsetTop;

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

      window.addEventListener("wheel", handleWheel, { passive: false });

      cleanupScrollLock = () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }

    return () => {
      observer.disconnect();
      cleanupScrollLock();
    };
  }, []);

  // Fetch Live Featured Projects directly from Supabase
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
          setProjects([]);
        }
      } catch (err) {
        console.error("Error loading live projects on Home:", err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  const featuredProjects = projects.slice(0, 3);

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
      <section className={styles.heroWrapper}>
        <Hero />
      </section>

      {/* 2. FULL-SCREEN 50/50 SPLIT SHOWCASE */}
      <section
        ref={splitSectionRef}
        className={styles.fullBleedSplitSection}
        aria-label="Core Engineering Services and Architectural Visualization"
      >
        <div className={styles.splitHalfLeft}>
          <div
            className={styles.splitBackground}
            style={{ backgroundImage: `url(${HOUSE_3D_IMAGE})` }}
          />
          <div className={styles.ambientGlowLeft} />
        </div>

        <div className={styles.splitHalfRight}>
          <div className={styles.typographyContentWrapper}>
            <div className={styles.typoEyebrowBadge}>
              <FaCube className={styles.badgeIcon} />
              <span>CORE ENGINEERING &amp; DESIGN SERVICES</span>
            </div>

            <h2 className={styles.typoMainHeading}>
              End-To-End Engineering <br />
              <span>&amp; Modern Architecture</span>
            </h2>

            <p className={styles.typoDescription}>
              Delivering integrated civil engineering solutions with structural precision and high-fidelity 3D modeling tailored for regional terrain demands.
            </p>

            <div className={styles.typoFeatureList}>
              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaLayerGroup />
                </div>
                <div className={styles.featureText}>
                  <h4>1. Architectural &amp; 3D BIM Design</h4>
                  <p>Comprehensive 2D blueprints, realistic 3D exterior renders, and complete spatial planning.</p>
                </div>
              </div>

              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaDraftingCompass />
                </div>
                <div className={styles.featureText}>
                  <h4>2. Structural Engineering &amp; Seismic Safety</h4>
                  <p>Load calculation, foundation design, and compliance with Zone-V seismic safety standards.</p>
                </div>
              </div>

              <div className={styles.typoFeatureItem}>
                <div className={styles.featureBullet}>
                  <FaHardHat />
                </div>
                <div className={styles.featureText}>
                  <h4>3. Turnkey Execution &amp; Site Supervision</h4>
                  <p>On-site quality monitoring, material standard testing, and full project lifecycle execution.</p>
                </div>
              </div>
            </div>

            <div className={styles.typoBottomBar}>
              <span className={styles.typoLocationTag}>
                <FaShieldAlt /> DPIIT Recognized • IS Code Compliant
              </span>
              <Link to="/services" className={styles.typoActionLink}>
                <span>Explore All Services</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTINUOUS SLIDING BRAND MARQUEE (FULL COLOR BY DEFAULT) */}
      <section className={styles.brandMarqueeSection} aria-label="Recognized and Verified Portals">
        <div className={styles.brandMarqueeHeader}>
          <span className={styles.brandMarqueeEyebrow}>
            VERIFIED, LISTED &amp; RECOGNIZED ACROSS NATIONAL REGISTRIES
          </span>
        </div>

        <div className={styles.brandMarqueeViewport}>
          <div className={styles.brandMarqueeTrack}>
            {/* Primary Track */}
            {BRAND_PLATFORMS.map((item, idx) => (
              <div key={`brand-primary-${idx}`} className={styles.brandItem}>
                {item.icon}
                <div className={styles.brandTextLockup}>
                  <span className={styles.brandPrimary}>{item.name}</span>
                  {item.isRating ? (
                    <span className={styles.brandRating}>
                      4.7 <FaStar className={styles.starIcon} /> Rated
                    </span>
                  ) : (
                    <span className={styles.brandSecondary}>{item.sub}</span>
                  )}
                </div>
              </div>
            ))}
            {/* Infinite Loop Duplication */}
            {BRAND_PLATFORMS.map((item, idx) => (
              <div key={`brand-duplicate-${idx}`} className={styles.brandItem}>
                {item.icon}
                <div className={styles.brandTextLockup}>
                  <span className={styles.brandPrimary}>{item.name}</span>
                  {item.isRating ? (
                    <span className={styles.brandRating}>
                      4.7 <FaStar className={styles.starIcon} /> Rated
                    </span>
                  ) : (
                    <span className={styles.brandSecondary}>{item.sub}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT OUR COMPANY */}
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
              Incorporated in 2024 and headquartered in Baramulla, we combine formal corporate standards with regional expertise.
            </p>
          </div>
        </div>

        <div className={styles.bentoGrid}>
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
              <div className={styles.bigStatNum}>2024</div>
              <p className={styles.bentoText}>
                Incorporated as a Private Limited Engineering Company (CIN: U42900JK2024PTC015987 ) under RoC Jammu.
              </p>
              <div className={styles.avatarStack}>
                <div className={styles.avatar} title="Junaid Bilal Sheikh">J</div>
                <div className={styles.avatar} title="Aaqib Nazir Tantary">A</div>
                <div className={styles.avatar} title="Saajid Rashid Malik">S</div>
                <div className={styles.avatarPlus}>+</div>
              </div>
            </div>
          </div>

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

      {/* 5. FEATURED WORK */}
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
        ) : featuredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
            No featured projects available.
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

      {/* 6. WHY BUILDERS & CLIENTS TRUST US */}
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
            <img src="/assets/team/sajid.jpeg" alt="Site Supervision" />
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

      {/* 7. OUR 4-STEP PROCESS */}
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

      {/* 8. TICKER SECTION */}
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

      {/* 9. CONTACT FORM */}
      <ContactForm
        eyebrow="GET IN TOUCH"
        title="Let's talk"
        subtitle="To request a quote or meet for coffee at our Baramulla office, contact us directly or fill out the form below."
      />

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