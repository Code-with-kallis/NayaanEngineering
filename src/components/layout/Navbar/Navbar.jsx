import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import useScrollLock from "../../../hooks/useScrollLock";
import ContactModal from "../../common/ContactModal/ContactModal";
import menuBarIcon from "../../../assets/images/navbar/menu-bar.png";
import styles from "./Navbar.module.css";
import logo from "/logo-original.png";

const SERVICES_DROPDOWN = [
  { to: "/services/architectural-design", label: "Architectural Design" },
  { to: "/services/structural-engineering", label: "Structural Engineering" },
  { to: "/services/turnkey-construction", label: "Turnkey Construction" },
  { to: "/services/interior-modular-design", label: "Interior & Modular Design" },
  { to: "/services/regulatory-approvals", label: "Regulatory Approvals" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  
  // Mobile dropdown closed by default
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  
  // 1. Initialize modal state directly from URL hash
  const [modalOpen, setModalOpen] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#contact-form"
  );
  
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  // Lock scrolling when mobile drawer is open
  useScrollLock(isOpen);

  // 2. Global Hash Listener for direct URL visits and hash changes
  useEffect(() => {
    const handleHashSync = () => {
      if (window.location.hash === "#contact-form") {
        setModalOpen(true);
      } else {
        setModalOpen(false);
      }
    };

    // Check on initial load/route mount
    if (window.location.hash === "#contact-form") {
      setModalOpen(true);
    }

    window.addEventListener("hashchange", handleHashSync);
    window.addEventListener("popstate", handleHashSync);

    return () => {
      window.removeEventListener("hashchange", handleHashSync);
      window.removeEventListener("popstate", handleHashSync);
    };
  }, []);

  const isLightHero =
    pathname === "/" ||
    pathname === "/services" ||
    pathname === "/about" ||
    pathname === "/projects" ||
    pathname === "/contact" ||
    pathname.startsWith("/services/");

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  };

  const openConsultModal = () => {
    closeMenu();
    setModalOpen(true);
  };

  // Close drawer and reset mobile dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isScrolledNow = currentScrollY > 20;

        setScrolled((prev) => (prev !== isScrolledNow ? isScrolledNow : prev));

        if (isOpen || currentScrollY <= 20) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current + 6) {
          setIsVisible(false);
          setServicesDropdownOpen(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const isServicesActive = pathname.startsWith("/services");

  return (
    <>
      <header
        className={`${styles.navbar} ${
          isLightHero ? styles.navbarLightHero : ""
        } ${!isVisible ? styles.navbarHidden : ""} ${
          scrolled ? styles.navbarScrolled : ""
        }`.trim()}
      >
        <div className={styles.navbarContainer}>
          <NavLink to="/" className={styles.navbarLogo} onClick={closeMenu}>
            <img src={logo} alt="Nayaab Engineering Logo" />
          </NavLink>

          {/* ================= DESKTOP NAV TABS ================= */}
          <nav
            className={styles.navbarLinksDesktop}
            aria-label="Primary navigation"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <FaHome className={styles.navIcon} aria-hidden="true" />
              <span>Home</span>
            </NavLink>

            <div
              className={styles.dropdownContainer}
              ref={dropdownRef}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <NavLink
                to="/services"
                className={`${styles.navItem} ${
                  isServicesActive ? styles.activeLink : ""
                }`.trim()}
              >
                <FaTools className={styles.navIcon} aria-hidden="true" />
                <span>Services</span>
                <FaChevronDown
                  className={`${styles.chevronIcon} ${
                    servicesDropdownOpen ? styles.chevronRotated : ""
                  }`}
                  aria-hidden="true"
                />
              </NavLink>

              <div
                className={`${styles.dropdownMenu} ${
                  servicesDropdownOpen ? styles.dropdownOpen : ""
                }`}
              >
                {SERVICES_DROPDOWN.map((service) => (
                  <NavLink
                    key={service.to}
                    to={service.to}
                    className={({ isActive }) =>
                      `${styles.dropdownItem} ${
                        isActive ? styles.activeDropdownItem : ""
                      }`.trim()
                    }
                    onClick={closeMenu}
                  >
                    <span>{service.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <FaBuilding className={styles.navIcon} aria-hidden="true" />
              <span>Projects</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <FaUsers className={styles.navIcon} aria-hidden="true" />
              <span>About</span>
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <FaEnvelope className={styles.navIcon} aria-hidden="true" />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* ================= DESKTOP ACTION ================= */}
          <div className={styles.navbarActions}>
            <button
              type="button"
              className={`${styles.navbarContactBtn} ${styles.navbarContactDesktop}`}
              onClick={openConsultModal}
            >
              <FaPhoneAlt aria-hidden="true" />
              <span>Get a Quote</span>
            </button>

            {/* Mobile Toggle Button */}
            <button
              className={`${styles.menuToggleBtn} ${isOpen ? styles.menuOpen : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="navbar-mobile-panel"
            >
              <img
                src={menuBarIcon}
                alt="Menu Icon"
                className={styles.menuIconImg}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= DARK LUXURY MOBILE DRAWER PANEL ================= */}
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
          <button
            className={styles.mobileCloseBtn}
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Top Quick CTA */}
        <div className={styles.mobileTopCtaWrapper}>
          <button
            type="button"
            className={styles.mobileTopCtaBtn}
            onClick={openConsultModal}
          >
            <div className={styles.mobileTopCtaText}>
              <span className={styles.ctaBadge}>Quick Inquiry</span>
              <span className={styles.ctaTitle}>Get a Quote</span>
            </div>
            <div className={styles.ctaIconCircle}>
              <FaArrowRight aria-hidden="true" />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className={styles.navbarMobileLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
            }
            onClick={closeMenu}
          >
            <FaHome className={styles.navIcon} aria-hidden="true" />
            <span>Home</span>
          </NavLink>

          {/* Accordion (Closed by default) */}
          <div className={styles.mobileServicesWrapper}>
            <div className={styles.mobileServicesHeader}>
              <NavLink
                to="/services"
                className={`${styles.navItem} ${
                  isServicesActive ? styles.activeLink : ""
                }`.trim()}
                onClick={closeMenu}
              >
                <FaTools className={styles.navIcon} aria-hidden="true" />
                <span>Services</span>
              </NavLink>
              <button
                type="button"
                className={styles.mobileExpandBtn}
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                aria-label="Toggle services submenu"
                aria-expanded={mobileServicesOpen}
              >
                <FaChevronDown
                  className={`${styles.chevronIcon} ${
                    mobileServicesOpen ? styles.chevronRotated : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`${styles.mobileSubMenu} ${
                mobileServicesOpen ? styles.mobileSubMenuOpen : ""
              }`}
            >
              {SERVICES_DROPDOWN.map((service) => (
                <NavLink
                  key={service.to}
                  to={service.to}
                  className={({ isActive }) =>
                    `${styles.mobileSubItem} ${
                      isActive ? styles.mobileSubActive : ""
                    }`.trim()
                  }
                  onClick={closeMenu}
                >
                  <span>{service.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
            }
            onClick={closeMenu}
          >
            <FaBuilding className={styles.navIcon} aria-hidden="true" />
            <span>Projects</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
            }
            onClick={closeMenu}
          >
            <FaUsers className={styles.navIcon} aria-hidden="true" />
            <span>About</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
            }
            onClick={closeMenu}
          >
            <FaEnvelope className={styles.navIcon} aria-hidden="true" />
            <span>Contact</span>
          </NavLink>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`${styles.navbarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={closeMenu}
      />

      {/* Global Consultation Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Navbar;