import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "./Hero.module.css";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const DESKTOP_VIDEO_SRC = "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero.mp4";
const MOBILE_VIDEO_SRC = "/assets/home/hero-mobile.mp4";

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

const VideoBackground = ({ videoRef, videoSrc }) => (
  <div className={styles.videoContainer}>
    <video
      ref={videoRef}
      src={videoSrc}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
    {/* Dark Overlay active on both Mobile & Desktop */}
    <div className={styles.videoOverlay} />
  </div>
);

const Hero = () => {
  const videoRef = useRef(null);

  // Responsive video detection (Mobile <= 768px)
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  const activeVideoSrc = isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;

  // Autoplay video normally across all screens
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => console.warn("Video autoplay prevented:", err));
    }
  }, [activeVideoSrc]);

  return (
    <div className={styles.heroTrack}>
      <section className={styles.heroSection} aria-label="Hero">
        <VideoBackground videoRef={videoRef} videoSrc={activeVideoSrc} />
        <HeroContent />
        <HeroFooter />
        <ScrollIndicator />
      </section>
    </div>
  );
};

export default Hero;