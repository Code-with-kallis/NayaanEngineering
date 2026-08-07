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
      <p className={`${styles.greeting} ${styles.animateFadeUp} ${styles.delay1}`}>
        NAYAAB <span className={styles.companySuffix}>Engineering</span>
      </p>
      <h1 className={`${styles.mainTitle} ${styles.animateFadeUp} ${styles.delay2}`}>
        Engineering Excellence
        <br />
        &amp; Innovation
      </h1>
      <h2 className={`${styles.subTitle} ${styles.animateFadeUp} ${styles.delay3}`}>
        Building the future with precision.
      </h2>

      <div className={`${styles.ctaGroup} ${styles.animateFadeUp} ${styles.delay4}`}>
        <a href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
          Contact Us
        </a>
        <a
          href="https://maps.app.goo.gl/2eVktdmG7WoQGscE6"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.btnOutline}`}
        >
          Our Location
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
    <video ref={videoRef} muted playsInline aria-hidden="true">
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

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Autoplay was prevented:", error);
      }
    };

    playVideo();

    const handleEnded = () => {
      console.log("Hero background video reached its last frame.");
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
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