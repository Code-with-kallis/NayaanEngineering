import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  FaTimes, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaPaperPlane, 
  FaChevronDown, 
  FaCheck 
} from "react-icons/fa";
import useScrollLock from "../../../hooks/useScrollLock";
import { supabase } from "../../../lib/supabaseClient";
import styles from "./ContactModal.module.css";

const DEFAULT_SERVICE_OPTIONS = [
  "Architectural Design",
  "Structural Engineering",
  "Turnkey Construction",
  "Interior & Modular Design",
  "Regulatory Approvals",
  "Engineering Consultancy",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS = 2;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_STORAGE_KEY = "ne_contact_submissions";

export default function ContactModal({
  isOpen,
  onClose,
  initialService = DEFAULT_SERVICE_OPTIONS[0],
  title = "Request Consultation",
  subtitle = "Fill in your details below and a licensed engineer from our Baramulla studio will connect with you.",
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: initialService,
    message: "",
    botcheck: false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalCardRef = useRef(null);

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  // Ensure initialService is always present in dropdown options
  const serviceOptions = DEFAULT_SERVICE_OPTIONS.includes(initialService)
    ? DEFAULT_SERVICE_OPTIONS
    : [initialService, ...DEFAULT_SERVICE_OPTIONS];

  useScrollLock(isOpen);

  // Close handler that cleans up URL hash #contact-form
  const handleModalClose = useCallback(() => {
    if (window.location.hash === "#contact-form") {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    onClose();
  }, [onClose]);

  // Sync opening/closing with URL hash #contact-form
  useEffect(() => {
    if (isOpen) {
      if (window.location.hash !== "#contact-form") {
        window.history.pushState(null, "", "#contact-form");
      }
    } else {
      if (window.location.hash === "#contact-form") {
        window.history.pushState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  }, [isOpen]);

  // Handle browser Back / Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash !== "#contact-form" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [isOpen, onClose]);

  // Update selected discipline when initialService prop changes
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService, isOpen]);

  // Escape key & Dropdown click-outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleModalClose();
    };

    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, handleModalClose]);

  if (!isOpen) return null;

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
      // Ignore private mode write errors
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.botcheck) {
      setStatus({ submitting: false, success: true, error: false, message: "Inquiry received." });
      return;
    }

    if (getRecentSubmissions().length >= MAX_SUBMISSIONS) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Daily submission limit reached. Please connect directly via WhatsApp.",
      });
      return;
    }

    if (!formData.name.trim() || !EMAIL_REGEX.test(formData.email.trim()) || !formData.message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: "Please fill in all required fields with a valid email address.",
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
        message: "Thank you! Your consultation request has been submitted. A confirmation email has been sent to your inbox.",
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
        message: err.message || "Failed to submit. Please contact via WhatsApp.",
      });
    }
  };

  const openWhatsApp = () => {
    if (!formData.name.trim() || !formData.message.trim()) return;
    const body = [
      "Hello Nayaab Engineering Team,",
      "",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim() || "-"}`,
      `Phone: ${formData.phone.trim() || "-"}`,
      `Discipline: ${formData.service}`,
      "",
      "Project Details:",
      formData.message.trim(),
    ].join("\n");

    window.open(
      `https://wa.me/919858765435?text=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Mount directly to document.body using Portal to escape parent CSS transforms
  return createPortal(
    <div 
      className={styles.modalBackdrop} 
      onClick={handleModalClose} 
      role="dialog" 
      aria-modal="true"
      data-lenis-prevent="true"
    >
      <div 
        ref={modalCardRef}
        className={styles.modalCard} 
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Mobile Drag Indicator */}
        <div className={styles.dragHandle} aria-hidden="true" />

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTextGroup}>
            <span className={styles.pillBadge}>Direct Consultation</span>
            <h2 className={styles.title}>
              <span className={styles.iconBox}><FaPhoneAlt /></span>
              <span>{title}</span>
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <button 
            type="button"
            className={styles.closeBtn} 
            onClick={handleModalClose} 
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={styles.formBody} noValidate>
          <input
            type="checkbox"
            name="botcheck"
            className={styles.honeypot}
            checked={formData.botcheck}
            onChange={handleInputChange}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="modal-name">Full Name *</label>
              <input
                id="modal-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Kallis"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="modal-email">Email Address *</label>
              <input
                id="modal-email"
                name="email"
                type="email"
                required
                placeholder="name@domain.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="modal-phone">Phone Number (Optional)</label>
              <input
                id="modal-phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field} ref={dropdownRef}>
              <label id="modal-service-label">Discipline / Service</label>
              <div className={styles.customSelectWrapper}>
                <button
                  type="button"
                  className={`${styles.selectTrigger} ${isDropdownOpen ? styles.selectActive : ""}`}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  aria-labelledby="modal-service-label"
                >
                  <span>{formData.service}</span>
                  <FaChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`} />
                </button>

                {isDropdownOpen && (
                  <ul className={styles.selectMenu} role="listbox">
                    {serviceOptions.map((opt) => {
                      const isSelected = formData.service === opt;
                      return (
                        <li
                          key={opt}
                          role="option"
                          aria-selected={isSelected}
                          className={`${styles.selectOption} ${isSelected ? styles.optionActive : ""}`}
                          onClick={() => handleServiceSelect(opt)}
                        >
                          <span>{opt}</span>
                          {isSelected && <FaCheck className={styles.checkIcon} />}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="modal-message">Project Details &amp; Requirements *</label>
            <textarea
              id="modal-message"
              name="message"
              required
              rows="3"
              maxLength={900}
              placeholder="Tell us about the site location, area, or engineering requirements..."
              value={formData.message}
              onChange={handleInputChange}
            />
            <div className={styles.charCounter}>
              {formData.message.length} / 900 characters
            </div>
          </div>

          {/* Status Notifications */}
          {status.success && (
            <div className={styles.successBanner}>
              <FaCheckCircle /> <span>{status.message}</span>
            </div>
          )}
          {status.error && (
            <div className={styles.errorBanner}>
              <FaExclamationCircle /> <span>{status.message}</span>
            </div>
          )}

          {/* Buttons */}
          <div className={styles.actionRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status.submitting}
            >
              <FaPaperPlane />
              <span>{status.submitting ? "Sending..." : "Submit Inquiry"}</span>
            </button>

            <button
              type="button"
              className={styles.whatsappBtn}
              onClick={openWhatsApp}
              disabled={!formData.name.trim() || !formData.message.trim()}
            >
              <FaWhatsapp className={styles.waIcon} />
              <span>WhatsApp Direct</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}