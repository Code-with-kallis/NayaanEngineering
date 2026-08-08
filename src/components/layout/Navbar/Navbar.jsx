import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./Navbar.module.css";
import logo from "/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: FaHome, end: true },
  { to: "/projects", label: "Projects", icon: FaBuilding },
  { to: "/team", label: "Team", icon: FaUsers },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Pages with Dark Video/Image Hero backgrounds
  const isDarkHero = pathname === "/" || pathname === "/team";
  
  // Pages with Light/White Hero backgrounds
  const isLightHero = pathname === "/projects" || pathname === "/contact";

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", isOpen);
    document.documentElement.classList.toggle("nav-menu-open", isOpen);

    return () => {
      document.body.classList.remove("nav-menu-open");
      document.documentElement.classList.remove("nav-menu-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (isOpen || currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const renderNavLinks = () =>
    NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
        }
        onClick={closeMenu}
      >
        <Icon className={styles.navIcon} aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ));

  return (
    <>
      <header
        className={`${styles.navbar} ${
          isDarkHero ? styles.navbarDarkHero : ""
        } ${isLightHero ? styles.navbarLightHero : ""} ${
          !isVisible ? styles.navbarHidden : ""
        } ${scrolled ? styles.navbarScrolled : ""}`.trim()}
      >
        <div className={styles.navbarContainer}>
          <NavLink to="/" className={styles.navbarLogo} onClick={closeMenu}>
            <img src={logo} alt="Nayaab Engineering Logo" />
          </NavLink>

          <nav
            className={styles.navbarLinksDesktop}
            aria-label="Primary navigation"
          >
            {renderNavLinks()}
          </nav>

          <div className={styles.navbarActions}>
            <NavLink
              to="/contact"
              className={`${styles.navbarContactBtn} ${styles.navbarContactDesktop}`}
              onClick={closeMenu}
            >
              <FaEnvelope aria-hidden="true" />
              <span>Contact</span>
            </NavLink>

            <button
              className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="navbar-mobile-panel"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Premium Mobile Drawer Panel */}
      <nav
        id="navbar-mobile-panel"
        className={`${styles.navbarMobilePanel} ${
          isOpen ? styles.active : ""
        }`}
        aria-label="Mobile navigation"
      >
        <div className={styles.navbarMobileHeader}>
          <img
            src={logo}
            alt="Nayaab Engineering Logo"
            className={styles.mobileLogo}
          />
        </div>

        <div className={styles.navbarMobileLinks}>{renderNavLinks()}</div>

        <div className={styles.mobileFooterArea}>
          <NavLink
            to="/contact"
            className={styles.navbarContactMobile}
            onClick={closeMenu}
          >
            <span>Get in Touch</span>
            <FaArrowRight aria-hidden="true" />
          </NavLink>
        </div>
      </nav>

      <div
        className={`${styles.navbarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Navbar;