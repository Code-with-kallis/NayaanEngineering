import React from "react";
import { Link } from "react-router-dom";
import { 
  FaSquare, 
  FaDraftingCompass, 
  FaBuilding, 
  FaHardHat, 
  FaPalette, 
  FaClipboardCheck, 
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import { SERVICES_DATA } from "../../data/services";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import styles from "./Services.module.css";

const ICON_MAP = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaHardHat: <FaHardHat />,
  FaPalette: <FaPalette />,
  FaClipboardCheck: <FaClipboardCheck />,
};

export default function Services() {
  return (
    <main className={styles.pageWrapper}>
      {/* ================= HEADER / HERO SECTION ================= */}
      <section className={styles.heroSection}>
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={`${styles.sectionTagRow} ${styles.animateSlideLeft} ${styles.delay1}`}>
              <FaSquare className={styles.tagSquareIcon} />
              <span>WHAT WE DO</span>
            </div>
            <h1 className={`${styles.splitTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
              Comprehensive Civil &amp;<br />Architectural Solutions
            </h1>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={`${styles.splitDesc} ${styles.animateSlideLeft} ${styles.delay3}`}>
              From initial 3D architectural modeling and structural load calculations to full turnkey site execution, luxury interior fit-outs, and municipal permissions across Jammu &amp; Kashmir.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES CARDS GRID ================= */}
      <section className={styles.gridSection}>
        <div className={styles.serviceGrid}>
          {SERVICES_DATA.map((service) => (
            <Link 
              key={service.id || service.slug} 
              to={`/services/${service.slug}`} 
              className={styles.serviceCard}
            >
              {/* Image Container with Chamfered Cutout */}
              <div className={styles.cardImageWrapper}>
                <img 
                  src={service.coverImage} 
                  alt={service.title} 
                  loading="lazy" 
                />
                <div className={styles.iconBadge}>
                  {ICON_MAP[service.icon] || <FaBuilding />}
                </div>
              </div>

              {/* Card Content Body */}
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{service.title}</h2>
                <p className={styles.cardDesc}>{service.shortDesc}</p>

                {/* Service Features Preview */}
                {service.features && service.features.length > 0 && (
                  <ul className={styles.featuresList}>
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className={styles.checkIcon} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className={styles.detailsBtn}>
                  <span>Explore Service</span>
                  <FaArrowRight className={styles.btnArrow} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CONTACT / CTA SECTION ================= */}
      <section className={styles.ctaSection}>
        <ContactForm
          eyebrow="START A CONVERSATION"
          title="Discuss Your Next Project"
          subtitle="Need technical advisory, 3D floor plan reviews, or structural cost estimation? Get in touch with our civil engineering team in Baramulla."
        />
      </section>
    </main>
  );
}