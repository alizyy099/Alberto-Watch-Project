import './Footer.css'

function Footer() {
  return (
    <footer className="alberto-footer">

      <div className="footer-main">

        {/* BRAND */}

        <div className="footer-brand">

          <a href="#home" className="footer-logo">
            <i className="bi bi-watch"></i>

            <div>
              Alberto
              <span>Clocks</span>
            </div>
          </a>

          <p>
            Timeless design, precision craftsmanship,
            and exceptional timepieces made to be
            appreciated for generations.
          </p>

          <a
            href="#sell-watch"
            className="footer-sell-link"
          >
            Sell Your Watch
            <i className="bi bi-arrow-up-right"></i>
          </a>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-column">

          <h4>EXPLORE</h4>

          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#technology">Technology</a>
          <a href="#gallery">Gallery</a>

        </div>


        {/* COMPANY */}

        <div className="footer-column">

          <h4>COMPANY</h4>

          <a href="#about">About Alberto</a>
          <a href="#store">Store Locations</a>
          <a href="#support">Support</a>
          <a href="#contact">Contact</a>

        </div>


        {/* CONTACT */}

        <div className="footer-column footer-contact">

          <h4>GET IN TOUCH</h4>

          <div>
            <i className="bi bi-envelope"></i>
            <span>info@albertoclocks.com</span>
          </div>

          <div>
            <i className="bi bi-telephone"></i>
            <span>+92 21 3456 7890</span>
          </div>

          <div>
            <i className="bi bi-geo-alt"></i>
            <span>Karachi, Pakistan</span>
          </div>

        </div>

      </div>


      {/* FOOTER BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 Alberto Clocks. All rights reserved.
        </p>

        <div className="footer-socials">

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

        <div className="footer-legal">

          <a href="#">Privacy</a>

          <span>•</span>

          <a href="#">Terms</a>

        </div>

      </div>

    </footer>
  )
}

export default Footer