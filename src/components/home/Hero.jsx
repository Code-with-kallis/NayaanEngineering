// src/components/home/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../common/PageHero/PageHero";
import heroDesktop from "../../assets/images/home/hero-desktop.webp";
import heroMobile from "../../assets/images/home/hero-mobile.webp";
import heroStyles from "../common/PageHero/PageHero.module.css";

export default function Hero() {
  return (
    <PageHero
      desktopImage={heroDesktop}
      mobileImage={heroMobile}
      imageAlt="Nayaab Engineering Hero"
      variant="home"
      showSocials={true}
      showScrollIndicator={true}
      eyebrow={
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            }}
          />
          <span
            style={{
              fontSize: "0.775rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#D4D4D8",
              textTransform: "uppercase",
            }}
          >
            NAYAAB ENGINEERING
          </span>
        </div>
      }
      title="Engineering Excellence"
      titleHighlight="& Innovation"
      subtitle="Building the future with precision."
      actions={
        <>
          <Link to="/contact" className={heroStyles.btnPrimary}>
            <span>Get Started</span>
          </Link>
          <Link to="/services" className={heroStyles.btnOutline}>
            <span>Our Services</span>
          </Link>
        </>
      }
    />
  );
}