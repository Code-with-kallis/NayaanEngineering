import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PageLoader from "../../common/PageLoader";

export default function Layout() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Pages where Navbar and Footer should not appear
  const hideNavbarAndFooter = ["/admin", "/terms", "/privacy"].some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    // Only trigger if the pathname actually changed to a new page
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsNavigating(true);

      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {isNavigating && <PageLoader />}
      {!hideNavbarAndFooter && <Navbar />}
      <main id="main">
        <Outlet />
      </main>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}