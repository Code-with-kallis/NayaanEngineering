import React, { useState } from "react";
import {
  FaArrowRight,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaCheckCircle,
  FaExclamationCircle,
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

export default function ContactForm({
  accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
  title = "Let's talk",
  subtitle = "To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly.",
  eyebrow,
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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDirectWeb3Submit = async (e) => {
    e.preventDefault();
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
          subject: `New Inquiry: ${formData.service} - ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not Provided",
          service: formData.service,
          message: formData.message,
          botcheck: formData.botcheck,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: "Thank you! Your message has been sent successfully.",
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
      `Name: ${formData.name}`,
      `Email: ${formData.email || "-"}`,
      `Phone: ${formData.phone || "-"}`,
      `Service: ${formData.service}`,
      "",
      "Project Details:",
      formData.message,
    ].join("\n");

    window.open(
      `https://wa.me/919858765435?text=${encodeURIComponent(inquiryBody)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className={styles.sectionOuter} aria-label="Contact Section">
      <div className={styles.contactWrapper}>
        {/* Left Column: Form */}
        <div className={styles.formCol}>
          <div className={styles.headerArea}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <form 
            className={styles.contactForm} 
            onSubmit={handleDirectWeb3Submit} 
            noValidate
          >
            {/* Spam Protection Honeypot */}
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
                <label htmlFor="form-email">E-mail *</label>
                <input
                  type="email"
                  id="form-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="form-phone">Phone Number</label>
                <input
                  type="tel"
                  id="form-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 ..."
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
              <label htmlFor="form-message">Your message *</label>
              <textarea
                id="form-message"
                name="message"
                required
                rows="3"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..."
              />
            </div>

            {/* Notification Banners */}
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

            <div className={styles.actionFooter}>
              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status.submitting}
                  aria-busy={status.submitting}
                >
                  <span>{status.submitting ? "Sending..." : "Send Message"}</span>
                  <FaArrowRight className={styles.btnArrow} />
                </button>

                <button
                  type="button"
                  className={styles.whatsappBtn}
                  onClick={openWhatsApp}
                  disabled={!formData.name.trim() || !formData.message.trim()}
                  aria-label="Send inquiry via WhatsApp"
                >
                  <FaWhatsapp className={styles.waIcon} />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className={styles.socialFollow}>
                <span>Follow Us</span>
                <div className={styles.socialIcons}>
                  <a
                    href="https://www.facebook.com/nayaabengineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Nayaab Engineering on Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://www.instagram.com/nayaabengineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Nayaab Engineering on Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Image Stage */}
        <div className={styles.artCol}>
          <div className={styles.artContainer}>
            <img
              src={contactArt}
              alt="Engineering Consulting & Turnkey Construction"
              className={styles.artSvg}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}