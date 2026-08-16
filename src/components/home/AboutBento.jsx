// src/components/home/AboutBento.jsx
import React from "react";
import {
  FaSquare,
  FaMicrochip,
  FaAward,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import styles from "./AboutBento.module.css";

export default function AboutBento() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.splitHeaderContainer}>
        <div className={styles.splitHeaderLeft}>
          <div className={styles.sectionTagRow}>
            <FaSquare className={styles.tagSquareIcon} />
            <span>About Our Company</span>
          </div>
          <h2 className={styles.splitTitle}>Driven by Quality</h2>
        </div>

        <div className={styles.splitHeaderRight}>
          <p className={styles.splitDesc}>
            Bringing a hands-on, client-first approach to civil and architectural engineering.
            Incorporated in 2024 and headquartered in Baramulla, we combine formal corporate standards with regional expertise.
          </p>
        </div>
      </div>

      <div className={styles.bentoGrid}>
        <div className={`${styles.bentoCard} ${styles.cardLarge}`}>
          <img
            src="/logo.png"
            alt=""
            className={styles.cardWatermarkCenter}
            aria-hidden="true"
          />

          <div className={styles.cardContentRelative}>
            <div className={styles.brandHeader}>
              <span className={styles.brandName}>Nayaab Engineering</span>
            </div>
            <div className={styles.bigStatNum}>2024</div>
            <p className={styles.bentoText}>
              Incorporated as a Private Limited Engineering Company (CIN: U42900JK2024PTC015987 ) under RoC Jammu.
            </p>
            <div className={styles.avatarStack}>
              <div className={styles.avatar} title="Junaid Bilal Sheikh">J</div>
              <div className={styles.avatar} title="Aaqib Nazir Tantary">A</div>
              <div className={styles.avatar} title="Saajid Rashid Malik">S</div>
              <div className={styles.avatarPlus}>+</div>
            </div>
          </div>
        </div>

        <div className={styles.bentoStack}>
          <div className={styles.bentoCard}>
            <div className={styles.cardIconBox}>
              <FaMicrochip />
            </div>
            <h4 className={styles.cardSmallTitle}>Modern Technology</h4>
            <p className={styles.cardSmallDesc}>
              We integrate 3D CAD modeling, elevation renders, and structural engineering software for technical accuracy.
            </p>
          </div>

          <div className={styles.bentoCard}>
            <div className={styles.cardIconBox}>
              <FaAward />
            </div>
            <div className={styles.mediumStatNum}>DPIIT</div>
            <p className={styles.cardSmallDesc}>Recognized Startup in Construction &amp; Civil Engineering by Govt. of India.</p>
          </div>
        </div>

        <div className={styles.bentoStack}>
          <div className={styles.bentoCard}>
            <div className={styles.cardIconBox}>
              <FaCheckCircle />
            </div>
            <div className={styles.mediumStatNum}>100%</div>
            <p className={styles.cardSmallDesc}>Commitment to structural safety, material standards, and compliance.</p>
          </div>

          <div className={styles.bentoCard}>
            <div className={styles.cardIconBox}>
              <FaUsers />
            </div>
            <h4 className={styles.cardSmallTitle}>Experienced Leadership</h4>
            <p className={styles.cardSmallDesc}>
              Led by a board of three directors dedicated to advancing infrastructure and residential builds in J&amp;K.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}