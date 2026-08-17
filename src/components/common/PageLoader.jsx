import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <aside
      className={styles.loaderBackdrop}
      role="status"
      aria-live="polite"
      aria-label="Loading Application"
    >
      <div className={styles.loaderCard}>
        {/* Hardware-Accelerated Vector Wipe */}
        <div className={styles.svgWrapper}>
          <svg
            viewBox="0 0 320 90"
            className={styles.vectorWordmark}
            aria-hidden="true"
          >
            <defs>
              {/* Single complete smooth wipe from 0 to 100% */}
              <clipPath id="neiplWipe">
                <rect x="0" y="0" width="0" height="90">
                  <animate
                    attributeName="width"
                    values="0; 320"
                    dur="0.8s"
                    fill="freeze"
                    keyTimes="0; 1"
                    keySplines="0.25 0.1 0.25 1"
                    calcMode="spline"
                  />
                </rect>
              </clipPath>
            </defs>

            {/* 1. Underlying Grey Base Text */}
            <text
              x="50%"
              y="68"
              textAnchor="middle"
              className={styles.greyText}
            >
              NEIPL
            </text>

            {/* 2. Overlaid Blue Text (Revealed by SMIL ClipPath) */}
            <text
              x="50%"
              y="68"
              textAnchor="middle"
              className={styles.blueText}
              clipPath="url(#neiplWipe)"
            >
              NEIPL
            </text>
          </svg>
        </div>

        <p className={styles.companyName}>
          Nayaab Engineering Innovations
        </p>

        {/* Synchronized Vector Progress Line */}
        <div className={styles.progressWrapper} aria-hidden="true">
          <svg viewBox="0 0 160 4" className={styles.progressSvg}>
            {/* Background Line */}
            <rect x="0" y="0" width="160" height="4" rx="2" fill="#E2E8F0" />

            {/* Blue Sliding Line */}
            <rect x="0" y="0" width="0" height="4" rx="2" fill="#0099FF">
              <animate
                attributeName="width"
                values="0; 160"
                dur="0.8s"
                fill="freeze"
                keyTimes="0; 1"
                keySplines="0.25 0.1 0.25 1"
                calcMode="spline"
              />
            </rect>
          </svg>
        </div>
      </div>
    </aside>
  );
}