import React, { useEffect, useRef } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Hero.module.css";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const VIDEO_SRC = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero.mp4";

const HeroContent = () => (
  <div className={styles.heroContent}>
    <div className={styles.textWrapper}>
      <p className={`${styles.greeting} ${styles.animateSlideLeft} ${styles.delay1}`}>
        NAYAAB <span className={styles.companySuffix}>Engineering</span>
      </p>
      <h1 className={`${styles.mainTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
        Engineering Excellence
        <br />
        &amp; Innovation
      </h1>
      <h2 className={`${styles.subTitle} ${styles.animateSlideLeft} ${styles.delay3}`}>
        Building the future with precision.
      </h2>

      <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay4}`}>
        <a href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
          Contact Us
        </a>
        <a href="/services" className={`${styles.btn} ${styles.btnOutline}`}>
          Our Services
        </a>
      </div>
    </div>
  </div>
);

const SocialLinks = () => (
  <div className={styles.socialLinks} aria-label="Social media links">
    {SOCIAL_LINKS.map((social) => (
      <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
        {social.icon}
      </a>
    ))}
  </div>
);

const AvailabilityCard = () => (
  <div className={styles.availabilityCard} role="status">
    <div className={styles.availabilityStatus}>
      <span className={styles.pulseDot} aria-hidden="true" />
      <span>Available for Work</span>
    </div>
    <p>
      Our website is currently under development. We're preparing an enhanced digital experience and will be launching soon.
    </p>
  </div>
);

const HeroFooter = () => (
  <div className={styles.heroFooter}>
    <div className={styles.footerLeft}>
      <SocialLinks />
    </div>
    <AvailabilityCard />
  </div>
);

const ScrollIndicator = () => (
  <div className={styles.scrollIndicator} aria-hidden="true">
    <div className={styles.scrollMouse}>
      <div className={styles.wheel} />
    </div>
  </div>
);

const VideoBackground = ({ videoRef }) => (
  <div className={styles.videoContainer}>
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>
    <div className={styles.videoOverlay} />
  </div>
);

const Hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set DOM properties to bypass Safari/iOS autoplay restrictions
    video.muted = true;
    video.defaultMuted = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Autoplay was prevented:", error);
      }
    };

    playVideo();
  }, []);

  return (
    <section className={styles.heroSection} aria-label="Hero">
      <VideoBackground videoRef={videoRef} />
      <HeroContent />
      <HeroFooter />
      <ScrollIndicator />
    </section>
  );
};

export default Hero;