import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Team from "./pages/Team/Team";
import TeamProfile from "./pages/Team/TeamProfile";

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
        </Route>
      </Routes>
    </>
  );
}

export default App;