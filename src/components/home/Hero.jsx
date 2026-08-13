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

const VideoBackground = ({ videoRef, videoSrc, isMobile }) => (
  <div className={styles.videoContainer}>
    <video
      ref={videoRef}
      src={videoSrc}
      muted
      playsInline
      autoPlay={!isMobile}
      loop={!isMobile}
      preload="auto"
      aria-hidden="true"
    />
    {/* Dark Overlay for Desktop Text Contrast */}
    <div className={styles.videoOverlay} />
  </div>
);

const Hero = () => {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const rafIdRef = useRef(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

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

  // DESKTOP EFFECT: Autoplay standard looping video
  useEffect(() => {
    if (isMobile) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => console.warn("Desktop video autoplay:", err));
    }
  }, [isMobile, activeVideoSrc]);

  // MOBILE EFFECT: Scroll-controlled timeline scrubbing
  useEffect(() => {
    if (!isMobile) return;

    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track) return;

    video.pause();
    video.muted = true;
    video.loop = false;

    const renderFrame = () => {
      if (!video.duration || isNaN(video.duration)) return;

      if (!isSeekingRef.current) {
        const targetTime = targetTimeRef.current;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          isSeekingRef.current = true;
          video.currentTime = targetTime;
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
        renderFrame();
      }
    };

    const handleScroll = () => {
      const rect = track.getBoundingClientRect();
      const trackHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const totalDistance = trackHeight - viewportHeight;

      if (totalDistance <= 0) return;

      const scrollOffset = -rect.top;
      const progress = Math.max(0, Math.min(1, scrollOffset / totalDistance));

      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = progress * video.duration;
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            renderFrame();
            rafIdRef.current = null;
          });
        }
      }
    };

    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    if (video.readyState >= 1) {
      handleScroll();
    } else {
      video.addEventListener("loadedmetadata", handleScroll, { once: true });
    }

    return () => {
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isMobile, activeVideoSrc]);

  return (
    <div className={styles.heroTrack} ref={trackRef}>
      <section className={styles.heroSection} aria-label="Hero">
        <VideoBackground videoRef={videoRef} videoSrc={activeVideoSrc} isMobile={isMobile} />
        <HeroContent />
        <HeroFooter />
        <ScrollIndicator />
      </section>
    </div>
  );
};

export default Hero;