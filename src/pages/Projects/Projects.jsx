import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaHome, 
  FaMapMarkerAlt, 
  FaClock, 
  FaArrowRight, 
  FaSquare,
  FaSearch,
  FaSlidersH,
  FaChevronDown,
  FaTimes
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import ProjectDrawer from "../../components/projects/ProjectDrawer";
import styles from "./Projects.module.css";

// Full-Bleed Hero Image Assets
import heroDesktop from "../../assets/images/projects/project-hero-desktop.webp";
import heroMobile from "../../assets/images/projects/project-hero-mobile.webp";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const projectsSectionRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Live Projects directly from Supabase with unmount guard
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (isMounted) {
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
        }
      } catch (err) {
        console.error("Error loading live projects from Supabase:", err);
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search Logic
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ||
      p.category?.toLowerCase() === activeCategory.toLowerCase();

    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !cleanQuery ||
      p.title?.toLowerCase().includes(cleanQuery) ||
      p.location?.toLowerCase().includes(cleanQuery) ||
      p.summary?.toLowerCase().includes(cleanQuery) ||
      p.description?.toLowerCase().includes(cleanQuery) ||
      p.category?.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Sync state with URL Hash (#project-slug) and browser history navigation
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
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [projects]);

  const openProjectModal = useCallback((project) => {
    setSelectedProject(project);
    if (window.location.hash !== `#${project.slug}`) {
      window.history.pushState(null, "", `#${project.slug}`);
    }
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const scrollToProjectsTop = () => {
    if (window.lenis) {
      if (projectsSectionRef.current) {
        window.lenis.scrollTo(projectsSectionRef.current, { offset: -70 });
      } else {
        window.lenis.scrollTo(0);
      }
    } else {
      if (projectsSectionRef.current) {
        projectsSectionRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    setActivePage(1);
    setIsFilterOpen(false);
    scrollToProjectsTop();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActivePage(1);
  };

  const handleResetAll = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setActivePage(1);
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
  }, [currentModalIndex, filteredProjects, openProjectModal]);

  const handlePrevProject = useCallback(() => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (currentModalIndex - 1 + filteredProjects.length) % filteredProjects.length;
    openProjectModal(filteredProjects[prevIdx]);
  }, [currentModalIndex, filteredProjects, openProjectModal]);

  return (
    <div className={styles.pageWrapper}>
      <Helmet>
        <title>Portfolio & Completed Projects | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Explore our extensive portfolio of completed residential, commercial, and structural engineering projects across Kashmir by Nayaab Engineering Innovations."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/projects" />
      </Helmet>

      {/* HERO TRACK & SECTION */}
      <div className={styles.heroTrack}>
        <section className={styles.heroSection} aria-label="Projects Hero">
          <div className={styles.imageContainer}>
            <picture>
              <source media="(max-width: 768px)" srcSet={heroMobile} />
              <img
                src={heroDesktop}
                alt="Nayaab Engineering Portfolio"
                className={styles.imageElement}
                fetchPriority="high"
                loading="eager"
              />
            </picture>
            <div className={styles.imageOverlay} />
          </div>

          <div className={styles.heroContent}>
            <div className={`${styles.textWrapper} ${styles.animateSlideLeft} ${styles.delay1}`}>
              <div className={styles.breadcrumbWrapper}>
                <FaHome className={styles.homeIcon} aria-hidden="true" />
                <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                <span className={styles.slash}>/</span>
                <span className={styles.activeBreadcrumb}>Projects</span>
              </div>

              <h1 className={styles.mainTitle}>
                From Vision to
                <br />
                <span className={styles.titleGrey}>Built Realities</span>
              </h1>

              <p className={styles.subTitle}>
                Every project at Nayaab Engineering Innovations is thoughtfully planned.
              </p>

              <div className={styles.ctaGroup}>
                <Link to="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                  <span>Contact Us</span>
                </Link>
                <button 
                  type="button" 
                  onClick={scrollToProjectsTop} 
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  <span>Explore Work</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PROJECTS ARCHIVE SECTION */}
      <section className={styles.projectsSection} ref={projectsSectionRef} aria-labelledby="section-title">
        <div className={styles.projectsContainer}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
            <span>Complete Archive</span>
          </div>

          <div className={styles.sectionHeader}>
            <h2 id="section-title" className={styles.sectionTitle}>
              Discover Our Completed Projects
            </h2>
            <p className={styles.sectionDescription}>
              Browse through our portfolio of engineering, structural design, and turnkey construction developments across Kashmir.
            </p>
          </div>

          {/* CONTROLS BAR: ENTERPRISE SEARCH & FLOATING FILTER */}
          <div className={styles.controlsBar}>
            {/* Live Search Field */}
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by title, location, or discipline..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search projects"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className={styles.filterDropdownWrapper} ref={filterDropdownRef}>
              <button
                type="button"
                className={`${styles.filterTriggerBtn} ${isFilterOpen ? styles.filterTriggerActive : ""} ${activeCategory !== "All" ? styles.filterHasValue : ""}`}
                onClick={() => setIsFilterOpen((prev) => !prev)}
                aria-expanded={isFilterOpen}
                aria-haspopup="listbox"
              >
                <div className={styles.filterTriggerLeft}>
                  <FaSlidersH className={styles.filterSlidersIcon} aria-hidden="true" />
                  <span className={styles.filterBtnLabel}>
                    {activeCategory === "All" ? "Filter" : activeCategory}
                  </span>
                </div>
                <FaChevronDown className={`${styles.filterChevron} ${isFilterOpen ? styles.chevronRotated : ""}`} aria-hidden="true" />
              </button>

              {/* Floating Menu */}
              {isFilterOpen && (
                <div className={styles.filterMenu} role="listbox" aria-label="Select discipline filter">
                  <div className={styles.filterMenuHeader}>
                    <span className={styles.menuHeaderTitle}>Select Discipline</span>
                    {activeCategory !== "All" && (
                      <button
                        type="button"
                        className={styles.resetFilterBtn}
                        onClick={() => handleFilter("All")}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className={styles.filterOptionsGrid}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        role="option"
                        aria-selected={activeCategory === cat}
                        className={`${styles.filterOption} ${activeCategory === cat ? styles.filterOptionActive : ""}`}
                        onClick={() => handleFilter(cat)}
                      >
                        <span>{cat}</span>
                        {activeCategory === cat && <span className={styles.activeCheckDot} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Status & Results Counter */}
          {(activeCategory !== "All" || searchQuery) && (
            <div className={styles.filterFeedbackRow}>
              <span className={styles.feedbackText}>
                Showing <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? "project" : "projects"}
                {activeCategory !== "All" && <> in <em>"{activeCategory}"</em></>}
                {searchQuery && <> matching <em>"{searchQuery}"</em></>}
              </span>
              <button type="button" className={styles.resetFeedbackBtn} onClick={handleResetAll}>
                Clear all filters
              </button>
            </div>
          )}

          {/* Project Grid */}
          {loading ? (
            <div className={styles.statusBox}>
              Loading live portfolio archive  ...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.statusBox}>
              <p>No projects match your current filter or search criteri.</p>
              <button type="button" className={styles.emptyResetBtn} onClick={handleResetAll}>
                Reset Search &amp; Filters
              </button>
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
                      <div className={styles.cardImageOverlay} />
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle} title={project.title}>
                        {project.title}
                      </h3>

                      <p className={styles.cardSummary}>
                        {project.summary || project.description}
                      </p>

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
                        <span>Explore Project</span>
                        <div className={styles.arrowCircle}>
                          <FaArrowRight className={styles.linkArrow} aria-hidden="true" />
                        </div>
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