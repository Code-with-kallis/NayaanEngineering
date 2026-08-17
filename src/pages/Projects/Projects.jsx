import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaClock, 
  FaArrowRight, 
  FaSquare
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import ProjectDrawer from "../../components/projects/ProjectDrawer";
import styles from "./Projects.module.css";

// Bundler asset imports
import heroImage1 from "../../assets/images/projects/projects-hero-01.webp";
import heroImage2 from "../../assets/images/projects/projects-hero-02.webp";
import heroImage3 from "../../assets/images/projects/projects-hero-03.webp";

const CATEGORIES = [
  "All",
  "Aviation",
  "Building",
  "Commercial",
  "Electrical",
  "Energy",
  "Residential",
  "Stadium"
];

const ITEMS_PER_PAGE = 12;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const projectsSectionRef = useRef(null);

  // Fetch Live Projects directly from Supabase
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
        console.error("Error loading live projects from Supabase:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  // Category filter
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Sync state with URL Hash (#project-slug)
  useEffect(() => {
    if (projects.length === 0) return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = projects.find(p => p.slug === hash || String(p.id) === hash);
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

  const scrollToProjectsTop = () => {
    if (projectsSectionRef.current) {
      projectsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    setActivePage(1);
    scrollToProjectsTop();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
      scrollToProjectsTop();
    }
  };

  // Drawer Navigation
  const currentModalIndex = selectedProject 
    ? filteredProjects.findIndex(p => (p.slug || p.id) === (selectedProject.slug || selectedProject.id))
    : 0;

  const handleNextProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (currentModalIndex + 1) % filteredProjects.length;
    openProjectModal(filteredProjects[nextIdx]);
  }, [currentModalIndex, filteredProjects]);

  const handlePrevProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (currentModalIndex - 1 + filteredProjects.length) % filteredProjects.length;
    openProjectModal(filteredProjects[prevIdx]);
  }, [currentModalIndex, filteredProjects]);

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection} aria-labelledby="hero-title">
        <div className={styles.heroContainer}>
          <div className={styles.heroLeftCard}>
            <div className={`${styles.breadcrumb} ${styles.animateSlideLeft} ${styles.delay1}`}>
              <FaHome className={styles.homeIcon} aria-hidden="true" />
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.slash}>/</span>
              <strong className={styles.activeBreadcrumb}>Project</strong>
            </div>

            <h1 id="hero-title" className={`${styles.heroTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
              <span className={styles.titleDark}>From Vision to  </span>
              <span className={styles.titleMuted}>
                Exceptional
                <br />
                Built Realities:
              </span>
            </h1>

            <p className={`${styles.heroText} ${styles.animateSlideLeft} ${styles.delay3}`}>
              Every project at Nayaab Engineering Innovations is thoughtfully planned, precisely executed, and built around the unique needs of our clients. From the initial concept to the final execution, we combine engineering expertise, attention to detail, and uncompromising quality to turn ambitious ideas into spaces that are functional, refined, and built to stand the test of time.
            </p>

            <Link to="/contact" className={`${styles.heroBtn} ${styles.animateSlideLeft} ${styles.delay4}`}>
              Contact Us
            </Link>
          </div>

          <div className={styles.heroRightGrid}>
            <div className={styles.heroImageMain}>
              <img 
                src={heroImage1} 
                alt="Comprehensive multi-story residential project" 
                loading="eager"
                decoding="async"
              />
            </div>
            <div className={styles.heroSubGrid}>
              <div className={styles.heroImageSub1}>
                <img 
                  src={heroImage2} 
                  alt="Residential House" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.heroImageSub2}>
                <img 
                  src={heroImage3} 
                  alt="Modern Kitchen Interior" 
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS GRID SECTION */}
      <section className={styles.projectsSection} ref={projectsSectionRef} aria-labelledby="section-title">
        <div className={styles.projectsContainer}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
            <span>See all Projects</span>
          </div>

          <div className={styles.sectionHeader}>
            <h2 id="section-title" className={styles.sectionTitle}>
              Discover Our Completed<br />Projects
            </h2>
            <p className={styles.sectionDescription}>
              Browse through our portfolio of engineering, structural design, and turnkey construction developments.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className={styles.filterBar} role="tablist" aria-label="Filter projects by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`${styles.filterTab} ${activeCategory === cat ? styles.activeFilterTab : ""}`}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Equalized Grid Cards with GPU Hover Animations */}
          {loading ? (
            <div className={styles.statusBox}>
              Loading live portfolio...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.statusBox}>
              No projects found in this category.
            </div>
          ) : (
            <div className={styles.grid}>
              {paginatedProjects.map((project) => {
                const cover = project.coverImage || project.cover_image || project.image;
                const projectId = project.id || project.slug;

                return (
                  <article 
                    key={projectId} 
                    className={styles.projectCard}
                    onClick={() => openProjectModal(project)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openProjectModal(project);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${project.title}`}
                  >
                    <div className={styles.cardImageWrapper}>
                      <img 
                        src={cover} 
                        alt={project.title} 
                        loading="lazy" 
                        decoding="async"
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle} title={project.title}>
                        {project.title}
                      </h3>

                      <p className={styles.cardSummary}>
                        {project.summary || project.description}
                      </p>

                      {/* Single-Row Grid on Desktop, Stacked on Mobile */}
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem} title={project.location || ""}>
                          <FaMapMarkerAlt className={styles.metaIcon} aria-hidden="true" />
                          <span>{project.location || "Location on Request"}</span>
                        </div>

                        {project.duration && (
                          <div className={styles.metaItem} title={project.duration}>
                            <FaClock className={styles.metaIcon} aria-hidden="true" />
                            <span>{project.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.viewDetailBtn}>
                        <span>View More</span>
                        <FaArrowRight className={styles.linkArrow} aria-hidden="true" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredProjects.length > ITEMS_PER_PAGE && (
            <nav className={styles.pagination} aria-label="Portfolio pagination">
              <button 
                type="button"
                className={styles.pageBtn} 
                disabled={activePage === 1}
                onClick={() => handlePageChange(activePage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  type="button"
                  key={num}
                  className={`${styles.pageNumber} ${activePage === num ? styles.activePage : ""}`}
                  onClick={() => handlePageChange(num)}
                  aria-current={activePage === num ? "page" : undefined}
                >
                  {num}
                </button>
              ))}
              <button 
                type="button"
                className={styles.pageBtn} 
                disabled={activePage === totalPages}
                onClick={() => handlePageChange(activePage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* MODULAR POPUP DRAWER */}
      <ProjectDrawer 
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={closeProjectModal}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        currentIndex={currentModalIndex}
        totalProjects={filteredProjects.length}
      />
    </div>
  );
}