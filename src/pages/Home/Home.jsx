// src/pages/Home/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import Hero from "../../components/home/Hero";
import SplitShowcase from "../../components/home/SplitShowcase";
import BrandMarquee from "../../components/home/BrandMarquee";
import AboutBento from "../../components/home/AboutBento";
import FeaturedProjects from "../../components/home/FeaturedProjects";
import WhyTrustUs from "../../components/home/WhyTrustUs";
import ProcessSection from "../../components/home/ProcessSection";
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
      <SplitShowcase />

      {/* 3. CONTINUOUS SLIDING BRAND MARQUEE (FULL COLOR BY DEFAULT) */}
      <BrandMarquee />

      {/* 4. ABOUT OUR COMPANY */}
      <AboutBento />

      {/* 5. FEATURED WORK */}
      <FeaturedProjects
        projects={projects}
        loading={loadingProjects}
        onOpenModal={openProjectModal}
      />

      {/* 6. WHY BUILDERS & CLIENTS TRUST US */}
      <WhyTrustUs />

      {/* 7. OUR 4-STEP PROCESS */}
      <ProcessSection />

      {/* 8. TICKER SECTION */}
      <TickerBanner />

      {/* 9. CONTACT FORM */}
      <ContactForm
        eyebrow="GET IN TOUCH"
        title="Let's talk"
        subtitle="To request a quote or meet for coffee at our Baramulla office, contact us directly or fill out the form below."
      />

      {/* 10. MODULAR DRAWER MODAL */}
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