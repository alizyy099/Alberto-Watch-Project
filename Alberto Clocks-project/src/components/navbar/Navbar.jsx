import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    ['Home', '#home'],
    ['Collections', '#products'],
    ['Packages', '#packages'],
    ['Watch Parts', '#watch-parts'],
    ['Technology', '#technology'],
    ['Gallery', '#gallery'],
    ['About', '#about'],
    ['Store', '#store'],
    ['Support', '#support'],
    ['Contact', '#contact']
  ]

  return (
    <nav className="alberto-navbar">
      <div className="navbar-inner">
        <a className="alberto-logo" href="#home" onClick={() => setMenuOpen(false)}>
          <img src="/images/logo.png" alt="Alberto Clocks" />
          <span>
            ALBERTO
            <small>CLOCKS</small>
          </span>
        </a>

        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {links.map(([label, href]) => (
            <li key={label}>
              <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            </li>
          ))}
          <li className="shop-mobile">
            <a href="#sell-watch" onClick={() => setMenuOpen(false)}>Sell Your Watch</a>
          </li>
        </ul>

        <div className="navbar-actions">
          <a href="#sell-watch" className="sell-nav-link">Sell Watch</a>
          <a href="#products" className="shop-now-btn">
            Explore Collection <i className="bi bi-arrow-right"></i>
          </a>
        </div>

        <button
          className="navbar-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <i className={menuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
        </button>
      </div>

      <button
        className={`navbar-overlay ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-label="Close navigation"
      />
    </nav>
  )
}

export default Navbar
