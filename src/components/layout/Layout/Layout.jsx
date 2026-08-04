// src/components/layout/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;