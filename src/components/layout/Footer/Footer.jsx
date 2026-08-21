// src/components/layout/Footer/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logoBg from "/assets/footer/logo-bg.png";
import { supabase } from "../../../lib/supabaseClient";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaChevronRight,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [status, setStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    const isSubbed = localStorage.getItem("nei_newsletter_subscribed");
    if (isSubbed === "true") {
      setAlreadySubscribed(true);
    }
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || submitting || alreadySubscribed) return;

    setSubmitting(true);
    setStatus({ success: false, error: false, message: "" });

    try {
      // 1. Dispatch Dual Email via /api/subscribe
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (_) {
        // Fallback for non-JSON text responses
      }

      if (response.ok && (result.success !== false)) {
        localStorage.setItem("nei_newsletter_subscribed", "true");
        setAlreadySubscribed(true);
        setStatus({
          success: true,
          error: false,
          message: "Thank you for subscribing! A welcome confirmation has been sent to your inbox.",
        });
        setEmail("");
      } else {
        throw new Error(result.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      // Fallback: register directly to Supabase inquiries table if serverless API was unreachable
      try {
        await supabase.from("inquiries").insert([
          {
            name: "Newsletter Subscriber",
            email: email.trim(),
            service: "Newsletter Subscription",
            message: "Subscriber registered via website footer.",
            status: "unread",
          },
        ]);
        localStorage.setItem("nei_newsletter_subscribed", "true");
        setAlreadySubscribed(true);
        setStatus({
          success: true,
          error: false,
          message: "Thank you for subscribing! We have registered your subscription.",
        });
        setEmail("");
        return;
      } catch (_) {}

      setStatus({
        success: false,
        error: true,
        message: err.message || "Subscription failed. Please check your connection.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Bold Architectural Watermark */}
      <div className={styles.bgWatermarkText} aria-hidden="true">
        NAYAAB
      </div>

      {/* Main Footer 4-Column Grid Container */}
      <div className={styles.footerContainer}>
        {/* Column 1: Company Profile */}
        <div className={`${styles.footerColumn} ${styles.companyColumn}`}>
          <div className={styles.logoWrapper}>
            <img
              src={logoBg}
              alt="Nayaab Engineering Innovations"
              className={styles.footerLogo}
            />
          </div>

          <p className={styles.companyDescription}>
            Nayaab Engineering Innovations Pvt. Ltd. delivers innovative
            structural engineering, architectural planning, interior design,
            and turnkey construction solutions across Kashmir.
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

        {/* Column 4: Subscribe For Updates */}
        <div className={`${styles.footerColumn} ${styles.newsletterColumn}`}>
          <h3 className={styles.columnTitle}>Subscribe for Updates</h3>
          <p className={styles.newsletterText}>
            Subscribe to get the latest project releases and architectural insights.
          </p>

          {alreadySubscribed ? (
            <div className={styles.subscribedBadgeBox}>
              <FaCheckCircle className={styles.subscribedCheckIcon} />
              <span>Subscribed Successfully</span>
            </div>
          ) : (
            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className={styles.subscribeInput}
                />
                <button
                  type="submit"
                  className={styles.subscribeButton}
                  aria-label="Subscribe"
                  disabled={submitting}
                >
                  {submitting ? (
                    <FaSpinner className={styles.spinnerIcon} />
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>

              {status.error && (
                <div className={styles.errorMessage}>
                  <FaExclamationCircle />
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          )}

          <span className={styles.newsletterBadge}>
            🔒 Strictly no spam. Unsubscribe anytime.
          </span>
        </div>
      </div>

      {/* Solid Bottom Bar */}
      <div className={styles.footerBottomBar}>
        <div className={styles.bottomContent}>
          <p className={styles.copyrightText}>
            &copy; {year} Nayaab Engineering Innovations Pvt. Ltd. All rights reserved.
          </p>

          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <span className={styles.legalDivider}>•</span>
            <Link to="/terms" className={styles.legalLink}>
              Terms &amp; Conditions
            </Link>
          </div>

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
    </footer>
  );
};

export default Footer;