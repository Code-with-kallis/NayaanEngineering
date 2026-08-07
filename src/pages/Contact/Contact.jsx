import { useState } from "react";
import {
  FaBuilding,
  FaClipboardList,
  FaDraftingCompass,
  FaEnvelope,
  FaFacebookF,
  FaHardHat,
  FaInstagram,
  FaKey,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaProjectDiagram,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "./Contact.module.css";

const officeAddress =
  "3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar, Baramulla, Jammu & Kashmir - 193101";

const officeMapLink =
  "https://maps.app.goo.gl/2eVktdmG7WoQGscE6";

const officeMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d13199.385365087526!2d74.35188535!3d34.20140225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x38e107b7aa028b1b%3A0x62f20694ef46156d!2sNayaab%20Engineering%20Innovations%20Private%20Limited%2C%203rd%20Floor%2C%20Qutub%20Complex%2C%20opp.%20JKBank%2C%20Baramulla%2C%20Jammu%20and%20Kashmir%20193101!3m2!1d34.2062866!2d74.3427435!5e0!3m2!1sen!2sin!4v1785871591762!5m2!1sen!2sin";

const serviceOptions = [
  { title: "Architectural Design", icon: <FaDraftingCompass /> },
  { title: "Structural Engineering", icon: <FaBuilding /> },
  { title: "Construction Management", icon: <FaHardHat /> },
  { title: "Engineering Consultancy", icon: <FaClipboardList /> },
  { title: "Project Planning", icon: <FaProjectDiagram /> },
  { title: "Turnkey Solutions", icon: <FaKey /> },
];

const faqItems = [
  {
    question: "What kind of projects can I discuss through this page?",
    answer:
      "You can contact us for residential, commercial, and public infrastructure requirements including design, structural review, project planning, consultancy, supervision, and turnkey execution.",
  },
  {
    question: "Can I use this page to schedule a site visit or office meeting?",
    answer:
      "Yes. Use the inquiry form, direct office number, or WhatsApp button to request a meeting, technical discussion, or site coordination call.",
  },
  {
    question: "How should I share drawings or project documents?",
    answer:
      "Email is the best option for sending plans, briefs, and supporting files. You can also begin the conversation on WhatsApp and continue with email for formal documentation.",
  },
];

const initialFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: serviceOptions[0].title,
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const isInquiryReady = Boolean(
    formData.name.trim() &&
      formData.message.trim() &&
      (formData.email.trim() || formData.phone.trim())
  );

  const inquirySubject = `Project Inquiry - ${formData.service}`;

  const inquiryBody = [
    "Hello Nayaab Engineering Team,",
    "",
    "I would like to discuss a project inquiry.",
    "",
    `Name: ${formData.name || "-"}`,
    `Company: ${formData.company || "-"}`,
    `Email: ${formData.email || "-"}`,
    `Phone: ${formData.phone || "-"}`,
    `Service Required: ${formData.service || "-"}`,
    "",
    "Project Details:",
    formData.message || "-",
  ].join("\n");

  const emailInquiryHref = `mailto:info@nayaabengineering.com?subject=${encodeURIComponent(
    inquirySubject
  )}&body=${encodeURIComponent(inquiryBody)}`;

  const whatsappInquiryHref = `https://wa.me/919858765435?text=${encodeURIComponent(
    inquiryBody
  )}`;

  const openEmailInquiry = () => {
    if (!isInquiryReady) return;
    window.location.href = emailInquiryHref;
  };

  const openWhatsAppInquiry = () => {
    if (!isInquiryReady) return;
    window.open(whatsappInquiryHref, "_blank", "noopener,noreferrer");
  };

  return (
    <main className={styles.contactPage}>
      {/* SECTION 1: HERO WITH EMBEDDED MAP AT TOP */}
      <section className={styles.contactHero}>
        <div className={styles.contactHeroMesh} aria-hidden="true" />
        <div className={styles.contactHeroContainer}>
          <div className={styles.contactHeroContent}>
            <p className={styles.contactHeroEyebrow}>Contact Nayaab Engineering</p>
            <h1 className={styles.contactHeroTitle}>
              Start Your Next Project Discussion
            </h1>
            <p className={styles.contactHeroSubtitle}>
              Reach us for architectural planning, structural engineering,
              construction coordination, and turnkey project execution. Visit our
              office in Baramulla or connect directly via phone or WhatsApp.
            </p>

            <div className={styles.contactHeroActions}>
              <a
                href="tel:+911952455465"
                className={`${styles.contactButton} ${styles.contactButtonPrimary}`}
              >
                <FaPhoneAlt />
                <span>Call +91 1952-455465</span>
              </a>
              <a
                href="https://wa.me/919858765435"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactButton} ${styles.contactButtonWhatsapp}`}
              >
                <FaWhatsapp />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>

          {/* Location Map Embedded directly at top */}
          <div className={styles.contactTopMapCard}>
            <div className={styles.contactTopMapFrame}>
              <iframe
                src={officeMapEmbed}
                title="Nayaab Engineering office location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.contactTopMapFooter}>
              <div className={styles.contactTopMapAddress}>
                <FaMapMarkerAlt className={styles.contactTopMapIcon} />
                <span>{officeAddress}</span>
              </div>
              <a
                href={officeMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButtonSecondaryInline}
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FORM & SERVICE SIDEBAR */}
      <section className={styles.contactMain}>
        <div className={styles.contactMainContainer}>
          {/* Main Inquiry Form */}
          <div className={styles.contactFormCard}>
            <div className={styles.contactFormCardHeader}>
              <span className={styles.contactFormCardEyebrow}>Project Inquiry</span>
              <h2>Send Us Your Project Brief</h2>
              <p>
                Fill in the details below and select your preferred channel to
                transmit your brief directly to our engineering desk.
              </p>
            </div>

            <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.contactFormGrid}>
                <label className={styles.contactFormField}>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </label>

                <label className={styles.contactFormField}>
                  <span>Company / Organization</span>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company or project owner"
                  />
                </label>

                <label className={styles.contactFormField}>
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                  />
                </label>

                <label className={styles.contactFormField}>
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 ..."
                  />
                </label>
              </div>

              <label className={styles.contactFormField}>
                <span>Service Required</span>
                <select name="service" value={formData.service} onChange={handleInputChange}>
                  {serviceOptions.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.contactFormField}>
                <span>Project Details</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project scope, site, timeline, or required support."
                  rows="6"
                />
              </label>

              <div className={styles.contactFormActions}>
                <button
                  type="button"
                  className={`${styles.contactButton} ${styles.contactButtonPrimary}`}
                  onClick={openEmailInquiry}
                  disabled={!isInquiryReady}
                >
                  <FaEnvelope />
                  <span>Send by Email</span>
                </button>

                <button
                  type="button"
                  className={`${styles.contactButton} ${styles.contactButtonWhatsapp}`}
                  onClick={openWhatsAppInquiry}
                  disabled={!isInquiryReady}
                >
                  <FaWhatsapp />
                  <span>Send by WhatsApp</span>
                </button>
              </div>

              <p className={styles.contactFormNote}>
                * Complete name, message, and at least one contact method to enable submission.
              </p>
            </form>
          </div>

          {/* Clean Sidebar */}
          <aside className={styles.contactSidebar}>
            <article className={styles.contactSidebarCard}>
              <span className={styles.contactSidebarEyebrow}>Service Coverage</span>
              <h2>Core Expertise</h2>
              <div className={styles.contactServiceChips}>
                {serviceOptions.map((service) => (
                  <div className={styles.contactServiceChip} key={service.title}>
                    <span className={styles.contactServiceChipIcon}>{service.icon}</span>
                    <span>{service.title}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.contactSidebarCard}>
              <span className={styles.contactSidebarEyebrow}>Direct Channels</span>
              <h2>Email &amp; Social Media</h2>
              <ul className={styles.contactSidebarList}>
                <li>
                  <FaEnvelope />
                  <a href="mailto:info@nayaabengineering.com">info@nayaabengineering.com</a>
                </li>
              </ul>
              <div className={styles.contactMapSocials}>
                <a
                  href="https://www.facebook.com/nayaabengineering/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nayaab Engineering on Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/nayaabengineering/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nayaab Engineering on Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </article>
          </aside>
        </div>
      </section>

      {/* SECTION 3: FAQ */}
      <section className={styles.contactFaq}>
        <div className={styles.contactFaqContainer}>
          <div className={styles.contactFaqContent}>
            <span className={styles.contactSectionHeadingEyebrow}>Questions</span>
            <h2>Common Contact Questions</h2>
            <div className={styles.contactFaqItems}>
              {faqItems.map((item) => (
                <details className={styles.contactFaqItem} key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;