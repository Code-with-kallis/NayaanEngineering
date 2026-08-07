import React, { useEffect, useRef } from "react";
import "./Hero.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa"; // Import Facebook and Instagram icons

// Social media links for Nayaab Engineering, using links found in Contact.jsx
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/nayaabengineering/", icon: <FaFacebookF /> },
  { label: "Instagram", href: "https://www.instagram.com/nayaabengineering/", icon: <FaInstagram /> },
];

const VIDEO_SRC =
  "https://pub-f8277810f5c0469e9869821a16f1ea76.r2.dev/HOME/hero.mp4";

const HeroContent = () => (
  <div className="hero-content">
    <div className="text-wrapper">
      <p className="greeting animate-fade-up delay-1">
        NAYAAB
        <span className="company-suffix">Engineering</span>
      </p>
      <h1 className="main-title animate-fade-up delay-2">
        Engineering Excellence
        <br />
        &amp; Innovation
      </h1>
      <h2 className="sub-title animate-fade-up delay-3">
        Building the future with precision.
      </h2>

      <div className="cta-group animate-fade-up delay-4">
        <a href="/contact" className="btn btn-primary">
          Contact Us
        </a>
        <a href="https://maps.app.goo.gl/2eVktdmG7WoQGscE6" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Our Location
        </a>
      </div>
    </div>
  </div>
);

const SocialLinks = () => (
  <div className="social-links" aria-label="Social media links">
    {SOCIAL_LINKS.map((social) => (
      <a key={social.label} href={social.href} aria-label={social.label}>
        {social.icon}
      </a>
    ))}
  </div>
);

const AvailabilityCard = () => (
  <div className="availability-card" role="status">
    <div className="availability-status">
      <span className="pulse-dot" aria-hidden="true" />
      <span>Available for Work</span>
    </div>
    <p>
      Our website is currently under development. We're preparing an enhanced digital experience and will be launching soon.
    </p>
  </div>
);

const HeroFooter = () => (
  <div className="hero-footer">
    <div className="footer-left">
      <SocialLinks />
    </div>
    <AvailabilityCard />
  </div>
);

const ScrollIndicator = () => (
  <div className="scroll-indicator" aria-hidden="true">
    <div className="scroll-mouse">
      <div className="wheel" />
    </div>
  </div>
);

const VideoBackground = ({ videoRef }) => (
  <div className="video-container">
    <video ref={videoRef} muted playsInline aria-hidden="true">
      <source src={VIDEO_SRC} type="video/webm" />
    </video>
    <div className="video-overlay" />
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
    <section className="hero-section" aria-label="Hero">
      <VideoBackground videoRef={videoRef} />
      <HeroContent />
      <HeroFooter />
      <ScrollIndicator />
    </section>
  );
};

export default Hero;