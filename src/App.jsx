import './App.css'
import logo from '/logo.png'

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa'

function App() {
  return (
    <main className="home">
      <div className="overlay"></div>

      <section className="content">
        <img
          src={logo}
          alt="Nayaab Engineering Innovations Pvt. Ltd."
          className="logo"
        />

        <span className="tag">COMING SOON</span>

        <h1>
          Nayaab Engineering
          <br />
          Innovations Pvt. Ltd.
        </h1>

        <p className="description">
          Our new corporate website is currently under development.
          <br />
          We are building a modern digital experience to better serve our
          clients and partners.
        </p>

        <div className="contact">

          <a
            href="https://maps.google.com/?q=3rd+Floor,+Qutub+Complex,+Opposite+JK+Bank+(TP),+Baramulla,+Jammu+%26+Kashmir+193101"
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <div className="icon">
              <FaMapMarkerAlt />
            </div>

            <div className="card-content">
              <h3>Visit Our Office</h3>
              <p>
                3rd Floor, Qutub Complex,
                <br />
                Opposite JK Bank (TP),
                <br />
                Baramulla, Jammu & Kashmir
              </p>
            </div>
          </a>

          <a
            href="tel:+911952455465"
            className="contact-card"
          >
            <div className="icon">
              <FaPhoneAlt />
            </div>

            <div className="card-content">
              <h3>Call Us</h3>
              <p>+91 1952-455465</p>
            </div>
          </a>

          <a
            href="mailto:info@nayaabengineering.com"
            className="contact-card"
          >
            <div className="icon">
              <FaEnvelope />
            </div>

            <div className="card-content">
              <h3>Email Us</h3>
              <p>info@nayaabengineering.com</p>
            </div>
          </a>

          <a
            href="https://wa.me/919858765435"
            target="_blank"
            rel="noreferrer"
            className="contact-card whatsapp-card"
          >
            <div className="icon whatsapp-icon">
              <FaWhatsapp />
            </div>

            <div className="card-content">
              <h3>Chat on WhatsApp</h3>
              <p>+91 98587 65435</p>
            </div>
          </a>

        </div>

        <p className="footer">
  © {new Date().getFullYear()} Nayaab Engineering Innovations Pvt. Ltd.
  <br />
  Website Under Development
  <br />
  <br />
  Designed & Developed by{" "}
  <a
    href="https://www.kallis.in"
    target="_blank"
    rel="noopener noreferrer"
    className="developer"
  >
    Kallis
  </a>
</p>
      </section>
    </main>
  )
}

export default App