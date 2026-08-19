import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaClock,
  FaExternalLinkAlt,
  FaChevronDown,
} from "react-icons/fa";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import styles from "./Contact.module.css";

const officeAddress =
  "3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar, Baramulla, Jammu & Kashmir - 193101";

const officeMapLink =
  "https://www.google.com/maps/dir/?api=1&destination=34.20626599688759,74.34252733418458&destination_place_id=ChIJG4sCqrcH4TkRbRVG75QG8mI";

const officeMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1166.6045492359476!2d74.34252733418458!3d34.20626599688759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e107b7aa028b1b%3A0x62f20694ef46156d!2sNayaab%20Engineering%20Innovations%20Private%20Limited!5e0!3m2!1sen!2sin!4v1787066586885!5m2!1sen!2sin";

const faqList = [
  {
    q: "What types of projects do you handle?",
    a: "We provide complete architectural planning, structural load calculations, municipal approvals, 3D visualizations, and turnkey civil construction for residential, commercial, and institutional developments across Jammu & Kashmir.",
  },
  {
    q: "How do I schedule an in-person consultation or site visit?",
    a: "You can reach out through our contact form, direct phone line, or WhatsApp. We coordinate an initial discovery meeting at our Baramulla studio or arrange a site inspection to review feasibility.",
  },
  {
    q: "What is the best way to send project drawings or CAD files?",
    a: "For architectural plans, drawings, or structural documentation, email your files directly to our engineering desk or share initial PDFs over WhatsApp for immediate review.",
  },
  {
    q: "How soon will I receive a response to my inquiry?",
    a: "All online inquiries and WhatsApp requests are reviewed by our engineering team within 2 to 4 business hours. Urgent project calls are handled immediately during working hours.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <main className={styles.pageContainer}>
      <Helmet>
        <title>Contact Us | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Get in touch with Nayaab Engineering Innovations. Connect with our architectural and structural engineering team in Baramulla, Jammu & Kashmir."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/contact" />
      </Helmet>

      {/* 1. HERO & DIRECT CONTACT CARDS */}
      <section className={styles.heroSection}>
        <div className={styles.heroWrapper}>
          <div className={styles.heroHeader}>
            <span className={styles.pillBadge}>Contact Us</span>
            <h1 className={styles.heroTitle}>
              Let&apos;s build something <span className={styles.accentText}>remarkable</span> together.
            </h1>
            <p className={styles.heroSubtitle}>
              Have a project in mind or need expert structural guidance? Connect directly with our engineering studio or visit us in Baramulla.
            </p>
          </div>

          {/* Quick Contact Chips Grid */}
          <div className={styles.channelsGrid}>
            <a href="tel:+911952455465" className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <FaPhoneAlt />
              </div>
              <div className={styles.channelInfo}>
                <span className={styles.channelLabel}>Phone Line</span>
                <span className={styles.channelValue}>+91 1952-455465</span>
              </div>
            </a>

            <a
              href="https://wa.me/919858765435?text=Hello%20Nayaab%20Engineering%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.channelCard} ${styles.channelCardWa}`}
            >
              <div className={styles.channelIcon}>
                <FaWhatsapp />
              </div>
              <div className={styles.channelInfo}>
                <span className={styles.channelLabel}>Quick Chat</span>
                <span className={styles.channelValue}>WhatsApp Support</span>
              </div>
            </a>

            <a href="mailto:info@nayaabengineering.com" className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <FaEnvelope />
              </div>
              <div className={styles.channelInfo}>
                <span className={styles.channelLabel}>Email Desk</span>
                <span className={styles.channelValue}>info@nayaabengineering.com</span>
              </div>
            </a>

            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <FaClock />
              </div>
              <div className={styles.channelInfo}>
                <span className={styles.channelLabel}>Studio Hours</span>
                <span className={styles.channelValue}>Mon – Sat: 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAP & STUDIO LOCATION */}
      <section className={styles.locationSection}>
        <div className={styles.locationWrapper}>
          <div className={styles.mapCard}>
            <div className={styles.mapFrameWrapper}>
              <iframe
                src={officeMapEmbed}
                title="Nayaab Engineering Innovations Location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.mapIframe}
              />
            </div>

            <div className={styles.mapDetailsBar}>
              <div className={styles.addressArea}>
                <div className={styles.pinIconBox}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.addressText}>
                  <strong>Nayaab Engineering Innovations</strong>
                  <p>{officeAddress}</p>
                </div>
              </div>

              <a
                href={officeMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapActionBtn}
              >
                <span>Get Directions</span>
                <FaExternalLinkAlt className={styles.btnIcon} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM INTEGRATION */}
      <section className={styles.formSection}>
        <ContactForm
          subtitle="Fill out the details below and an engineer from our team will get back to you promptly."
        />
      </section>

      {/* 4. FAQ ACCORDION */}
      <section className={styles.faqSection}>
        <div className={styles.faqWrapper}>
          <div className={styles.faqHeader}>
            <span className={styles.pillBadge}>Common Questions</span>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <p className={styles.faqSubtitle}>
              Everything you need to know about starting a project consultation with us.
            </p>
          </div>

          <div className={styles.faqList}>
            {faqList.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQuestionBtn}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <FaChevronDown
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotated : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}