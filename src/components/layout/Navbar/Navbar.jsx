// src/components/layout/Navbar/Navbar.jsx

import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import "./Navbar.css";
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

  // Transparent dark hero applies ONLY to Home ("/") and Main Team Roster ("/team")
  // Profiles like "/team/neipl-0101" will now have a solid clean studio navbar
  const isHomePage = pathname === "/";
  const isTeamPage = pathname === "/team";
  const isHeroPage = isHomePage || isTeamPage;

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Close mobile drawer automatically on page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", isOpen);
    document.documentElement.classList.toggle("nav-menu-open", isOpen);

    return () => {
      document.body.classList.remove("nav-menu-open");
      document.documentElement.classList.remove("nav-menu-open");
    };
  }, [isOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Scroll visibility and scroll state handler
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

  const renderNavLinks = (className = "") =>
    NAV_LINKS.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `${className} ${isActive ? "active-link" : ""}`.trim()
        }
        onClick={closeMenu}
      >
        {label}
      </NavLink>
    ));

  return (
    <>
      <header
        className={`navbar ${isHeroPage ? "navbar-transparent" : ""} ${
          !isVisible ? "navbar-hidden" : ""
        } ${scrolled ? "navbar-scrolled" : ""}`.trim()}
      >
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logo} alt="Nayaab Engineering Logo" />
          </NavLink>

          <nav className="navbar-links-desktop" aria-label="Primary navigation">
            {renderNavLinks()}
          </nav>

          <div className="navbar-actions">
            <a
              href="https://wa.me/919858765435"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-whatsapp-btn navbar-whatsapp-desktop"
              onClick={closeMenu}
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>

            <button
              className={`hamburger ${isOpen ? "open" : ""}`}
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

      {/* Mobile Drawer Navigation Panel */}
      <nav
        id="navbar-mobile-panel"
        className={`navbar-mobile-panel ${isOpen ? "active" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="navbar-mobile-links">{renderNavLinks()}</div>

        <a
          href="https://wa.me/919858765435"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-whatsapp-mobile"
          onClick={closeMenu}
        >
          <FaWhatsapp />
          <span>WhatsApp</span>
        </a>
      </nav>

      {/* Background Overlay */}
      <div
        className={`navbar-overlay ${isOpen ? "active" : ""}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Navbar;