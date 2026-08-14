import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout"; //
import ScrollToTop from "./components/ScrollToTop"; //[cite: 16]
import PageLoader from "./components/common/PageLoader"; //[cite: 16]

// 1. Direct Home import (Initial load ke turant baad smoothly visible hoga)
import Home from "./pages/Home/Home"; //[cite: 16]

// 2. Lazy-loaded pages
const Contact = lazy(() => import("./pages/Contact/Contact")); //[cite: 16]
const About = lazy(() => import("./pages/About/About")); //[cite: 16]
const Projects = lazy(() => import("./pages/Projects/Projects")); //[cite: 16]
const ProjectDetail = lazy(() => import("./pages/Projects/ProjectDetail")); //[cite: 16]
const Services = lazy(() => import("./pages/Services/Services")); //[cite: 16]
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail")); //[cite: 16]
const TeamProfile = lazy(() => import("./pages/Team/TeamProfile")); //[cite: 16]
const Admin = lazy(() => import("./pages/Admin/Admin")); //[cite: 16]

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Jab bhi koi website pehli baar kholega ya page refresh karega:
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 750); // 750ms ka clean premium branding loader

    return () => clearTimeout(timer);
  }, []);

  // 1. Full Page Loader on Initial Open / Refresh
  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTop /> {/*[cite: 16] */}

      {/* 2. Route-level Suspense loader during page navigation */}
      <Suspense fallback={<PageLoader />}> {/*[cite: 16] */}
        <Routes>
          <Route path="/" element={<Layout />}> {/*[cite: 16] */}
            <Route index element={<Home />} /> {/*[cite: 16] */}
            <Route path="contact" element={<Contact />} /> {/*[cite: 16] */}
            <Route path="about" element={<About />} /> {/*[cite: 16] */}
            <Route path="team" element={<Navigate to="/about" replace />} /> {/*[cite: 16] */}
            <Route path="projects" element={<Projects />} /> {/*[cite: 16] */}
            <Route path="projects/:slug" element={<ProjectDetail />} /> {/*[cite: 16] */}
            <Route path="services" element={<Services />} /> {/*[cite: 16] */}
            <Route path="services/:slug" element={<ServiceDetail />} /> {/*[cite: 16] */}
          </Route>

          <Route path="/team/:employeeId" element={<TeamProfile />} /> {/*[cite: 16] */}
          <Route path="/admin" element={<Admin />} /> {/*[cite: 16] */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;