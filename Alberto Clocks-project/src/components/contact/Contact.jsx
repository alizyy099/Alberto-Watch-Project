import './Contact.css'

function Contact() {
  return (
    <section className="contact-section" id="contact">

      <div className="contact-header">
        <p className="contact-subtitle">CONTACT ALBERTO</p>

        <h2>
          Let's Stay
          <span> Connected</span>
        </h2>

        <p className="contact-intro">
          Whether you have a question about our collection
          or simply want to know more, we're here to help.
        </p>
      </div>


      <div className="contact-container">

        <div className="contact-info">

          <div className="contact-item">
            <div className="contact-icon">
              <i className="bi bi-envelope"></i>
            </div>

            <div>
              <span>Email</span>
              <h3>info@albertoclocks.com</h3>
            </div>
          </div>


          <div className="contact-item">
            <div className="contact-icon">
              <i className="bi bi-telephone"></i>
            </div>

            <div>
              <span>Phone</span>
              <h3>+92 21 3456 7890</h3>
            </div>
          </div>


          <div className="contact-item">
            <div className="contact-icon">
              <i className="bi bi-geo-alt"></i>
            </div>

            <div>
              <span>Visit Us</span>
              <h3>Karachi, Pakistan</h3>
            </div>
          </div>


          <div className="contact-item">
            <div className="contact-icon">
              <i className="bi bi-clock"></i>
            </div>

            <div>
              <span>Opening Hours</span>
              <h3>Mon – Sat · 10 AM – 8 PM</h3>
            </div>
          </div>

        </div>


        <div className="contact-card">

          <div className="contact-card-icon">
            <i className="bi bi-chat-dots"></i>
          </div>

          <p className="contact-card-label">
            HAVE A QUESTION?
          </p>

          <h3>
            We're here to
            <span> help.</span>
          </h3>

          <p>
            Need information about a timepiece,
            store visit, repair service, or our
            upcoming collection?
          </p>

          <a
            href="#support"
            className="contact-button"
          >
            Contact Support
            <i className="bi bi-arrow-right"></i>
          </a>

        </div>

      </div>


      <div className="contact-social">

        <span>FOLLOW ALBERTO</span>

        <div className="social-icons">

          <a href="#" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>

          <a href="#" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>

          <a href="#" aria-label="LinkedIn">
            <i className="bi bi-linkedin"></i>
          </a>

        </div>

      </div>

    </section>
  )
}

export default Contact