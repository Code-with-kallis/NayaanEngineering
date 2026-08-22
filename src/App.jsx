// src/App.jsx
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout/Layout";
import ScrollManager from "./components/common/ScrollManager";
import PageLoader from "./components/common/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

// Public Application Routes
const Home = lazy(() => import("./pages/Home/Home"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("./pages/Projects/ProjectDetail"));
const Services = lazy(() => import("./pages/Services/Services"));
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail"));
const TeamProfile = lazy(() => import("./pages/Team/TeamProfile"));
const Terms = lazy(() => import("./pages/legal/Terms"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Admin Route
const Admin = lazy(() => import("./pages/Admin/Admin"));

/**
 * Determine whether the current request is intended for the Admin subdomain.
 * Supports:
 * - Production/Staging subdomains: admin.nayaabengineering.com, admin.*
 * - Local development subdomains: admin.localhost
 * - Query parameter override for rapid dev toggling: ?admin=true or ?admin=1
 * - Vite environment flag override: VITE_ADMIN_MODE=true
 */
function isAdminSubdomain() {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname.toLowerCase();

  // 1. Explicit query parameter for quick local development testing
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("admin") === "true" || searchParams.get("admin") === "1") {
    return true;
  }

  // 2. Subdomain check (admin.nayaabengineering.com, admin.localhost, admin.*)
  if (hostname.startsWith("admin.") || hostname === "admin.localhost") {
    return true;
  }

  // 3. Environment variable fallback (optional)
  if (import.meta.env.VITE_ADMIN_MODE === "true") {
    return true;
  }

  return false;
}

/**
 * Component to handle external redirect when a user accesses /admin on the public domain.
 */
function AdminRedirect() {
  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    const subPath = window.location.pathname.replace(/^\/admin\/?/, "");
    const targetPath = subPath ? `/${subPath}` : "/";
    const searchAndHash = `${window.location.search}${window.location.hash}`;

    if (isLocal) {
      const port = window.location.port ? `:${window.location.port}` : "";
      window.location.replace(
        `${window.location.protocol}//admin.localhost${port}${targetPath}${searchAndHash}`
      );
    } else {
      window.location.replace(
        `https://admin.nayaabengineering.com${targetPath}${searchAndHash}`
      );
    }
  }, []);

  return <PageLoader />;
}

export default function App() {
  const isAdmin = isAdminSubdomain();

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ScrollManager />
        <Suspense fallback={<PageLoader />}>
          {isAdmin ? (
            /* ADMIN ROUTE TREE — Isolated from public layout and pages */
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="/inquiries" element={<Admin />} />
              <Route path="/projects" element={<Admin />} />
              <Route path="/new-project" element={<Admin />} />
              <Route path="/settings" element={<Admin />} />
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            /* PUBLIC ROUTE TREE — Full website with Public Layout & 404 */
            <Routes>
              {/* Isolated External Redirect for Admin URLs on Public Domain */}
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="/admin/*" element={<AdminRedirect />} />

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
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          )}
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}