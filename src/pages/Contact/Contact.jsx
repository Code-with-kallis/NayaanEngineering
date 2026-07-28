import { useState } from "react";
import {
  FaBuilding,
  FaCalendarCheck,
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
import "./Contact.css";

const officeAddress =
  "3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar, Baramulla, Jammu & Kashmir - 193101";

const officeMapLink =
  "https://www.google.com/maps/search/?api=1&query=3rd+Floor%2C+Qutub+Complex%2C+Opposite+JK+Bank+%28TP%29%2C+Baramulla%2C+Jammu+%26+Kashmir+193101";

const officeMapEmbed =
  "https://www.google.com/maps?q=3rd+Floor,+Qutub+Complex,+Opposite+JK+Bank+(TP),+Baramulla,+Jammu+%26+Kashmir+193101&z=16&output=embed";

const serviceOptions = [
  {
    title: "Architectural Design",
    icon: <FaDraftingCompass />,
  },
  {
    title: "Structural Engineering",
    icon: <FaBuilding />,
  },
  {
    title: "Construction Management",
    icon: <FaHardHat />,
  },
  {
    title: "Engineering Consultancy",
    icon: <FaClipboardList />,
  },
  {
    title: "Project Planning",
    icon: <FaProjectDiagram />,
  },
  {
    title: "Turnkey Solutions",
    icon: <FaKey />,
  },
];

const contactChannels = [
  {
    title: "Call Our Office",
    value: "+91 1952-455465",
    href: "tel:+911952455465",
    icon: <FaPhoneAlt />,
  },
  {
    title: "Email Your Brief",
    value: "info@nayaabengineering.com",
    href: "mailto:info@nayaabengineering.com",
    icon: <FaEnvelope />,
  },
  {
    title: "WhatsApp Direct",
    value: "+91 98587 65435",
    href: "https://wa.me/919858765435",
    icon: <FaWhatsapp />,
    external: true,
  },
  {
    title: "Visit Our Office",
    value: "Open Google Maps",
    href: officeMapLink,
    icon: <FaMapMarkerAlt />,
    external: true,
  },
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
    if (!isInquiryReady) {
      return;
    }

    window.location.href = emailInquiryHref;
  };

  const openWhatsAppInquiry = () => {
    if (!isInquiryReady) {
      return;
    }

    window.open(whatsappInquiryHref, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__mesh" aria-hidden="true"></div>
        <div className="contact-hero__container">
          <div className="contact-hero__content">
            <p className="contact-hero__eyebrow">Contact Nayaab Engineering</p>
            <h1 className="contact-hero__title">
              Start the Right Conversation for Your Next Project
            </h1>
            <p className="contact-hero__subtitle">
              Reach us for architectural planning, structural engineering,
              construction coordination, consultancy, and turnkey project
              discussions. This page gives you direct access to our office,
              leadership contacts, inquiry form, and live location map.
            </p>

            <div className="contact-hero__actions">
              <a href="tel:+911952455465" className="contact-button contact-button--primary">
                <FaPhoneAlt />
                <span>Call Our Office</span>
              </a>
              <a
                href="https://wa.me/919858765435"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-button--secondary"
              >
                <FaWhatsapp />
                <span>WhatsApp Now</span>
              </a>
            </div>
          </div>

          <aside className="contact-hero__panel">
            <div className="contact-hero__panel-header">
              <span>Quick Access</span>
              <p>Everything you usually expect from a full corporate contact page.</p>
            </div>

            <div className="contact-hero__panel-grid">
              {contactChannels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="contact-hero__panel-card"
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                >
                  <div className="contact-hero__panel-icon">{channel.icon}</div>
                  <div>
                    <h2>{channel.title}</h2>
                    <p>{channel.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-main__container">
          <div className="contact-form-card">
            <div className="contact-form-card__header">
              <span className="contact-form-card__eyebrow">Project Inquiry</span>
              <h2>Draft Your Message Once, Send It by Email or WhatsApp</h2>
              <p>
                Fill in the details below and this page will prepare your
                inquiry for the contact channel you prefer.
              </p>
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <div className="contact-form__grid">
                <label className="contact-form__field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </label>

                <label className="contact-form__field">
                  <span>Company / Organization</span>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company or project owner"
                  />
                </label>

                <label className="contact-form__field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                  />
                </label>

                <label className="contact-form__field">
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

              <label className="contact-form__field">
                <span>Service Required</span>
                <select name="service" value={formData.service} onChange={handleInputChange}>
                  {serviceOptions.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="contact-form__field">
                <span>Project Details</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project scope, site, timeline, or support you need."
                  rows="7"
                ></textarea>
              </label>

              <div className="contact-form__actions">
                <button
                  type="button"
                  className="contact-button contact-button--primary"
                  onClick={openEmailInquiry}
                  disabled={!isInquiryReady}
                >
                  <FaEnvelope />
                  <span>Send by Email</span>
                </button>

                <button
                  type="button"
                  className="contact-button contact-button--whatsapp"
                  onClick={openWhatsAppInquiry}
                  disabled={!isInquiryReady}
                >
                  <FaWhatsapp />
                  <span>Send by WhatsApp</span>
                </button>
              </div>

              <p className="contact-form__note">
                Add your name, contact information, and project details to
                enable the action buttons above.
              </p>
            </form>
          </div>

          <aside className="contact-sidebar">
            <article className="contact-sidebar__card">
              <span className="contact-sidebar__eyebrow">Office Information</span>
              <h2>Baramulla Office Desk</h2>

              <ul className="contact-sidebar__list">
                <li>
                  <FaMapMarkerAlt />
                  <span>{officeAddress}</span>
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
                    rel="noopener noreferrer"
                  >
                    +91 98587 65435
                  </a>
                </li>
              </ul>
            </article>

            <article className="contact-sidebar__card">
              <span className="contact-sidebar__eyebrow">Service Coverage</span>
              <h2>Discuss Any of Our Core Services</h2>

              <div className="contact-service-chips">
                {serviceOptions.map((service) => (
                  <div className="contact-service-chip" key={service.title}>
                    <span className="contact-service-chip__icon">{service.icon}</span>
                    <span>{service.title}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contact-sidebar__card">
              <span className="contact-sidebar__eyebrow">Project Coordination</span>
              <h2>Need a Meeting or Technical Discussion?</h2>
              <p>
                Use the inquiry form for a structured brief, call the office for
                direct coordination, or use WhatsApp for faster back-and-forth
                communication and location support.
              </p>

              <a
                href={officeMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-sidebar__maps-link"
              >
                <FaCalendarCheck />
                <span>Open Office Location in Google Maps</span>
              </a>
            </article>
          </aside>
        </div>
      </section>

      <section className="contact-map">
        <div className="contact-section-heading">
          <span className="contact-section-heading__eyebrow">Office Location</span>
          <h2>Find the Office Directly from the Contact Page</h2>
          <p>
            The live Google Maps embed below shows the office location, and the
            action button opens the same address in Google Maps for navigation.
          </p>
        </div>

        <div className="contact-map__layout">
          <div className="contact-map__frame">
            <iframe
              src={officeMapEmbed}
              title="Nayaab Engineering office location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="contact-map__details">
            <h3>Nayaab Engineering Innovations Pvt. Ltd.</h3>
            <p>{officeAddress}</p>

            <div className="contact-map__actions">
              <a
                href={officeMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-button--primary"
              >
                <FaMapMarkerAlt />
                <span>Open in Google Maps</span>
              </a>
              <a href="mailto:info@nayaabengineering.com" className="contact-button contact-button--ghost">
                <FaEnvelope />
                <span>Email Before Visiting</span>
              </a>
            </div>

            <div className="contact-map__socials">
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
              <a href="mailto:info@nayaabengineering.com" aria-label="Email Nayaab Engineering">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-faq">
        <div className="contact-faq__container">
          <div className="contact-faq__content">
            <span className="contact-section-heading__eyebrow">Questions</span>
            <h2>Common Contact Questions</h2>
            <p>
              A professional contact page should answer the first few practical
              questions before the client even picks up the phone.
            </p>

            <div className="contact-faq__items">
              {faqItems.map((item) => (
                <details className="contact-faq__item" key={item.question}>
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
