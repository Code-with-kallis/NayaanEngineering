// src/App.jsx

import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Team from "./pages/Team/Team";
import TeamProfile from "./pages/Team/TeamProfile";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";

import Services from "./pages/Services/Services";
import ServiceDetail from "./pages/Services/ServiceDetail";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="team" element={<Team />} />
          <Route path="team/:employeeId" element={<TeamProfile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          
          {/* Services Routes */}
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;