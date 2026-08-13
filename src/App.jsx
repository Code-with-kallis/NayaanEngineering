import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/layout/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import TeamProfile from "./pages/Team/TeamProfile"; // Standalone QR Verification Card
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Services from "./pages/Services/Services";
import ServiceDetail from "./pages/Services/ServiceDetail";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Main Website Routes (Wrapped with Navbar & Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />

          {/* Redirect main /team to /about */}
          <Route path="team" element={<Navigate to="/about" replace />} />

          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          
          {/* Services Routes */}
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
        </Route>

        {/* Standalone Employee ID Verification Route (For Physical Card QR Code Scans) */}
        <Route path="/team/:employeeId" element={<TeamProfile />} />

        {/* Standalone Admin Route */}
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Analytics />
    </>
  );
}

export default App;