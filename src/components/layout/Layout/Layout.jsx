// src/components/layout/Layout/Layout.jsx
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const HIDDEN_ROUTES = ["/admin", "/terms", "/privacy", "/team"];

export default function Layout() {
  const { pathname } = useLocation();

  const isHidden = useMemo(
    () =>
      HIDDEN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      ),
    [pathname]
  );

  return (
    <>
      {!isHidden && <Navbar />}
      <main id="main" role="main" aria-label="Main content">
        <Outlet />
      </main>
      {!isHidden && <Footer />}
    </>
  );
}