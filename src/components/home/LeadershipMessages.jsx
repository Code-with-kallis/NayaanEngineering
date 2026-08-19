import React, { useState } from "react";
import { FaSquare, FaQuoteLeft, FaChevronDown, FaInstagram } from "react-icons/fa";
import ceoImg from "../../assets/images/team/neipl-0104.png";
import techImg from "../../assets/images/team/neipl-0103.png";
import opsImg from "../../assets/images/team/neipl-0102.png";
import styles from "./LeadershipMessages.module.css";

const leadershipData = [
  {
    id: "ceo",
    name: "Junaid Bilal Sheikh",
    role: "Chief Executive Officer (CEO)",
    image: ceoImg,
    instagramUrl: "https://www.instagram.com/_junaid99/?hl=en",
    badge: "Executive Vision",
    salutation: "Dear Valued Clients, Partners, and Stakeholders,",
    excerpt:
      "At Nayaab Engineering Innovations Pvt. Ltd., our vision is to build an organization recognized for excellence, innovation, and integrity. We are committed to delivering engineering, construction, and architectural solutions that create lasting value while meeting the highest standards of quality and professionalism.",
    fullMessage: [
      "At Nayaab Engineering Innovations Pvt. Ltd., our vision is to build an organization recognized for excellence, innovation, and integrity. We are committed to delivering engineering, construction, and architectural solutions that create lasting value while meeting the highest standards of quality and professionalism.",
      "Our success is driven by a dedicated team of professionals who share a passion for innovation, collaboration, and continuous improvement. By combining technical expertise with modern technologies and efficient project management, we ensure that every project is executed with precision, transparency, and accountability.",
      "As we continue to grow, our focus remains on building long-term relationships based on trust, delivering exceptional client experiences, and contributing to sustainable development. We view every project as an opportunity to exceed expectations and make a meaningful impact on the communities we serve.",
      "On behalf of the entire Nayaab Engineering Innovations family, I thank our clients, partners, and stakeholders for their continued confidence and support. We look forward to working with you and building a future defined by excellence, innovation, and shared success.",
    ],
  },
  {
    id: "tech-director",
    name: "Er. Aaqib Nazir Tantary",
    role: "Director – Engineering & Technical Operations",
    image: techImg,
    instagramUrl: "https://www.instagram.com/aaqibtantray/?hl=en",
    badge: "Technical Operations",
    salutation: "Dear Clients and Partners,",
    excerpt:
      "Engineering is the foundation of every successful project. Our commitment is to deliver technically sound, innovative, and practical solutions that ensure safety, efficiency, and long-term performance. Every design and engineering decision we make is guided by accuracy, compliance with applicable standards, and a focus on delivering value to our clients.",
    fullMessage: [
      "Welcome to Nayaab Engineering Innovations Pvt. Ltd.",
      "Engineering is the foundation of every successful project. Our commitment is to deliver technically sound, innovative, and practical solutions that ensure safety, efficiency, and long-term performance. Every design and engineering decision we make is guided by accuracy, compliance with applicable standards, and a focus on delivering value to our clients.",
      "Our technical team integrates modern engineering practices, advanced design tools, and detailed analysis to develop solutions tailored to the unique requirements of each project. From feasibility studies and planning to structural design, technical coordination, and project support, we maintain the highest standards of quality and professionalism.",
      "Innovation and continuous improvement remain central to our approach. By embracing emerging technologies and sustainable engineering practices, we strive to create infrastructure and buildings that are resilient, efficient, and future-ready.",
      "We value the trust our clients place in us and remain committed to providing reliable technical expertise, transparent communication, and engineering excellence throughout every stage of a project.",
      "Thank you for choosing Nayaab Engineering Innovations Pvt. Ltd. We look forward to transforming your vision into technically sound and enduring realities.",
    ],
  },
  {
    id: "ops-director",
    name: "Er. Saajid Rashid Malik",
    role: "Director – Construction & Site Operations",
    image: opsImg,
    instagramUrl: "https://www.instagram.com/saajid_malik/?hl=en",
    badge: "Site & Execution",
    salutation: "Dear Clients and Partners,",
    excerpt:
      "At Nayaab Engineering Innovations Pvt. Ltd., we understand that exceptional construction is built on meticulous planning, disciplined execution, and uncompromising quality. Our responsibility is to ensure that every project is delivered with precision, safety, and efficiency while meeting the highest engineering standards.",
    fullMessage: [
      "At Nayaab Engineering Innovations Pvt. Ltd., we understand that exceptional construction is built on meticulous planning, disciplined execution, and uncompromising quality. Our responsibility is to ensure that every project is delivered with precision, safety, and efficiency while meeting the highest engineering standards.",
      "From site preparation to project completion, our construction team focuses on quality workmanship, timely execution, effective resource management, and strict adherence to safety practices. Every stage of construction is carefully monitored to ensure that the final outcome reflects our commitment to excellence.",
      "We believe that clear communication, transparency, and accountability are essential to the success of every project. By working closely with our clients, consultants, and project teams, we ensure that expectations are met and challenges are addressed proactively.",
      "Our goal is not only to construct buildings but to deliver durable, sustainable, and high-quality developments that stand the test of time.",
      "Thank you for placing your trust in Nayaab Engineering Innovations Pvt. Ltd. We remain committed to delivering projects that exceed expectations and create lasting value.",
    ],
  },
];

