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
        {/* Zero-Font Dependency Vector Wordmark (Eliminates Font Swap/FOUT) */}
        <div className={styles.svgWrapper}>
          <svg
            viewBox="0 0 300 80"
            width="300"
            height="80"
            className={styles.vectorWordmark}
            aria-hidden="true"
          >
            <defs>
              <clipPath id="neiplWipeClip">
                <rect x="0" y="0" width="0" height="80">
                  <animate
                    attributeName="width"
                    values="0; 300"
                    dur="0.9s"
                    fill="freeze"
                    keyTimes="0; 1"
                    keySplines="0.25 0.1 0.25 1"
                    calcMode="spline"
                  />
                </rect>
              </clipPath>

              {/* Exact Condensed NEIPL Geometry Vector */}
              <path
                id="neiplVectorPath"
                fillRule="evenodd"
                d="M39,14 H53 L67,48 V14 H79 V66 H65 L51,32 V66 H39 Z M91,14 H129 V25 H105 V34 H125 V45 H105 V55 H129 V66 H91 Z M141,14 H155 V66 H141 Z M167,14 H196 C206,14 212,19 212,29 C212,39 206,44 196,44 H181 V66 H167 Z M181,24 H194 C198,24 200,26 200,29 C200,32 198,34 194,34 H181 Z M224,14 H238 V55 H262 V66 H224 Z"
              />
            </defs>

            {/* 1. Underlying Grey Vector Base */}
            <use
              href="#neiplVectorPath"
              className={styles.greyVector}
            />

            {/* 2. Overlaid Blue Vector (Revealed by Wipe Clip) */}
            <use
              href="#neiplVectorPath"
              className={styles.blueVector}
              clipPath="url(#neiplWipeClip)"
            />
          </svg>
        </div>

        <p className={styles.companyName}>
          Nayaab Engineering Innovations
        </p>

        {/* Synchronized Progress Track */}
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressBar} />
        </div>
      </div>
    </aside>
  );
}