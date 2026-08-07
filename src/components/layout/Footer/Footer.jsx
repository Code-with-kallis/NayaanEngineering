import styles from "./Footer.module.css";
import logo from "/logo.png";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaArrowUp,
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
      <div className={styles.footerOverlay} />
      <div className={styles.footerContainer}>
        <div className={`${styles.footerColumn} ${styles.companyColumn}`}>
          <div className={styles.logoWrapper}>
            <img src={logo} alt="Nayaab Engineering" className={styles.footerLogo} />
          </div>

          <p className={styles.companyDescription}>
            Nayaab Engineering Innovations Pvt. Ltd. is committed to delivering
            innovative engineering, architecture, interior design, and
            construction solutions across residential, commercial, and public
            infrastructure projects.
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

        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Contact</h3>

          <ul className={styles.contactList}>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>
                3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar,
                Baramulla, Jammu &amp; Kashmir - 193101
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

      <div className={styles.footerBottom}>
        <p>&copy; {year} Nayaab Engineering Innovations Pvt. Ltd.</p>
        <span className={styles.devBadge}>Website Under Development</span>
        <p>
          Designed &amp; Developed by{" "}
          <a href="https://www.kallis.in" target="_blank" rel="noopener noreferrer">
            Kallis
          </a>
        </p>
      </div>

      <button className={styles.scrollTop} onClick={scrollTop} aria-label="Scroll to top">
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;