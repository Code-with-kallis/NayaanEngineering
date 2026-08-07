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
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"; // Keep FaWhatsapp for the CTA section
import Hero from "../../components/home/Hero";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Hero />

      <section className="about-preview">
        <div className="home-section-container">
          <div className="section-title">
            <span>WHO WE ARE</span>
            <h2>Engineering Excellence, Built on Trust</h2>
            <p>
              Established in 2022, Nayaab Engineering Innovations Pvt. Ltd.
              specializes in architecture, engineering consultancy, construction
              management, and turnkey infrastructure projects.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">
                <FaBullseye />
              </div>
              <h3>Our Mission</h3>
              <p>
                Delivering reliable, innovative, and sustainable engineering
                solutions for residential, commercial, and public infrastructure
                projects.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon">
                <FaEye />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become a benchmark engineering firm known for precision,
                integrity, and future-ready infrastructure across the region.
              </p>
            </div>

            <div className="about-card">
              <div className="about-icon">
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
        </div>
      </section>

      <section className="services-preview">
        <div className="home-section-container">
          <div className="section-title">
            <span>WHAT WE DO</span>
            <h2>Our Core Services</h2>
            <p>
              End-to-end engineering and construction solutions, tailored to
              residential, commercial, and public infrastructure needs.
            </p>
          </div>

          <div className="service-grid">
            <div className="service-card">
              <FaDraftingCompass />
              <h3>Architectural Design</h3>
              <p>
                Residential, commercial and public building architectural
                planning &amp; design.
              </p>
            </div>

            <div className="service-card">
              <FaBuilding />
              <h3>Structural Engineering</h3>
              <p>
                Structural engineering, supervision, estimation and technical
                consultancy.
              </p>
            </div>

            <div className="service-card">
              <FaHardHat />
              <h3>Construction Management</h3>
              <p>
                End-to-end site supervision, scheduling, and quality-controlled
                execution.
              </p>
            </div>

            <div className="service-card">
              <FaClipboardList />
              <h3>Engineering Consultancy</h3>
              <p>
                Technical advisory, feasibility studies, and compliance-driven
                consultancy.
              </p>
            </div>

            <div className="service-card">
              <FaProjectDiagram />
              <h3>Project Planning</h3>
              <p>
                Detailed project scheduling, resource allocation, and risk
                management.
              </p>
            </div>

            <div className="service-card">
              <FaKey />
              <h3>Turnkey Solutions</h3>
              <p>
                Turnkey construction projects with complete project management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="home-section-container">
          <div className="section-title">
            <span>OUR FOUNDATION</span>
            <h2>Engineered for the Long Term</h2>
          </div>

          <div className="highlights-grid">
            <div className="highlight-card">
              <FaRegCalendarCheck className="highlight-icon" />
              <h3>Est. 2022</h3>
              <p>Founded on Engineering Rigor</p>
            </div>
            <div className="highlight-card">
              <FaLayerGroup className="highlight-icon" />
              <h3>Multi-Discipline</h3>
              <p>Architecture to Structural Design</p>
            </div>
            <div className="highlight-card">
              <FaProjectDiagram className="highlight-icon" />
              <h3>End-to-End</h3>
              <p>Concept to Turnkey Delivery</p>
            </div>
            <div className="highlight-card">
              <FaAward className="highlight-icon" />
              <h3>100%</h3>
              <p>Quality Commitment</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose">
        <div className="home-section-container">
          <div className="section-title">
            <span>OUR STRENGTH</span>
            <h2>Why Clients Choose Nayaab Engineering</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <FaUsers className="why-icon" />
              <h3>Experienced Team</h3>
              <p>
                Skilled engineers and architects with hands-on project expertise.
              </p>
            </div>

            <div className="why-card">
              <FaLightbulb className="why-icon" />
              <h3>Innovative Design</h3>
              <p>
                Modern, functional, and sustainable design approaches for every
                project.
              </p>
            </div>

            <div className="why-card">
              <FaClock className="why-icon" />
              <h3>Timely Delivery</h3>
              <p>
                Disciplined project timelines with proactive schedule management.
              </p>
            </div>

            <div className="why-card">
              <FaShieldAlt className="why-icon" />
              <h3>Quality Assurance</h3>
              <p>
                Rigorous quality checks at every stage of design and construction.
              </p>
            </div>

            <div className="why-card">
              <FaSmile className="why-icon" />
              <h3>Client Satisfaction</h3>
              <p>
                Transparent communication and a client-first execution philosophy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-pattern"></div>
        <div className="home-section-container">
          <div className="cta-content">
            <span className="cta-tag">COMING SOON</span>
            <h2>Our complete corporate website is currently under development.</h2>
            <p>We look forward to serving you soon.</p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/919858765435"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn whatsapp-btn"
              >
                <FaWhatsapp /> WhatsApp Us
              </a>
              <a
                href="mailto:info@nayaabengineering.com"
                className="secondary-btn light"
              >
                <FaEnvelope /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;