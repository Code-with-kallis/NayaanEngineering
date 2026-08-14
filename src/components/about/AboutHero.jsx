import React, { useEffect, useState, useRef } from "react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaChevronLeft, 
  FaChevronRight, 
  FaRegDotCircle,
  FaMapMarkerAlt,
  FaAward
} from "react-icons/fa";
import styles from "./AboutHero.module.css";
import logo from "/logo-original.png";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const DEFAULT_GALLERY_IMAGES = [
  "assets/team/junaid.jpg",
  "assets/team/sajid.jpeg",
  
];

const EyebrowTagline = ({ textToType = "ABOUT NAYAAB ENGINEERING" }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= textToType.length) {
        setText(textToType.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [textToType]);

  return (
    <div className={styles.eyebrowWrapper}>
      <span className={styles.eyebrowText}>{text}</span>
    </div>
  );
};

const AboutHero = ({
  eyebrow = "ABOUT NAYAAB ENGINEERING",
  title = (
    <>
      Engineering What Comes
      <br />
      Next in J&amp;K
    </>
  ),
  subtitle = "Nayaab Engineering Innovations Pvt. Ltd. combines formal corporate standards with startup agility to deliver civil construction, structural engineering, and technical design across Jammu & Kashmir.",
  galleryImages = DEFAULT_GALLERY_IMAGES,
  primaryAction = { href: "/contact", label: "Start a Project" },
  secondaryAction = { href: "#corporate-profile", label: "Company Profile" },
  stats = [
    { value: "2024", label: "Founded in Baramulla" },
    { value: "DPIIT", label: "Recognized Startup" },
    { value: "11+", label: "In-House Specialists" },
  ],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch Swipe Tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 45; // Minimum px distance to trigger swipe

  // Autoplay
  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1) return;

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);

    return () => clearInterval(slideTimer);
  }, [galleryImages]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  // Touch Handlers for Mobile Swipe
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
      // Swiped Left -> Next Image
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      handlePrevSlide();
    }
  };

  return (
    <section className={styles.heroSection} aria-label="About Hero">
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP HERO MEDIA: Clean image with touch swipe (NO TEXT)          */}
      {/* ========================================================================= */}
      <div 
        className={styles.mobileHeroMedia}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {galleryImages.map((imgObj, idx) => {
          const imgSrc = typeof imgObj === "string" ? imgObj : imgObj.url;
          return (
            <div
              key={imgSrc + idx}
              className={`${styles.mobileSlide} ${
                idx === currentSlide ? styles.mobileSlideActive : ""
              }`}
              style={{ backgroundImage: `url(${imgSrc})` }}
            />
          );
        })}

        {/* Minimal slide pagination indicator dots */}
        {galleryImages.length > 1 && (
          <div className={styles.mobileDotsContainer}>
            {galleryImages.map((_, dotIdx) => (
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TEXT CONTENT & BUTTONS                                                 */}
      {/* ========================================================================= */}
      <div className={styles.leftColumn}>
        <div className={styles.textWrapper}>
          <EyebrowTagline textToType={eyebrow} />

          <h1 className={`${styles.mainTitle} ${styles.animateSlideLeft} ${styles.delay1}`}>
            {title}
          </h1>

          <p className={`${styles.subTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
            {subtitle}
          </p>

          <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay3}`}>
            {primaryAction && (
              <a href={primaryAction.href} className={`${styles.btn} ${styles.btnPrimary}`}>
                <span>{primaryAction.label}</span>
              </a>
            )}
            {secondaryAction && (
              <a href={secondaryAction.href} className={`${styles.btn} ${styles.btnOutline}`}>
                <span>{secondaryAction.label}</span>
              </a>
            )}
          </div>
        </div>

        {/* Desktop Left Footer Stats */}
        <div className={styles.desktopLeftFooter}>
          {stats && stats.length > 0 ? (
            <div className={styles.statsGroup}>
              {stats.map((stat, i) => (
                <div key={stat.label + i} className={styles.statItem}>
                  <div className={styles.statHeader}>
                    <FaRegDotCircle className={styles.statDot} />
                    <span className={styles.statNumber}>{stat.value}</span>
                  </div>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.socialLinks} aria-label="Social media links">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DESKTOP ONLY: Right Column Cut-Shape Gallery                           */}
      {/* ========================================================================= */}
      <div className={styles.rightColumn}>
        <div className={styles.topTypographyHeader}>
          <div className={styles.headerRowMain}>
            <div className={styles.brandGroup}>
              <img src={logo} alt="NEIPL Logo" className={styles.neiplLogoImg} />
              <span className={styles.neiplTitleText}>NEIPL</span>
            </div>
            <div className={styles.categoryTag}>
              <FaAward className={styles.tagIcon} />
              <span>CIVIL &amp; STRUCTURAL ENGINEERING</span>
            </div>
          </div>

          <div className={styles.headerRowSub}>
            <span className={styles.neiplFullName}>
              NAYAAB ENGINEERING INNOVATIONS PVT LTD
            </span>
            <span className={styles.neiplLocation}>
              <FaMapMarkerAlt /> BARAMULLA, J&amp;K
            </span>
          </div>
        </div>

        <div className={styles.galleryCard}>
          <div className={styles.gallerySlider}>
            {galleryImages.map((imgObj, idx) => {
              const imgSrc = typeof imgObj === "string" ? imgObj : imgObj.url;
              return (
                <div
                  key={imgSrc + idx}
                  className={`${styles.slide} ${
                    idx === currentSlide ? styles.slideActive : ""
                  }`}
                  style={{ backgroundImage: `url(${imgSrc})` }}
                />
              );
            })}

            <div className={styles.slideBottomShadow} />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowLeft}`}
                  onClick={handlePrevSlide}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowRight}`}
                  onClick={handleNextSlide}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>

                <div className={styles.counterBar}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{
                        width: `${((currentSlide + 1) / galleryImages.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={styles.counterText}>
                    0{currentSlide + 1} <small>/ 0{galleryImages.length}</small>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE STATS BAR                                                       */}
      {/* ========================================================================= */}
      <div className={styles.mobileHeroFooter}>
        {stats && stats.length > 0 && (
          <div className={styles.mobileStatsGroup}>
            {stats.map((stat, i) => (
              <div key={stat.label + i} className={styles.mobileStatItem}>
                <div className={styles.mobileStatHeader}>
                  <FaRegDotCircle className={styles.statDot} />
                  <span className={styles.mobileStatNumber}>{stat.value}</span>
                </div>
                <span className={styles.mobileStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutHero;