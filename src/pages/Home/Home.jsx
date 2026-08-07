import React from "react";
import {
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
} from "react-icons/fa";
import Hero from "../../components/home/Hero";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import styles from "./Home.module.css";

const highlightItems = [
  {
    icon: <FaRegCalendarCheck className={styles.highlightIcon} />,
    title: "Est. 2022",
    subtitle: "Founded on Engineering Rigor",
  },
  {
    icon: <FaLayerGroup className={styles.highlightIcon} />,
    title: "Multi-Discipline",
    subtitle: "Architecture to Structural Design",
  },
  {
    icon: <FaProjectDiagram className={styles.highlightIcon} />,
    title: "End-to-End",
    subtitle: "Concept to Turnkey Delivery",
  },
  {
    icon: <FaAward className={styles.highlightIcon} />,
    title: "100%",
    subtitle: "Quality Commitment",
  },
];

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
            <FaDraftingCompass className={styles.serviceIcon} />
            <h3>Architectural Design</h3>
            <p>
              Residential, commercial and public building architectural
              planning &amp; design.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaBuilding className={styles.serviceIcon} />
            <h3>Structural Engineering</h3>
            <p>
              Structural engineering, supervision, estimation and technical
              consultancy.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaHardHat className={styles.serviceIcon} />
            <h3>Construction Management</h3>
            <p>
              End-to-end site supervision, scheduling, and quality-controlled
              execution.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaClipboardList className={styles.serviceIcon} />
            <h3>Engineering Consultancy</h3>
            <p>
              Technical advisory, feasibility studies, and compliance-driven
              consultancy.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaProjectDiagram className={styles.serviceIcon} />
            <h3>Project Planning</h3>
            <p>
              Detailed project scheduling, resource allocation, and risk
              management.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <FaKey className={styles.serviceIcon} />
            <h3>Turnkey Solutions</h3>
            <p>
              Turnkey construction projects with complete project management.
            </p>
          </div>
        </div>
      </section>

      {/* INFINITE AUTO-MOVING TICKER SECTION */}
      <section className={styles.tickerSection}>
        <div className={styles.tickerContainer}>
          <div className={styles.tickerTrack}>
            {/* Set 1 */}
            {highlightItems.map((item, index) => (
              <div className={styles.tickerItem} key={`ticker-1-${index}`}>
                {item.icon}
                <div className={styles.tickerContent}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span className={styles.tickerDot}>•</span>
              </div>
            ))}

            {/* Set 2 (Duplicated for seamless continuous loop) */}
            {highlightItems.map((item, index) => (
              <div className={styles.tickerItem} key={`ticker-2-${index}`}>
                {item.icon}
                <div className={styles.tickerContent}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span className={styles.tickerDot}>•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM DIRECTLY BELOW TICKER SECTION */}
      <ContactForm
        eyebrow="GET IN TOUCH"
        title="Let's talk"
        subtitle="To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly."
      />

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
    </>
  );
};

export default Home;