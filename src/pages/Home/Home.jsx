import React from "react";
import {
  FaEnvelope,
  FaDraftingCompass,
  FaBuilding,
  FaHardHat,
  FaClipboardList,
  FaProjectDiagram,
  FaKey,
  FaUsers,
  FaLightbulb,
  FaClock,
  FaShieldAlt,
  FaSmile,
  FaBullseye,
  FaEye,
  FaCheckCircle,
  FaLayerGroup,
  FaAward,
  FaRegCalendarCheck,
  FaWhatsapp,
} from "react-icons/fa";
import Hero from "../../components/home/Hero";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <Hero />

      <section className={styles.aboutPreview}>
        <div className={styles.sectionTitle}>
          <span>WHO WE ARE</span>
          <h2>Engineering Excellence, Built on Trust</h2>
          <p>
            Established in 2022, Nayaab Engineering Innovations Pvt. Ltd.
            specializes in architecture, engineering consultancy, construction
            management, and turnkey infrastructure projects.
          </p>
        </div>

        <div className={styles.aboutGrid}>
          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>
              <FaBullseye />
            </div>
            <h3>Our Mission</h3>
            <p>
              Delivering reliable, innovative, and sustainable engineering
              solutions for residential, commercial, and public infrastructure
              projects.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>
              <FaEye />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become a benchmark engineering firm known for precision,
              integrity, and future-ready infrastructure across the region.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>
              <FaCheckCircle />
            </div>
            <h3>Why Choose Us</h3>
            <p>
              A dedicated team combining technical expertise with a client-first
              approach, ensuring every project meets the highest engineering
              standards.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.servicesPreview}>
        <div className={styles.sectionTitle}>
          <span>WHAT WE DO</span>
          <h2>Our Core Services</h2>
          <p>
            End-to-end engineering and construction solutions, tailored to
            residential, commercial, and public infrastructure needs.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <FaDraftingCompass />
            <h3>Architectural Design</h3>
            <p>
              Residential, commercial and public building architectural
              planning &amp; design.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaBuilding />
            <h3>Structural Engineering</h3>
            <p>
              Structural engineering, supervision, estimation and technical
              consultancy.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaHardHat />
            <h3>Construction Management</h3>
            <p>
              End-to-end site supervision, scheduling, and quality-controlled
              execution.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaClipboardList />
            <h3>Engineering Consultancy</h3>
            <p>
              Technical advisory, feasibility studies, and compliance-driven
              consultancy.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaProjectDiagram />
            <h3>Project Planning</h3>
            <p>
              Detailed project scheduling, resource allocation, and risk
              management.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaKey />
            <h3>Turnkey Solutions</h3>
            <p>
              Turnkey construction projects with complete project management.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.highlights}>
        <div className={styles.sectionTitle}>
          <span>OUR FOUNDATION</span>
          <h2>Engineered for the Long Term</h2>
        </div>

        <div className={styles.highlightsGrid}>
          <div className={styles.highlightCard}>
            <FaRegCalendarCheck className={styles.highlightIcon} />
            <h3>Est. 2022</h3>
            <p>Founded on Engineering Rigor</p>
          </div>
          <div className={styles.highlightCard}>
            <FaLayerGroup className={styles.highlightIcon} />
            <h3>Multi-Discipline</h3>
            <p>Architecture to Structural Design</p>
          </div>
          <div className={styles.highlightCard}>
            <FaProjectDiagram className={styles.highlightIcon} />
            <h3>End-to-End</h3>
            <p>Concept to Turnkey Delivery</p>
          </div>
          <div className={styles.highlightCard}>
            <FaAward className={styles.highlightIcon} />
            <h3>100%</h3>
            <p>Quality Commitment</p>
          </div>
        </div>
      </section>

      <section className={styles.whyChoose}>
        <div className={styles.sectionTitle}>
          <span>OUR STRENGTH</span>
          <h2>Why Clients Choose Nayaab Engineering</h2>
        </div>

        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <FaUsers className={styles.whyIcon} />
            <h3>Experienced Team</h3>
            <p>
              Skilled engineers and architects with hands-on project expertise.
            </p>
          </div>

          <div className={styles.whyCard}>
            <FaLightbulb className={styles.whyIcon} />
            <h3>Innovative Design</h3>
            <p>
              Modern, functional, and sustainable design approaches for every
              project.
            </p>
          </div>

          <div className={styles.whyCard}>
            <FaClock className={styles.whyIcon} />
            <h3>Timely Delivery</h3>
            <p>
              Disciplined project timelines with proactive schedule management.
            </p>
          </div>

          <div className={styles.whyCard}>
            <FaShieldAlt className={styles.whyIcon} />
            <h3>Quality Assurance</h3>
            <p>
              Rigorous quality checks at every stage of design and construction.
            </p>
          </div>

          <div className={styles.whyCard}>
            <FaSmile className={styles.whyIcon} />
            <h3>Client Satisfaction</h3>
            <p>
              Transparent communication and a client-first execution philosophy.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaPattern} />
        <div className={styles.ctaContent}>
          <span className={styles.ctaTag}>COMING SOON</span>
          <h2>Our complete corporate website is currently under development.</h2>
          <p>We look forward to serving you soon.</p>
          <div className={styles.ctaButtons}>
            <a
              href="https://wa.me/919858765435"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.primaryBtn} ${styles.whatsappBtn}`}
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
            <a
              href="mailto:info@nayaabengineering.com"
              className={styles.secondaryBtn}
            >
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;