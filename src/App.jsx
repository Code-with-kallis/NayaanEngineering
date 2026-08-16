// src/App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/common/PageLoader";

// 1. Direct Home import (Initial load ke turant baad smoothly visible hoga)
import Home from "./pages/Home/Home";

// 2. Lazy-loaded pages
const Contact = lazy(() => import("./pages/Contact/Contact"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("./pages/Projects/ProjectDetail"));
const Services = lazy(() => import("./pages/Services/Services"));
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail"));
const TeamProfile = lazy(() => import("./pages/Team/TeamProfile"));
const Admin = lazy(() => import("./pages/Admin/Admin"));

// 3. Standalone Legal Pages (No Navbar, No Footer)
const Terms = lazy(() => import("./pages/legal/Terms"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main Website Layout (Includes Navbar & Footer) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="team" element={<Navigate to="/about" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
          </Route>

          {/* Standalone Legal Pages (No Navbar, No Footer) */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Other Standalone Routes */}
          <Route path="/team/:employeeId" element={<TeamProfile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;