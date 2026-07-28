import "./Footer.css";
import logo from "/logo2.png";

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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column company">
          <img src={logo} alt="Nayaab Engineering" className="footer-logo" />

          <p>
            Nayaab Engineering Innovations Pvt. Ltd. is committed to delivering
            innovative engineering, architecture, interior design, and
            construction solutions across residential, commercial, and public
            infrastructure projects.
          </p>

          <div className="social-icons">
            <a
              href="https://www.facebook.com/nayaabengineering/"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/nayaabengineering/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

            <a href="mailto:info@nayaabengineering.com">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>

          <ul>
            <li>
              <FaMapMarkerAlt />
              3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar,
              Baramulla, Jammu & Kashmir - 193101
            </li>

            <li>
              <FaPhoneAlt />
              <a href="tel:+911952455465">+91 1952-455465</a>
            </li>

            <li>
              <FaEnvelope />
              <a href="mailto:info@nayaabengineering.com">
                info@nayaabengineering.com
              </a>
            </li>

            <li>
              <FaWhatsapp />
              <a
                href="https://wa.me/919858765435"
                target="_blank"
                rel="noreferrer"
              >
                +91 98587 65435
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright {year} Nayaab Engineering Innovations Pvt. Ltd.</p>
        <p>Website Under Development</p>
        <p>
          Designed &amp; Developed by{" "}
          <a href="https://www.kallis.in" target="_blank" rel="noreferrer">
            Kallis
          </a>
        </p>
      </div>

      <button className="scroll-top" onClick={scrollTop}>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
