// src/components/home/Hero.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../common/PageHero/PageHero";
import ContactModal from "../common/ContactModal/ContactModal";
import heroDesktop from "../../assets/images/home/hero-desktop.webp";
import heroMobile from "../../assets/images/home/hero-mobile.webp";
import heroStyles from "../common/PageHero/PageHero.module.css";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
                background: "#FFBB0F",
                boxShadow: "0 0 10px rgba(255, 187, 15, 0.8)",
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
            {/* Opens the Contact / Consultation Modal */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={heroStyles.btnPrimary}
            >
              <span>Get Started</span>
            </button>

            <Link to="/services" className={heroStyles.btnOutline}>
              <span>Our Services</span>
            </Link>
          </>
        }
      />

      {/* Global Consultation Modal Popup */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialService="Turnkey Construction"
      />
    </>
  );
}