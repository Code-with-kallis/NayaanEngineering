import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PageLoader from "../../common/PageLoader";

export default function Layout() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(location.pathname);

  const hideNavbarAndFooter = ["/admin", "/terms", "/privacy"].some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsNavigating(true);

      // Smooth navigation transition time
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 600);

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