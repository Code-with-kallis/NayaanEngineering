import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logoBg from "/assets/footer/logo-bg.png"; // Single unified logo badge

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaArrowUp,
  FaChevronRight,
  FaBuilding,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footer}>
      {/* Main Footer Container */}
      <div className={styles.footerContainer}>
        {/* Column 1: Company Profile with Single Merged Logo Image */}
        <div className={`${styles.footerColumn} ${styles.companyColumn}`}>
          <div className={styles.logoWrapper}>
            <img
              src={logoBg}
              alt="Nayaab Engineering Innovations"
              className={styles.footerLogo}
            />
          </div>

          <p className={styles.companyDescription}>
            Nayaab Engineering Innovations Pvt. Ltd. is committed to delivering
            innovative engineering, architectural planning, interior design, and
            turnkey construction solutions across residential and commercial
            developments.
          </p>

          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com/nayaabengineering/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/nayaabengineering/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a href="mailto:info@nayaabengineering.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className={`${styles.footerColumn} ${styles.linksColumn}`}>
          <h3 className={styles.columnTitle}>Quick Links</h3>
          <ul className={styles.navLinksList}>
            <li>
              <Link to="/" onClick={scrollTop}>
                <FaChevronRight className={styles.linkChevron} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={scrollTop}>
                <FaChevronRight className={styles.linkChevron} />
                <span>Our Services</span>
              </Link>
            </li>
            <li>
              <Link to="/projects" onClick={scrollTop}>
                <FaChevronRight className={styles.linkChevron} />
                <span>Featured Projects</span>
              </Link>
            </li>
            <li>
              <Link to="/team" onClick={scrollTop}>
                <FaChevronRight className={styles.linkChevron} />
                <span>Our Team</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollTop}>
                <FaChevronRight className={styles.linkChevron} />
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Get In Touch */}
        <div className={`${styles.footerColumn} ${styles.contactColumn}`}>
          <h3 className={styles.columnTitle}>Get In Touch</h3>

          <ul className={styles.contactList}>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>
                3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar,
                Baramulla, J&amp;K - 193101
              </span>
            </li>

            <li>
              <FaPhoneAlt className={styles.contactIcon} />
              <a href="tel:+911952455465">+91 1952-455465</a>
            </li>

            <li>
              <FaEnvelope className={styles.contactIcon} />
              <a href="mailto:info@nayaabengineering.com">
                info@nayaabengineering.com
              </a>
            </li>

            <li>
              <FaWhatsapp className={styles.contactIcon} />
              <a
                href="https://wa.me/919858765435"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 98587 65435
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Solid Black Bottom Bar */}
      <div className={styles.footerBottomBar}>
        <div className={styles.bottomContent}>
          <p className={styles.copyrightText}>
            &copy; {year} Nayaab Engineering Innovations Pvt. Ltd. All rights reserved.
          </p>

          <span className={styles.devBadge}>
            <FaBuilding className={styles.badgeIcon} /> Registered Private Limited
          </span>

          <p className={styles.devCredit}>
            Designed &amp; Developed by{" "}
            <a
              href="https://www.kallis.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kallis
            </a>
          </p>
        </div>
      </div>

      <button
        className={styles.scrollTop}
        onClick={scrollTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;