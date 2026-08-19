// src/pages/Services/Services.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaHome, 
  FaArrowRight, 
  FaCheckCircle 
} from "react-icons/fa";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import { SERVICES_DATA } from "../../data/services";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <main className={styles.pageWrapper}>
      <Helmet>
        <title>Services &amp; Engineering Disciplines | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Explore civil engineering, 3D architectural modeling, structural analysis, turnkey construction, and interior design services by Nayaab Engineering in Kashmir."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/services" />
      </Helmet>

      {/* ================= TOP BREADCRUMB ================= */}
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <FaHome className={styles.homeIcon} aria-hidden="true" />
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.slash}>/</span>
          <strong className={styles.activeBreadcrumb} aria-current="page">Services</strong>
        </nav>
      </div>

      {/* ================= ALTERNATING 1-BY-1 SERVICES LIST ================= */}
      <section className={styles.servicesSection} aria-label="Engineering Services Catalog">
        <div className={styles.container}>
          <div className={styles.servicesList}>
            {SERVICES_DATA.map((service, index) => (
              <article 
                key={service.id || service.slug}
                className={`${styles.serviceRow} ${index % 2 !== 0 ? styles.rowReverse : ""}`}
              >
                {/* 1. TEXT CONTENT WITH MUSTARD ACCENT LINE */}
                <div className={styles.contentCol}>
                  <div className={styles.metaRow}>
                    <span className={styles.serviceIndex}>0{index + 1}</span>
                    <span className={styles.metaDivider}>/</span>
                    <span className={styles.serviceCategory}>Engineering Discipline</span>
                  </div>

                  <h2 className={styles.serviceTitle}>{service.title}</h2>
                  
                  <p className={styles.serviceDescription}>
                    {service.shortDesc || service.description}
                  </p>

                  {/* Deliverables List */}
                  {service.features && service.features.length > 0 && (
                    <div className={styles.deliverablesWrapper}>
                      <span className={styles.deliverablesLabel}>Key Deliverables:</span>
                      <ul className={styles.deliverablesList}>
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className={styles.deliverableItem}>
                            <FaCheckCircle className={styles.checkIcon} aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={styles.actionGroup}>
                    <Link to={`/services/${service.slug}`} className={styles.exploreBtn}>
                      <span>Explore Service</span>
                      <FaArrowRight className={styles.btnArrow} />
                    </Link>
                    <Link to="/contact" className={styles.consultBtn}>
                      <span>Book Consultation</span>
                    </Link>
                  </div>
                </div>

                {/* 2. DIRECTIONAL CHAMFERED IMAGE */}
                <div className={styles.imageCol}>
                  <div className={styles.imageFrame}>
                    <img 
                      src={service.coverImage} 
                      alt={service.imageAlt || service.title}
                      className={styles.serviceImage}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FULL CONTACT FORM INTEGRATION ================= */}
      <section className={styles.contactFormSection}>
        <ContactForm />
      </section>
    </main>
  );
}