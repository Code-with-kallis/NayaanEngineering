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
      <section className={styles.heroSection}>
        <div className={styles.heroLeftCard}>
          <div className={`${styles.breadcrumb} ${styles.animateSlideLeft} ${styles.delay1}`}>
            <FaHome className={styles.homeIcon} />
            <span>Home</span>
            <span className={styles.slash}>/</span>
            <strong className={styles.activeBreadcrumb}>Project</strong>
          </div>

          <h1 className={`${styles.heroTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
            <span className={styles.titleDark}>Our Work. </span>
            <span className={styles.titleMuted}>
              Your
              <br />
              Vision Realized.
            </span>
          </h1>

          <p className={`${styles.heroText} ${styles.animateSlideLeft} ${styles.delay3}`}>
            Every project we complete is a reflection of our commitment to quality,
            precision, and client satisfaction. At Nayaab Engineering Innovations, we
            take pride in transforming ideas into built realities.
          </p>

          <Link to="/contact" className={`${styles.heroBtn} ${styles.animateSlideLeft} ${styles.delay4}`}>
            Contact Us
          </Link>
        </div>

        <div className={styles.heroRightGrid}>
          <div className={styles.heroImageMain}>
            <img src="/assets/projects/hero/projects-hero-01.webp" alt="Comprehensive multi-story residential project" />
          </div>
          <div className={styles.heroSubGrid}>
            <div className={styles.heroImageSub1}>
              <img src="/assets/projects/hero/projects-hero-02.webp" alt="Residential House" />
            </div>
            <div className={styles.heroImageSub2}>
              <img src="/assets/projects/hero/projects-hero-03.webp" alt="Modern Kitchen Interior" />
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS GRID SECTION */}
      <section className={styles.projectsSection} ref={projectsSectionRef}>
        <div className={styles.sectionTagRow}>
          <FaSquare className={styles.tagSquareIcon} />
          <span>See all Projects</span>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Discover Our Completed<br />Projects
          </h2>
          <p className={styles.sectionDescription}>
            Browse through our portfolio of engineering, structural design, and turnkey construction developments.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className={styles.filterBar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterTab} ${activeCategory === cat ? styles.activeFilterTab : ""}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
            Loading live portfolio...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>
            No projects found in this category.
          </div>
        ) : (
          <div className={styles.grid}>
            {paginatedProjects.map((project) => {
              const cover = project.coverImage || project.cover_image || project.image;
              return (
                <article 
                  key={project.id || project.slug} 
                  className={styles.projectCard}
                  onClick={() => openProjectModal(project)}
                >
                  <div className={styles.cardImageWrapper}>
                    <img src={cover} alt={project.title} loading="lazy" />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardSummary}>{project.summary || project.description}</p>

                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}>
                        <FaMapMarkerAlt className={styles.metaIcon} />
                        <span>{project.location}</span>
                      </div>
                      {project.duration && (
                        <div className={styles.metaItem}>
                          <FaClock className={styles.metaIcon} />
                          <span>{project.duration}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      className={styles.viewDetailBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectModal(project);
                      }}
                    >
                      <span>View More</span>
                      <FaArrowRight className={styles.linkArrow} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredProjects.length > ITEMS_PER_PAGE && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn} 
              disabled={activePage === 1}
              onClick={() => handlePageChange(activePage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`${styles.pageNumber} ${activePage === num ? styles.activePage : ""}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
            <button 
              className={styles.pageBtn} 
              disabled={activePage === totalPages}
              onClick={() => handlePageChange(activePage + 1)}
            >
              Next
            </button>
          </div>
        )}
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