// src/pages/ServiceDetail/ServiceDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaCheckCircle, 
  FaArrowLeft, 
  FaPhoneAlt, 
  FaShieldAlt, 
  FaBuilding, 
  FaDraftingCompass, 
  FaHardHat, 
  FaChevronRight, 
  FaPalette, 
  FaClipboardCheck, 
  FaHome 
} from "react-icons/fa";
import { SERVICES_DATA } from "../../data/services";
import styles from "./ServiceDetail.module.css";

const SERVICE_ICONS = {
  "architectural-design": <FaDraftingCompass />,
  "structural-engineering": <FaBuilding />,
  "turnkey-construction": <FaHardHat />,
  "interior-modular-design": <FaPalette />,
  "regulatory-approvals": <FaClipboardCheck />
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  const otherServices = SERVICES_DATA.filter((s) => s.slug !== slug);

  if (!service) {
    return (
      <main className={styles.notFoundWrapper}>
        <div className={styles.notFoundCard}>
          <FaBuilding className={styles.notFoundIcon} />
          <h2>Service Not Found</h2>
          <p>The requested engineering or architectural discipline could not be located.</p>
          <Link to="/services" className={styles.backBtn}>
            <FaArrowLeft /> <span>Back to All Services</span>
          </Link>
        </div>
      </main>
    );
  }

  const detailSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDesc || service.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "Nayaab Engineering Innovations Pvt. Ltd."
    },
    "areaServed": "Jammu & Kashmir",
    "url": `https://www.nayaabengineering.com/services/${service.slug}`
  };

  return (
    <main className={styles.pageWrapper} key={slug}>
      <Helmet>
        <title>{service.seoTitle || `${service.title} | Nayaab Engineering Innovations`}</title>
        <meta
          name="description"
          content={service.metaDescription || service.shortDesc || service.fullDesc}
        />
        {service.keywords && (
          <meta name="keywords" content={service.keywords.join(", ")} />
        )}
        <link rel="canonical" href={`https://www.nayaabengineering.com/services/${service.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={service.seoTitle || `${service.title} | Nayaab Engineering`} />
        <meta
          property="og:description"
          content={service.metaDescription || service.shortDesc}
        />
        <meta property="og:url" content={`https://www.nayaabengineering.com/services/${service.slug}`} />
        <meta property="og:image" content="https://www.nayaabengineering.com/logo-full.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.title} />
        <meta name="twitter:description" content={service.shortDesc} />
        <script type="application/ld+json">{JSON.stringify(detailSchema)}</script>
      </Helmet>

      {/* ================= BREADCRUMB & HEADER ================= */}
      <section className={styles.headerSection} aria-labelledby="service-detail-title">
        <div className={styles.headerContainer}>
          <nav className={`${styles.breadcrumbRow} ${styles.animateSlideLeft} ${styles.delay1}`} aria-label="Breadcrumb">
            <Link to="/" className={styles.homeBreadcrumbLink}>
              <FaHome className={styles.homeBreadcrumbIcon} />
              <span>Home</span>
            </Link>
            <span className={styles.slash} aria-hidden="true">/</span>
            <Link to="/services" className={styles.backLink}>
              <span>Services</span>
            </Link>
            <span className={styles.slash} aria-hidden="true">/</span>
            <strong className={styles.currentBreadcrumb} aria-current="page">{service.title}</strong>
          </nav>

          <div className={`${styles.sectionTagRow} ${styles.animateSlideLeft} ${styles.delay2}`}>
            <span className={styles.tagSquare} aria-hidden="true" />
            <span>CIVIL &amp; ARCHITECTURAL DISCIPLINE</span>
          </div>

          <h1 id="service-detail-title" className={`${styles.serviceTitle} ${styles.animateSlideLeft} ${styles.delay3}`}>
            {service.title}
          </h1>
          
          <p className={`${styles.serviceSubtitle} ${styles.animateSlideLeft} ${styles.delay4}`}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT & SIDEBAR ================= */}
      <section className={styles.contentSection} aria-label={`${service.title} Technical Specifications`}>
        <div className={styles.contentContainer}>
          <div className={styles.gridContainer}>
            
            {/* LEFT MAIN CONTENT */}
            <div className={styles.mainContent}>
              
              {/* Hero Image Stage */}
              <div className={`${styles.imageWrapper} ${styles.animateSlideLeft} ${styles.delay3}`}>
                <img 
                  src={service.coverImage} 
                  alt={service.imageAlt || service.title} 
                  loading="eager" 
                  decoding="async" 
                />
                <div className={styles.floatingIconBadge} aria-hidden="true">
                  {SERVICE_ICONS[service.slug] || <FaBuilding />}
                </div>
              </div>

              {/* Scope of Work */}
              <div className={`${styles.detailBlock} ${styles.animateSlideLeft} ${styles.delay4}`}>
                <h2 className={styles.subHeading}>Scope of Work &amp; Technical Approach</h2>
                <p className={styles.fullDesc}>{service.fullDesc}</p>
              </div>

              {/* Key Capabilities */}
              <div className={`${styles.detailBlock} ${styles.animateSlideLeft} ${styles.delay5}`}>
                <h2 className={styles.subHeading}>Key Capabilities &amp; Deliverables</h2>
                <div className={styles.featuresGrid}>
                  {service.features && service.features.map((feature, idx) => (
                    <div key={idx} className={styles.featureCard}>
                      <FaCheckCircle className={styles.checkIcon} aria-hidden="true" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Compliance Box */}
              {service.complianceInfo && (
                <div className={`${styles.complianceBox} ${styles.animateSlideLeft} ${styles.delay5}`}>
                  <div className={styles.complianceHeader}>
                    <div className={styles.complianceIconBox}>
                      <FaShieldAlt className={styles.complianceIcon} aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{service.complianceInfo.title}</h3>
                      <p>{service.complianceInfo.subtitle}</p>
                    </div>
                  </div>
                  <ul className={styles.complianceList}>
                    {service.complianceInfo.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Service Execution Workflow */}
              {service.workflow && service.workflow.length > 0 && (
                <div className={`${styles.detailBlock} ${styles.animateSlideLeft} ${styles.delay6}`}>
                  <h2 className={styles.subHeading}>Service Execution Workflow</h2>
                  <div className={styles.workflowGrid}>
                    {service.workflow.map((item) => (
                      <div key={item.step} className={styles.workflowStep}>
                        <span className={styles.stepNumber}>0{item.step}</span>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR */}
            <aside className={`${styles.sidebar} ${styles.animateSlideLeft} ${styles.delay4}`} aria-label="Technical Specifications & Actions">
              
              {/* Technical Specs Card */}
              {service.specs && (
                <div className={styles.specsCard}>
                  <h3 className={styles.sidebarTitle}>Technical Specs</h3>
                  <div className={styles.specList}>
                    {service.specs.map((spec, idx) => (
                      <div key={idx} className={styles.specItem}>
                        <div className={styles.specTextGroup}>
                          <span className={styles.specLabel}>{spec.label}</span>
                          <span className={styles.specValue}>{spec.value}</span>
                        </div>
                      </div>
                    ))}
                    <div className={styles.specItem}>
                      <div className={styles.specTextGroup}>
                        <span className={styles.specLabel}>Regional HQ</span>
                        <span className={styles.specValue}>Baramulla, J&amp;K</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation CTA */}
              <div className={styles.ctaCard}>
                <div className={styles.ctaBadge}>GET STARTED</div>
                <h3>Need {service.title}?</h3>
                <p>Schedule a direct engineering consultation or site visit with our licensed team in Baramulla.</p>
                <Link to="/contact" className={styles.primaryBtn} aria-label="Request Technical Consultation">
                  <FaPhoneAlt /> <span>Request Consultation</span>
                </Link>
              </div>

              {/* Other Disciplines List */}
              <div className={styles.otherServicesCard}>
                <h3 className={styles.sidebarTitle}>Other Core Disciplines</h3>
                <div className={styles.otherServicesList}>
                  {otherServices.map((item) => (
                    <Link key={item.id || item.slug} to={`/services/${item.slug}`} className={styles.otherServiceItem}>
                      <span>{item.title}</span>
                      <FaChevronRight className={styles.navArrow} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}