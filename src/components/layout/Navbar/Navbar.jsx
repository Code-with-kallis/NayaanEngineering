import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./Navbar.module.css";
import logo from "/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const isHomePage = pathname === "/";
  const isTeamPage = pathname === "/team";
  const isHeroPage = isHomePage || isTeamPage;

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
    NAV_LINKS.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `${isActive ? styles.activeLink : ""}`.trim()
        }
        onClick={closeMenu}
      >
        {label}
      </NavLink>
    ));

  return (
    <>
      <header
        className={`${styles.navbar} ${isHeroPage ? styles.navbarTransparent : ""} ${
          !isVisible ? styles.navbarHidden : ""
        } ${scrolled ? styles.navbarScrolled : ""}`.trim()}
      >
        <div className={styles.navbarContainer}>
          <NavLink to="/" className={styles.navbarLogo} onClick={closeMenu}>
            <img src={logo} alt="Nayaab Engineering Logo" />
          </NavLink>

          <nav className={styles.navbarLinksDesktop} aria-label="Primary navigation">
            {renderNavLinks()}
          </nav>

          <div className={styles.navbarActions}>
            <a
              href="https://wa.me/919858765435"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.navbarWhatsappBtn} ${styles.navbarWhatsappDesktop}`}
              onClick={closeMenu}
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>

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

      {/* Light Studio Mobile Drawer Panel */}
      <nav
        id="navbar-mobile-panel"
        className={`${styles.navbarMobilePanel} ${isOpen ? styles.active : ""}`}
        aria-label="Mobile navigation"
      >
        <div className={styles.navbarMobileHeader}>
          <img src={logo} alt="Nayaab Engineering Logo" className={styles.mobileLogo} />
        </div>

        <div className={styles.navbarMobileLinks}>{renderNavLinks()}</div>

        <a
          href="https://wa.me/919858765435"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navbarWhatsappMobile}
          onClick={closeMenu}
        >
          <FaWhatsapp />
          <span>WhatsApp</span>
        </a>
      </nav>

      <div
        className={`${styles.navbarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Navbar;