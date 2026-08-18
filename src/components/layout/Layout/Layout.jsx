import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function Layout() {
  const location = useLocation();

  // Pages where Navbar and Footer should not appear
  const hideNavbarAndFooter = ["/admin", "/terms", "/privacy"].some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <main id="main">
        <Outlet />
      </main>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}