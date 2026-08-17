import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/common/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded routes
const Home = lazy(() => import("./pages/Home/Home"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("./pages/Projects/ProjectDetail"));
const Services = lazy(() => import("./pages/Services/Services"));
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail"));
const TeamProfile = lazy(() => import("./pages/Team/TeamProfile"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* All routes are wrapped by Layout to manage route transitions and chrome visibility */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="team" element={<Navigate to="/about" replace />} />
              <Route path="team/:employeeId" element={<TeamProfile />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="admin" element={<Admin />} />
              
              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}