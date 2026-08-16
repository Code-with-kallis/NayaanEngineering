// src/components/home/GoogleReviews.jsx
import React, { useEffect } from "react";
import styles from "./GoogleReviews.module.css";

export default function GoogleReviews() {
  useEffect(() => {
    const existingScript = document.getElementById("featurable-embed-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "featurable-embed-script";
    script.src = "https://cdn.featurable.com/widget/v2/embed.js";
    script.defer = true;
    script.setAttribute("charset", "UTF-8");
    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("featurable-embed-script");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  return (
    <section className={styles.reviewSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>CLIENT REVIEWS</span>
          <h2 className={styles.title}>What Our Clients Say</h2>
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