export default function LeadershipMessages() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.leadershipSection} aria-labelledby="leadership-title">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.splitHeaderContainer}>
          <div className={styles.splitHeaderLeft}>
            <div className={styles.sectionTagRow}>
              <FaSquare className={styles.tagSquareIcon} aria-hidden="true" />
              <span>Leadership Perspective</span>
            </div>
            <h2 id="leadership-title" className={styles.splitTitle}>
              Guiding Principles <span className={styles.titleGrey}>&amp; Vision</span>
            </h2>
          </div>

          <div className={styles.splitHeaderRight}>
            <p className={styles.splitDesc}>
              Direct commitments from our executive leadership on engineering accuracy, disciplined site execution, and client trust.
            </p>
          </div>
        </div>

        {/* 3-Column Message Cards */}
        <div className={styles.messageGrid}>
          {leadershipData.map((item) => {
            const isExpanded = expandedCard === item.id;

            return (
              <article
                key={item.id}
                className={`${styles.messageCard} ${isExpanded ? styles.cardActive : ""}`}
                onClick={() => toggleExpand(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(item.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                {/* TOP HEADER: Avatar with Profile Badge + Name/Role + Mustard Quote Box */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerLeft}>
                    <div className={styles.avatarContainer}>
                      <div className={styles.avatar}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className={styles.avatarImg}
                          loading="lazy"
                        />
                      </div>
                      {item.instagramUrl && (
                        <a
                          href={item.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.instagramBadge}
                          title={`Follow ${item.name} on Instagram`}
                          aria-label={`${item.name} Instagram profile`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaInstagram className={styles.instagramIcon} />
                        </a>
                      )}
                    </div>

                    <div className={styles.authorInfo}>
                      <h3 className={styles.authorName}>{item.name}</h3>
                      <p className={styles.authorRole}>{item.role}</p>
                    </div>
                  </div>

                  <div className={styles.quoteIconBox} aria-hidden="true">
                    <FaQuoteLeft />
                  </div>
                </div>

                {/* BADGE ROW */}
                <div className={styles.badgeRow}>
                  <span className={styles.badgePill}>{item.badge}</span>
                </div>

                {/* BODY CONTENT */}
                <div className={styles.messageBody}>
                  <p className={styles.salutationText}>{item.salutation}</p>

                  {!isExpanded ? (
                    <p className={styles.excerptText}>{item.excerpt}</p>
                  ) : (
                    <div className={styles.fullTextBlock}>
                      {item.fullMessage.map((p, idx) => (
                        <p key={idx} className={styles.fullParagraph}>
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER TOGGLE BUTTON */}
                <div className={styles.cardFooter}>
                  <span className={styles.expandBtn}>
                    <span>{isExpanded ? "Show Less" : "Read Full Message"}</span>
                    <FaChevronDown
                      className={`${styles.chevron} ${isExpanded ? styles.chevronRotated : ""}`}
                    />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}