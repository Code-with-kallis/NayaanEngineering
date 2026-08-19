// src/components/layout/Layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const HIDDEN_ROUTES = ["/admin", "/terms", "/privacy", "/team"];

export default function Layout() {
  const { pathname } = useLocation();

  const isHidden = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!isHidden && <Navbar />}
      <main id="main">
        <Outlet />
      </main>
      {!isHidden && <Footer />}
    </>
  );
}