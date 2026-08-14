import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout"; //[cite: 1]
import ScrollToTop from "./components/ScrollToTop"; //[cite: 1]
import PageLoader from "./components/common/PageLoader";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home/Home"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const About = lazy(() => import("./pages/About/About"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("./pages/Projects/ProjectDetail"));
const Services = lazy(() => import("./pages/Services/Services"));
const ServiceDetail = lazy(() => import("./pages/Services/ServiceDetail"));
const TeamProfile = lazy(() => import("./pages/Team/TeamProfile"));
const Admin = lazy(() => import("./pages/Admin/Admin"));

function App() {
  return (
    <>
      <ScrollToTop /> {/*[cite: 1] */}

      {/* Styled Loader displays cleanly during route transitions */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}> {/*[cite: 1] */}
            <Route index element={<Home />} /> {/*[cite: 1] */}
            <Route path="contact" element={<Contact />} /> {/*[cite: 1] */}
            <Route path="about" element={<About />} /> {/*[cite: 1] */}
            <Route path="team" element={<Navigate to="/about" replace />} /> {/*[cite: 1] */}
            <Route path="projects" element={<Projects />} /> {/*[cite: 1] */}
            <Route path="projects/:slug" element={<ProjectDetail />} /> {/*[cite: 1] */}
            <Route path="services" element={<Services />} /> {/*[cite: 1] */}
            <Route path="services/:slug" element={<ServiceDetail />} /> {/*[cite: 1] */}
          </Route>

          <Route path="/team/:employeeId" element={<TeamProfile />} /> {/*[cite: 1] */}
          <Route path="/admin" element={<Admin />} /> {/*[cite: 1] */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;