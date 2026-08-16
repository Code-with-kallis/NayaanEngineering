// src/components/home/GoogleReviews.jsx
import React, { useEffect } from "react";
import styles from "./GoogleReviews.module.css";

export default function GoogleReviews() {
  useEffect(() => {
    // 1. Remove old script instance if present
    const existingScript = document.getElementById("featurable-embed-script");
    if (existingScript) existingScript.remove();

    // 2. Inject fresh Featurable embed script
    const script = document.createElement("script");
    script.id = "featurable-embed-script";
    script.src = "https://cdn.featurable.com/widget/v2/embed.js";
    script.defer = true;
    script.setAttribute("charset", "UTF-8");

    script.onload = () => {
      if (window.Featurable && typeof window.Featurable.init === "function") {
        window.Featurable.init();
      }
    };

    document.body.appendChild(script);

    // 3. Re-trigger if script is already cached
    if (window.Featurable && typeof window.Featurable.init === "function") {
      window.Featurable.init();
    }

    return () => {
      const scriptToRemove = document.getElementById("featurable-embed-script");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <section className={styles.reviewSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.googleBrandTitle}>
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
            <span className={styles.reviewsWord}>Reviews</span>
          </h2>
          <p className={styles.subtitle}>
            Verified feedback and ratings directly from our Google Business profile.
          </p>
        </div>

        <div className={styles.widgetWrapper}>
          <div
            id="featurable-f8f40764-abc9-4443-9e45-277e12fac031"
            data-featurable-async
          />
        </div>
      </div>
    </section>
  );
}