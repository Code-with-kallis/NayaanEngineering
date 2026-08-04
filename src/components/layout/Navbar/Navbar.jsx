import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import "./Navbar.css";
import logo from "/logo2.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 24);

      if (isOpen || currentScrollY <= 24) {
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

  return (
    <>
      <header
        className={`navbar ${!isVisible ? "navbar-hidden" : ""} ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logo} alt="Nayaab Engineering Logo" />
          </NavLink>

          <nav className={`navbar-links ${isOpen ? "active" : ""}`}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/team"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              Team
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={closeMenu}
            >
              Contact
            </NavLink>

            <a
              href="https://wa.me/919858765435"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-whatsapp-btn"
              onClick={closeMenu}
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
          </nav>

          <button
            className={`hamburger ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`navbar-overlay ${isOpen ? "active" : ""}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Navbar;