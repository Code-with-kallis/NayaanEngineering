import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../../components/home/Hero";
import BrandMarquee from "../../components/home/BrandMarquee";
import StatsCounter from "../../components/home/StatsCounter";
import AboutBento from "../../components/home/AboutBento";
import SplitShowcase from "../../components/home/SplitShowcase";
import FeaturedProjects from "../../components/home/FeaturedProjects";
import ProcessSection from "../../components/home/ProcessSection";
import WhyTrustUs from "../../components/home/WhyTrustUs";
import GoogleReviews from "../../components/home/GoogleReviews";
import TickerBanner from "../../components/home/TickerBanner";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import ProjectDrawer from "../../components/projects/ProjectDrawer";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Home.module.css";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch Live Featured Projects directly from Supabase
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
        console.error("Error loading live projects on Home:", err);
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setLoadingProjects(false);
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state with URL Hash (#project-slug) and browser history navigation
  useEffect(() => {
    if (projects.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = projects.find(
          (p) => p.slug === hash || String(p.id) === hash
        );
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
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const currentModalIndex = selectedProject
    ? projects.findIndex(
        (p) => (p.slug || p.id) === (selectedProject.slug || selectedProject.id)
      )
    : 0;

  const handleNextProject = useCallback(() => {
    if (projects.length === 0) return;
    const nextIdx = (currentModalIndex + 1) % projects.length;
    openProjectModal(projects[nextIdx]);
  }, [currentModalIndex, projects, openProjectModal]);

  const handlePrevProject = useCallback(() => {
    if (projects.length === 0) return;
    const prevIdx = (currentModalIndex - 1 + projects.length) % projects.length;
    openProjectModal(projects[prevIdx]);
  }, [currentModalIndex, projects, openProjectModal]);

  return (
    <>
      <Helmet>
        <title>Nayaab Engineering | Premier Architectural & Structural Engineering</title>
        <meta
          name="description"
          content="Nayaab Engineering provides turnkey construction, architectural design, and structural consultancy in Kashmir. View our featured projects and request a consultation."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/" />
      </Helmet>

      {/* 1. HERO */}
      <section className={styles.heroWrapper}>
        <Hero />
      </section>

      {/* 2. LOGO MARQUEE */}
      <BrandMarquee />

      {/* 3. BOLD STATS COUNTER */}
      <StatsCounter />

      {/* 4. ABOUT BENTO */}
      <AboutBento />

      {/* 5. SPLIT SHOWCASE */}
      <SplitShowcase />

      {/* 6. FEATURED WORK */}
      <FeaturedProjects
        projects={projects}
        loading={loadingProjects}
        onOpenModal={openProjectModal}
      />

      {/* 7. OUR PROCESS */}
      <ProcessSection />

      {/* 8. WHY TRUST US */}
      <WhyTrustUs />

      {/* 9. GOOGLE REVIEWS */}
      <GoogleReviews />

      {/* 10. TICKER */}
      <TickerBanner />

      {/* 11. CONTACT FORM */}
      <ContactForm />

      {/* 12. MODAL DRAWER */}
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
}