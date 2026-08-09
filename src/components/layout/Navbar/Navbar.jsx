import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  // Pages with Dark Video/Image Hero backgrounds
  const isDarkHero = pathname === "/" || pathname === "/team";
  
  // Pages with Light/White Hero backgrounds (includes /services & /services/:slug)
  const isLightHero =
    pathname === "/projects" ||
    pathname === "/contact" ||
    pathname.startsWith("/services");

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setMobileServicesOpen(true);
      }
      return nextState;
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(true);
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (isOpen || currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setIsVisible(false);
        setServicesDropdownOpen(false);
      } else if (currentScrollY < lastScrollY.current - 6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
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
              to="/team"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
              }
              onClick={closeMenu}
            >
              <FaUsers className={styles.navIcon} aria-hidden="true" />
              <span>Team</span>
            </NavLink>
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
                className={styles.mobileExpandBtn}
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                aria-label="Toggle services list"
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
            to="/team"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.activeLink : ""}`.trim()
            }
            onClick={closeMenu}
          >
            <FaUsers className={styles.navIcon} aria-hidden="true" />
            <span>Team</span>
          </NavLink>
        </div>

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