// src/components/common/ContactForm/ContactForm.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";
import styles from "./ContactForm.module.css";
import contactArt from "../../../assets/images/contact/form.png";
import { supabase } from "../../../lib/supabaseClient";

const serviceOptions = [
  "Architectural Design",
  "Structural Engineering",
  "Construction Management",
  "Engineering Consultancy",
  "Project Planning",
  "Turnkey Solutions",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS = 2;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 Hours
const RATE_LIMIT_STORAGE_KEY = "ne_contact_submissions";

export default function ContactForm({
  title = "Tell Us About Your Project",
  subtitle = "Tell us about your project, and a member of our engineering team will get in touch with you shortly.",
  eyebrow = "LET’S CONNECT",
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceOptions[0],
    message: "",
    botcheck: false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  // Handle outside clicks to auto-close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getRecentSubmissions = () => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      if (!stored) return [];
      const timestamps = JSON.parse(stored);
      const now = Date.now();
      return timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
    } catch {
      return [];
    }
  };

  const recordSubmission = () => {
    try {
      const recent = getRecentSubmissions();
      recent.push(Date.now());
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // Ignore storage write errors in private mode
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let finalVal = type === "checkbox" ? checked : value;
    if (name === "message" && typeof finalVal === "string" && finalVal.length > 900) {
      finalVal = finalVal.slice(0, 900);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalVal,
    }));
  };

  const handleServiceSelect = (service) => {
    setFormData((prev) => ({ ...prev, service }));
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      return "Please enter your name.";
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }
    if (!trimmedMessage) {
      return "Please type your message.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.botcheck) {
      setStatus({
        submitting: false,
        success: true,
        error: false,
        message: "Thank you! Your message has been received.",
      });
      return;
    }

    const recentSubmissions = getRecentSubmissions();
    if (recentSubmissions.length >= MAX_SUBMISSIONS) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message:
          "Daily limit reached (maximum 2 submissions per 24 hours). Please contact us directly via WhatsApp.",
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: validationError,
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: false, message: "" });

    try {
      // 1. Store submission in Supabase inquiries table for Admin dashboard
      try {
        await supabase.from("inquiries").insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            service: formData.service,
            message: formData.message.trim(),
            status: "unread",
          },
        ]);
      } catch (dbErr) {
        console.error("Inquiry database insert error:", dbErr);
      }

      // 2. Dispatch Dual Email Notification via Resend (To Admin + Client Confirmation)
      const resendResponse = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || "Not Provided",
          service: formData.service,
          message: formData.message.trim(),
          botcheck: formData.botcheck,
        }),
      });

      if (!resendResponse.ok) {
        console.warn("Resend API response status:", resendResponse.status);
      }

      recordSubmission();
      setStatus({
        submitting: false,
        success: true,
        error: false,
        message: "Thank you! Your message has been sent successfully. A confirmation email has been dispatched to your inbox.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: serviceOptions[0],
        message: "",
        botcheck: false,
      });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: err.message || "Failed to submit. Please check your connection.",
      });
    }
  };

  const openWhatsApp = () => {
    if (!formData.name.trim() || !formData.message.trim()) return;
    const inquiryBody = [
      "Hello Nayaab Engineering Team,",
      "",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim() || "-"}`,
      `Phone: ${formData.phone.trim() || "-"}`,
      `Service: ${formData.service}`,
      "",
      "Project Details:",
      formData.message.trim(),
    ].join("\n");

    window.open(
      `https://wa.me/919858765435?text=${encodeURIComponent(inquiryBody)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className={styles.sectionOuter} aria-label="Contact Form Section">
      <div className={styles.formCardContainer}>
        {/* Main Column */}
        <div className={styles.formCol}>
          {/* Header Title & Subtitle */}
          <div className={styles.headerArea}>
            {eyebrow && <span className={styles.pillBadge}>{eyebrow}</span>}
            
            <h2 className={styles.title}>
              <span className={styles.titleIconBox} aria-hidden="true">
                <FaPhoneAlt />
              </span>
              <span>{title}</span>
            </h2>

            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {/* Mobile & Tablet Image Banner */}
          <div className={styles.mobileArtCol}>
            <img
              src={contactArt}
              alt="Engineering Consulting & Architecture"
              className={styles.mobileArtImg}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.mobileArtFooter}>
              <strong>Direct Engineering Consultancy</strong>
              <p>Turnkey civil construction &amp; architectural design across Kashmir</p>
            </div>
          </div>

          {/* Form */}
          <form
            className={styles.contactForm}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Honeypot Spam Guard */}
            <input
              type="checkbox"
              name="botcheck"
              className={styles.honeypot}
              onChange={handleInputChange}
              checked={formData.botcheck}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="form-name">Name *</label>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="form-email">Email *</label>
                <input
                  type="email"
                  id="form-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="form-phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="form-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                />
              </div>

              {/* Custom Animated Service Dropdown */}
              <div className={styles.field} ref={dropdownRef}>
                <label id="service-label">Topic / Service</label>
                <div className={styles.customSelectWrapper}>
                  <button
                    type="button"
                    className={`${styles.selectTrigger} ${
                      isDropdownOpen ? styles.selectTriggerActive : ""
                    }`}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-labelledby="service-label"
                  >
                    <span className={styles.selectedOptionText}>
                      {formData.service}
                    </span>
                    <FaChevronDown
                      className={`${styles.chevronIcon} ${
                        isDropdownOpen ? styles.chevronRotated : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <ul
                      className={styles.selectMenu}
                      role="listbox"
                      aria-labelledby="service-label"
                    >
                      {serviceOptions.map((service) => {
                        const isSelected = formData.service === service;
                        return (
                          <li
                            key={service}
                            role="option"
                            aria-selected={isSelected}
                            className={`${styles.selectOption} ${
                              isSelected ? styles.selectOptionActive : ""
                            }`}
                            onClick={() => handleServiceSelect(service)}
                          >
                            <span>{service}</span>
                            {isSelected && (
                              <FaCheck className={styles.optionCheck} />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="form-message">Your Message *</label>
              <textarea
                id="form-message"
                name="message"
                required
                rows="4"
                maxLength={900}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your project scope or requirements..."
              />
              <div className={styles.charCounter}>
                {formData.message.length} / 900 characters
              </div>
            </div>

            {/* Status Notifications */}
            {status.success && (
              <div className={styles.successBanner} role="alert">
                <FaCheckCircle className={styles.statusIcon} />
                <span>{status.message}</span>
              </div>
            )}

            {status.error && (
              <div className={styles.errorBanner} role="alert">
                <FaExclamationCircle className={styles.statusIcon} />
                <span>{status.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionFooter}>
              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status.submitting}
                  aria-busy={status.submitting}
                >
                  <FaPaperPlane className={styles.btnIcon} />
                  <span>{status.submitting ? "Sending..." : "Submit Inquiry"}</span>
                </button>

                <button
                  type="button"
                  className={styles.whatsappBtn}
                  onClick={openWhatsApp}
                  disabled={!formData.name.trim() || !formData.message.trim()}
                  aria-label="Send inquiry via WhatsApp"
                >
                  <FaWhatsapp className={styles.waIcon} />
                  <span>Send to WhatsApp</span>
                </button>
              </div>

              <div className={styles.socialFollow}>
                <span>Follow Us</span>
                <div className={styles.socialIcons}>
                  <a
                    href="https://www.facebook.com/nayaabengineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://www.instagram.com/nayaabengineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Desktop Illustration Stage */}
        <div className={styles.desktopArtCol}>
          <div className={styles.artWrapper}>
            <img
              src={contactArt}
              alt="Engineering Consulting & Architecture"
              className={styles.artImg}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.artCardFooter}>
              <strong>Direct Engineering Consultancy</strong>
              <p>Turnkey civil construction &amp; architectural design across Kashmir</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}