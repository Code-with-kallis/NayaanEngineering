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
  const [mode, setMode] = useState("subscribe"); // "subscribe" | "unsubscribe"
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || submitting) return;

    setSubmitting(true);
    setStatus({ success: false, error: false, message: "" });

    const isUnsub = mode === "unsubscribe";

    try {
      // 1. Dispatch API call to /api/subscribe
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          action: isUnsub ? "unsubscribe" : "subscribe",
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (_) {}

      if (response.ok && result.success !== false) {
        if (isUnsub) {
          localStorage.removeItem("nei_newsletter_subscribed");
          setAlreadySubscribed(false);
          setStatus({
            success: true,
            error: false,
            message: "You have been successfully unsubscribed from our newsletter.",
          });
        } else {
          localStorage.setItem("nei_newsletter_subscribed", "true");
          setAlreadySubscribed(true);
          setStatus({
            success: true,
            error: false,
            message: "Thank you for subscribing! A welcome confirmation has been sent to your inbox.",
          });
        }
        setEmail("");
      } else {
        throw new Error(result.error || "Request failed. Please try again.");
      }
    } catch (err) {
      // Fallback: register directly to Supabase inquiries table
      try {
        await supabase.from("inquiries").insert([
          {
            name: isUnsub ? "Unsubscribed User" : "Newsletter Subscriber",
            email: cleanEmail,
            service: isUnsub ? "Newsletter Unsubscribe" : "Newsletter Subscription",
            message: isUnsub
              ? "User unsubscribed via website footer."
              : "Subscriber registered via website footer.",
            status: "unread",
          },
        ]);
        if (isUnsub) {
          localStorage.removeItem("nei_newsletter_subscribed");
          setAlreadySubscribed(false);
          setStatus({
            success: true,
            error: false,
            message: "You have been successfully unsubscribed.",
          });
        } else {
          localStorage.setItem("nei_newsletter_subscribed", "true");
          setAlreadySubscribed(true);
          setStatus({
            success: true,
            error: false,
            message: "Thank you for subscribing! We have registered your subscription.",
          });
        }
        setEmail("");
        return;
      } catch (_) {}

      setStatus({
        success: false,
        error: true,
        message: err.message || "Operation failed. Please check your connection.",
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
          <h3 className={styles.columnTitle}>
            {mode === "unsubscribe" ? "Unsubscribe from Updates" : "Subscribe for Updates"}
          </h3>
          <p className={styles.newsletterText}>
            {mode === "unsubscribe"
              ? "Enter your email address below to remove yourself from our newsletter list."
              : "Subscribe to get the latest project releases and architectural insights."}
          </p>

          {alreadySubscribed && mode !== "unsubscribe" ? (
            <div className={styles.subscribedBadgeBox}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaCheckCircle className={styles.subscribedCheckIcon} />
                <span>Subscribed</span>
              </div>
              <button
                type="button"
                className={styles.unsubToggleLink}
                onClick={() => {
                  setMode("unsubscribe");
                  setStatus({ success: false, error: false, message: "" });
                }}
              >
                Unsubscribe?
              </button>
            </div>
          ) : (
            <form className={styles.subscribeForm} onSubmit={handleNewsletterSubmit}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder={
                    mode === "unsubscribe"
                      ? "Enter email to unsubscribe"
                      : "Enter your email address"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className={styles.subscribeInput}
                />
                <button
                  type="submit"
                  className={mode === "unsubscribe" ? styles.unsubscribeButton : styles.subscribeButton}
                  aria-label={mode === "unsubscribe" ? "Unsubscribe" : "Subscribe"}
                  disabled={submitting}
                  title={mode === "unsubscribe" ? "Unsubscribe" : "Subscribe"}
                >
                  {submitting ? (
                    <FaSpinner className={styles.spinnerIcon} />
                  ) : mode === "unsubscribe" ? (
                    <span style={{ fontWeight: 900, fontSize: "0.9rem" }}>✕</span>
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
              {status.success && (
                <div className={styles.successMessage}>
                  <FaCheckCircle />
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          )}

          <div className={styles.unsubRow}>
            {mode === "unsubscribe" ? (
              <button
                type="button"
                className={styles.resubToggleLink}
                onClick={() => {
                  setMode("subscribe");
                  setStatus({ success: false, error: false, message: "" });
                }}
              >
                &larr; Back to Subscribe
              </button>
            ) : (
              <button
                type="button"
                className={styles.unsubToggleLink}
                onClick={() => {
                  setMode("unsubscribe");
                  setStatus({ success: false, error: false, message: "" });
                }}
              >
                Need to unsubscribe?
              </button>
            )}
          </div>
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