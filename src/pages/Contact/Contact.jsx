import ContactForm from "../../components/common/ContactForm/ContactForm";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import styles from "./Contact.module.css";

const officeAddress =
  "3rd Floor, Qutub Complex, Opp. JK Bank (TP), Main Bazar, Baramulla, Jammu & Kashmir - 193101";

const officeMapLink = "https://maps.app.goo.gl/2eVktdmG7WoQGscE6";

const officeMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d13199.385365087526!2d74.35188535!3d34.20140225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x38e107b7aa028b1b%3A0x62f20694ef46156d!2sNayaab%20Engineering%20Innovations%20Private%20Limited%2C%203rd%20Floor%2C%20Qutub%20Complex%2C%20opp.%20JKBank%2C%20Baramulla%2C%20Jammu%20and%20Kashmir%20193101!3m2!1d34.2062866!2d74.3427435!5e0!3m2!1sen!2sin!4v1785871591762!5m2!1sen!2sin";

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

function Contact() {
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

      {/* SECTION 2: EDITORIAL FORM (FULL BLEED DIRECT RENDER) */}
      <ContactForm
        title="Contact us"
        subtitle="Get in touch and let us know how we can help."
      />

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