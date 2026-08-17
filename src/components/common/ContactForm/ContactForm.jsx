import React, { useState } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
} from "react-icons/fa";
import styles from "./ContactForm.module.css";
import contactArt from "../../../assets/images/contact/form.png";

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
  accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
  title = "Send a Project Brief",
  subtitle = "Fill out the form below with your project requirements and our team will get back to you with an initial assessment.",
  eyebrow = "Direct Inquiry",
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceOptions[0],
    message: "",
    botcheck: false,
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (!accessKey) {
      return "Contact service is temporarily unavailable. Please reach us via WhatsApp.";
    }
    return null;
  };

  const handleDirectWeb3Submit = async (e) => {
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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "Nayaab Engineering Website",
          subject: `New Inquiry: ${formData.service} - ${formData.name.trim()}`,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || "Not Provided",
          service: formData.service,
          message: formData.message.trim(),
          botcheck: formData.botcheck,
        }),
      });

      const result = await response.json();

      if (result.success) {
        recordSubmission();
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Thank you! Your message has been sent successfully. We will get back to you shortly.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: serviceOptions[0],
          message: "",
          botcheck: false,
        });
      } else {
        throw new Error(result.message || "Submission failed. Please try again.");
      }
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
        {/* Left Column: Form Stage */}
        <div className={styles.formCol}>
          <div className={styles.headerArea}>
            {eyebrow && <span className={styles.pillBadge}>{eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <form
            className={styles.contactForm}
            onSubmit={handleDirectWeb3Submit}
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
                  placeholder="Your name"
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

              <div className={styles.field}>
                <label htmlFor="form-service">Topic / Service</label>
                <select
                  id="form-service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="form-message">Your Message *</label>
              <textarea
                id="form-message"
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..."
              />
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

            {/* Action Bar */}
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

        {/* Right Column: Decorative Illustration Stage (Visible on Both Desktop & Mobile) */}
        <div className={styles.artCol}>
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