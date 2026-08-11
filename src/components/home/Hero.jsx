import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Hero.module.css";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const VIDEO_SRC = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero.mp4";

// Refined Agency-Grade Text Reveal (Matching site typography)
const EyebrowTagline = () => {
  const [text, setText] = useState("");
  const fullText = "NAYAAB ENGINEERING";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.eyebrowWrapper}>
      <span className={styles.eyebrowDot} />
      <span className={styles.eyebrowText}>{text}</span>
    </div>
  );
};

const HeroContent = () => (
  <div className={styles.heroContent}>
    <div className={styles.textWrapper}>
      <EyebrowTagline />

      <h1 className={`${styles.mainTitle} ${styles.animateSlideLeft} ${styles.delay1}`}>
        Engineering Excellence
        <br />
        &amp; Innovation
      </h1>

      <h2 className={`${styles.subTitle} ${styles.animateSlideLeft} ${styles.delay2}`}>
        Building the future with precision.
      </h2>

      <div className={`${styles.ctaGroup} ${styles.animateSlideLeft} ${styles.delay3}`}>
        <a href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
          <span>Contact Us</span>
        </a>
        <a href="/services" className={`${styles.btn} ${styles.btnOutline}`}>
          <span>Our Services</span>
        </a>
      </div>
    </div>
  </div>
);

const SocialLinks = () => (
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
);

const HeroFooter = () => (
  <div className={styles.heroFooter}>
    <div className={styles.footerLeft}>
      <SocialLinks />
    </div>
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