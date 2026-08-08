import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaClock, 
  FaArrowRight, 
  FaSquare,
  FaTimes,
  FaShareAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle
} from "react-icons/fa";
import { PROJECTS_DATA } from "../../data/projects";
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

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  // Filter projects by category
  const filteredProjects = activeCategory === "All"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Sync state with URL Hash (#project-slug)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = PROJECTS_DATA.find(p => p.slug === hash || String(p.id) === hash);
        if (found) setSelectedProject(found);
      } else {
        setSelectedProject(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Lock body scroll when modal is active
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

  const handleFilter = (category) => {
    setActiveCategory(category);
    setActivePage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  // Drawer Next/Prev Navigation
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

  // Keyboard navigation for Modal
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
    <div className={styles.pageWrapper}>
      {/* ================= HERO SECTION ================= */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeftCard}>
          <div className={styles.breadcrumb}>
            <FaHome className={styles.homeIcon} />
            <span>Home</span>
            <span className={styles.slash}>/</span>
            <strong className={styles.activeBreadcrumb}>Project</strong>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.titleDark}>Our Work. </span>
            <span className={styles.titleMuted}>
              Your
              <br />
              Vision Realized.
            </span>
          </h1>

          <p className={styles.heroText}>
            Every project we complete is a reflection of our commitment to quality,
            precision, and client satisfaction. At Nayaab Engineering Innovations, we
            take pride in transforming ideas into built realities — from custom residential
            builds to structural engineering solutions.
          </p>

          <Link to="/contact" className={styles.heroBtn}>
            Contact Us
          </Link>
        </div>

        {/* Right Chamfered Image Composition */}
        <div className={styles.heroRightGrid}>
          <div className={styles.heroImageMain}>
            <img 
              src="/assets/projects/proj-04.webp" 
              alt="Engineers on site" 
            />
          </div>
          <div className={styles.heroSubGrid}>
            <div className={styles.heroImageSub1}>
              <img 
                src="/assets/projects/hero/hero-01.webp" 
                alt="Skyscraper architecture" 
              />
            </div>
            <div className={styles.heroImageSub2}>
              <img 
                src="/assets/projects/hero/hero-02.webp" 
                alt="Construction site detailing" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPLETED PROJECTS GRID SECTION ================= */}
      <section className={styles.projectsSection}>
        <div className={styles.sectionTagRow}>
          <FaSquare className={styles.tagSquareIcon} />
          <span>See all Projects</span>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Discover Our Completed<br />Projects
          </h2>
          <p className={styles.sectionDescription}>
Our portfolio website is currently under active development. Complete project details and specifications will be published shortly.          </p>
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

        {/* Project Cards Grid */}
        <div className={styles.grid}>
          {paginatedProjects.map((project) => (
            <article 
              key={project.id || project.slug} 
              className={styles.projectCard}
              onClick={() => openProjectModal(project)}
            >
              <div className={styles.cardImageWrapper}>
                <img src={project.coverImage || project.image} alt={project.title} loading="lazy" />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardSummary}>{project.summary || project.description}</p>

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
                  <span>View More</span>
                  <FaArrowRight className={styles.linkArrow} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Dynamic Pagination Controls */}
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
      </section>

      {/* ================= PROJECT POPUP MODAL DRAWER ================= */}
      {selectedProject && createPortal(
        <div className={styles.drawerOverlay} onClick={closeProjectModal}>
          <aside 
            className={styles.drawerPanel} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Navigation Bar */}
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
                  <button className={styles.iconBtn} onClick={handlePrevProject} title="Previous project">
                    <FaChevronLeft />
                  </button>
                  <span className={styles.navCounter}>
                    {String(currentModalIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                  </span>
                  <button className={styles.iconBtn} onClick={handleNextProject} title="Next project">
                    <FaChevronRight />
                  </button>
                </div>

                <div className={styles.divider} />

                <button className={styles.closeBtn} onClick={closeProjectModal} title="Close drawer">
                  <FaTimes />
                </button>
              </div>
            </header>

            {/* Scrollable Content Body */}
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

              {/* Cover Image */}
              <div className={styles.drawerCoverWrapper}>
                <img 
                  src={selectedProject.coverImage || selectedProject.image} 
                  alt={selectedProject.title} 
                />
              </div>

              {/* Overview */}
              <section className={styles.drawerSection}>
                <h3>Project Overview</h3>
                <p>{selectedProject.description || selectedProject.summary}</p>
              </section>

              {/* Specifications */}
              {selectedProject.specifications && selectedProject.specifications.length > 0 && (
                <section className={styles.drawerSection}>
                  <h3>Technical Specifications</h3>
                  <div className={styles.specGrid}>
                    {selectedProject.specifications.map((spec, idx) => (
                      <div key={idx} className={styles.specCard}>
                        <span className={styles.specLabel}>{spec.label}</span>
                        <span className={styles.specValue}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Multi-Image Gallery */}
              {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                <section className={styles.drawerSection}>
                  <h3>Project Gallery ({selectedProject.gallery.length} Images)</h3>
                  <div className={styles.galleryGrid}>
                    {selectedProject.gallery.map((img, idx) => (
                      <div key={idx} className={styles.galleryCard}>
                        <img src={img.url || img} alt={img.caption || `Gallery ${idx + 1}`} loading="lazy" />
                        {img.caption && <p className={styles.galleryCaption}>{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Deliverables */}
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
    </div>
  );
}