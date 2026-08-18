// src/pages/Services/Services.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaHome,
  FaDraftingCompass, 
  FaBuilding, 
  FaHardHat, 
  FaPalette, 
  FaClipboardCheck, 
  FaArrowRight,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHandshake
} from "react-icons/fa";
import { SERVICES_DATA } from "../../data/services";
import styles from "./Services.module.css";

const ICON_MAP = {
  FaDraftingCompass: <FaDraftingCompass />,
  FaBuilding: <FaBuilding />,
  FaHardHat: <FaHardHat />,
  FaPalette: <FaPalette />,
  FaClipboardCheck: <FaClipboardCheck />,
};

// 5 Service Cover Images for Automatic Hero Slider
const HERO_SLIDES = (SERVICES_DATA || []).slice(0, 5).map((service) => ({
  id: service.id || service.slug,
  title: service.title,
  image: service.coverImage,
}));

export default function Services() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch Swipe Tracking for Mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 45;

  // Autoplay Slider (Rotates every 4.5 seconds)
  useEffect(() => {
    if (!HERO_SLIDES || HERO_SLIDES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    if (HERO_SLIDES.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    if (HERO_SLIDES.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Mobile Touch Gestures
  const onTouchStart = (e) => {
    touchEndX.current = 0;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <main className={styles.pageWrapper}>
      <Helmet>
        <title>Engineering &amp; Architectural Services | Nayaab Engineering Innovations</title>
        <meta
          name="description"
          content="Explore civil engineering, 3D architectural modeling, structural analysis, turnkey construction, and interior design services by Nayaab Engineering in Kashmir."
        />
        <link rel="canonical" href="https://www.nayaabengineering.com/services" />
      </Helmet>

      {/* ================= HERO SECTION ================= */}
      <section className={styles.heroSection} aria-labelledby="services-hero-title">
        {/* DESKTOP & TABLET BACKGROUND FULL-SCREEN SLIDER */}
        <div className={styles.desktopHeroSlider} aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id + "-desktop"}
              className={`${styles.desktopSlide} ${
                idx === currentSlide ? styles.desktopSlideActive : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className={styles.desktopOverlay} />
        </div>

        {/* MOBILE TOP HALF MEDIA SLIDER (STRICTLY MOBILE PHONES <= 768px) */}
        <div 
          className={styles.mobileHeroMedia}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id + "-mobile"}
              className={`${styles.mobileSlide} ${
                idx === currentSlide ? styles.mobileSlideActive : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}

          {/* Mobile Dot Indicators */}
          <div className={styles.mobileDotsContainer}>
            {HERO_SLIDES.map((_, dotIdx) => (
              <button
                type="button"
                key={dotIdx}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`${styles.mobileDot} ${
                  dotIdx === currentSlide ? styles.mobileDotActive : ""
                }`}
                onClick={() => setCurrentSlide(dotIdx)}
              />
            ))}
          </div>
        </div>

        {/* HERO CONTENT CONTAINER */}
        <div className={styles.heroContainer}>
          <div className={styles.heroContentLeft}>
            {/* Breadcrumb */}
            <nav className={`${styles.breadcrumb} ${styles.animateSlideLeft} ${styles.delay1}`} aria-label="Breadcrumb">
              <FaHome className={styles.homeIcon} aria-hidden="true" />
              <Link to="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.slash}>/</span>
              <strong className={styles.activeBreadcrumb} aria-current="page">Services</strong>
            </nav>

            {/* Eyebrow */}
            <div className={`${styles.sectionTagRow} ${styles.animateSlideLeft} ${styles.delay2}`}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>SERVICES &amp; DISCIPLINES</span>
            </div>

            {/* Title */}
            <h1 id="services-hero-title" className={`${styles.heroTitle} ${styles.animateSlideLeft} ${styles.delay3}`}>
              Civil &amp; Architectural
              <br />
              Engineering Solutions
            </h1>

            {/* Subtitle */}
            <p className={`${styles.heroText} ${styles.animateSlideLeft} ${styles.delay4}`}>
              From 3D architectural modeling and structural calculations to turnkey execution across Jammu &amp; Kashmir.
            </p>

            {/* Dual Action Buttons */}
            <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay4}`}>
              <Link to="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                <span>Discuss Your Project</span>
              </Link>
              <Link to="/projects" className={`${styles.btn} ${styles.btnOutline}`}>
                <span>Our Projects</span>
              </Link>
            </div>
          </div>

          {/* FLOATING SLIDER CONTROLS */}
          <div className={`${styles.desktopSliderControls} ${styles.animateSlideLeft} ${styles.delay4}`}>
            <div className={styles.sliderControlHeader}>
              <span className={styles.sliderTrackLabel}>Featured Discipline</span>
              <div className={styles.sliderArrowsGroup}>
                <button 
                  type="button" 
                  className={styles.sliderArrowBtn}
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  type="button" 
                  className={styles.sliderArrowBtn}
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <div className={styles.counterTrack}>
              <div className={styles.progressBarWrapper}>
                <div 
                  className={styles.progressBar} 
                  style={{ 
                    width: HERO_SLIDES.length > 0 
                      ? `${((currentSlide + 1) / HERO_SLIDES.length) * 100}%` 
                      : "0%" 
                  }}
                />
              </div>
              <div className={styles.counterBadge}>
                <span className={styles.counterCurrent}>0{currentSlide + 1}</span>
                <span className={styles.counterDivider}>/</span>
                <span className={styles.counterTotal}>0{HERO_SLIDES.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES CARDS GRID ================= */}
      <section className={styles.gridSection} aria-label="Our Services Portfolio">
        <div className={styles.gridContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.gridTagRow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowTextDark}>Full Capabilities</span>
            </div>
            <h2 className={styles.gridSectionTitle}>Explore Engineering Disciplines</h2>
          </div>

          <div className={styles.serviceGrid}>
            {/* Standard Discipline Cards */}
            {(SERVICES_DATA || []).map((service) => (
              <article key={service.id || service.slug} className={styles.cardItem}>
                <Link 
                  to={`/services/${service.slug}`} 
                  className={styles.serviceCard}
                  aria-label={`Explore details for ${service.title}`}
                >
                  <div className={styles.cardImageWrapper}>
                    <img 
                      src={service.coverImage} 
                      alt={service.title} 
                      loading="lazy" 
                      decoding="async"
                    />
                    <div className={styles.iconBadge} aria-hidden="true">
                      {ICON_MAP[service.icon] || <FaBuilding />}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <span className={styles.serviceTag}>Engineering Discipline</span>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.cardDesc}>{service.shortDesc}</p>

                    {service.features && service.features.length > 0 && (
                      <ul className={styles.featuresList}>
                        {service.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx}>
                            <FaCheckCircle className={styles.checkIcon} aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className={styles.detailsBtn}>
                      <span>Explore Service</span>
                      <FaArrowRight className={styles.btnArrow} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}

            {/* High-Impact 6th CTA Card */}
            <article className={`${styles.cardItem} ${styles.specialCtaItem}`}>
              <Link 
                to="/contact" 
                className={styles.specialCtaCard}
                aria-label="Start your custom project with Nayaab Engineering"
              >
                <div className={styles.ctaCardDecor} aria-hidden="true">
                  <div className={styles.crosshairTop}>+</div>
                  <div className={styles.crosshairBottom}>+</div>
                  <div className={styles.glowingGridLayer} />
                </div>

                <div className={styles.specialCtaBody}>
                  <div className={styles.specialCtaTopRow}>
                    <span className={styles.specialCtaTag}>Direct Engagement</span>
                    <div className={styles.specialCtaIconBox}>
                      <FaHandshake />
                    </div>
                  </div>

                  <h3 className={styles.specialCtaTitle}>
                    Have a Custom Project in Mind?
                  </h3>

                  <p className={styles.specialCtaDesc}>
                    Collaborate directly with our licensed structural engineers and architects to transform your plans into functional, enduring realities.
                  </p>

                  <ul className={styles.specialCtaList}>
                    <li>
                      <FaCheckCircle className={styles.ctaCheckIcon} aria-hidden="true" />
                      <span>Complimentary Project Feasibility Review</span>
                    </li>
                    <li>
                      <FaCheckCircle className={styles.ctaCheckIcon} aria-hidden="true" />
                      <span>Parametric 3D Modelling &amp; Structural Load Audits</span>
                    </li>
                    <li>
                      <FaCheckCircle className={styles.ctaCheckIcon} aria-hidden="true" />
                      <span>Fast-Track Municipal Permissions &amp; BOQ Costing</span>
                    </li>
                  </ul>

                  <div className={styles.specialCtaActionBtn}>
                    <span>Initiate Consultation</span>
                    <FaArrowRight className={styles.specialCtaArrow} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}