import { useState, useRef, useEffect } from 'react'
import { useShop } from '../../context/useShop'
import { useAuth } from '../../context/useAuth'
import { useAudio } from '../../context/useAudio'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { page, navigateTo, cartCount, setIsCartOpen } = useShop()
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const { openSettings, isPlaying, isMuted } = useAudio()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { label: 'Home', action: () => navigateTo('home'), isPage: page === 'home' },
    { label: 'Shop Catalog', action: () => navigateTo('shop'), isPage: page === 'shop' },
    { label: 'Sell Your Watch', action: () => navigateTo('sell-watch'), isPage: page === 'sell-watch' },
    { label: 'Collections', href: '#products' },
    { label: 'Packages', href: '#packages' },
    { label: 'Watch Parts', href: '#watch-parts' },
    { label: 'Technology', href: '#technology' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Store', href: '#store' },
    { label: 'Support', href: '#support' },
    { label: 'Contact', href: '#contact' }
  ]

  const handleNavClick = (link) => {
    setMenuOpen(false)
    if (link.action) {
      link.action()
      return
    }

    if (link.href) {
      if (page !== 'home') {
        navigateTo('home')
        setTimeout(() => {
          const el = document.querySelector(link.href)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      } else {
        const el = document.querySelector(link.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="alberto-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <a
          className="alberto-logo"
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            setMenuOpen(false)
            navigateTo('home')
          }}
        >
          <img src="/images/logo.png" alt="Alberto Clocks" />

          <span>
            ALBERTO
            <small>CLOCKS</small>
          </span>
        </a>

        {/* Links */}
        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href || '#'}
                className={link.isPage ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link)
                }}
              >
                {link.label}
              </a>
            </li>
          ))}

          <li className="shop-mobile">
            {isAuthenticated ? (
              <a
                href="#account"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  navigateTo('account')
                }}
              >
                Collector Suite ({user.name})
              </a>
            ) : (
              <a
                href="#signin"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  openAuthModal('login')
                }}
              >
                Sign In to Collector Suite
              </a>
            )}
          </li>
          <li className="shop-mobile">
            <a
              href="#settings"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                openSettings()
              }}
            >
              <i className="bi bi-gear me-2"></i> Settings & Ambience
            </a>
          </li>
        </ul>

        {/* Actions: User Auth, Cart, Shop CTA */}
        <div className="navbar-actions">
          {/* User Account / Sign In Dropdown */}
          <div className="navbar-user-dropdown-wrap" ref={dropdownRef}>
            {isAuthenticated ? (
              <button
                type="button"
                className="navbar-user-logged-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title="Collector Account Menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="user-avatar-small">
                  {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <span className="user-name-abbr">{user.name.split(' ')[0]}</span>
                <i className={`bi bi-chevron-${userDropdownOpen ? 'up' : 'down'}`}></i>
              </button>
            ) : (
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => openAuthModal('login')}
                title="Sign In to Collector Account"
              >
                <i className="bi bi-person"></i>
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && isAuthenticated && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-header">
                  <strong>{user.name}</strong>
                  <small>{user.memberTier || 'Horology Patron'}</small>
                </div>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    navigateTo('account')
                  }}
                >
                  <i className="bi bi-person-badge"></i>
                  Collector Profile & Orders
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    navigateTo('sell-watch')
                  }}
                >
                  <i className="bi bi-watch"></i>
                  Sell / Consign Watch
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    openSettings()
                  }}
                >
                  <i className="bi bi-gear"></i>
                  Settings & Ambience
                </button>

                <div className="dropdown-divider"></div>

                <button
                  type="button"
                  className="dropdown-item signout"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    logout()
                    navigateTo('home')
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Settings Option Button */}
          <button
            type="button"
            className="navbar-settings-btn"
            onClick={openSettings}
            title="Atelier Settings & Audio Ambience"
            aria-label="Settings"
          >
            <i className="bi bi-gear"></i>
            {isPlaying && !isMuted && <span className="navbar-sound-dot" title="Ambient Music Playing"></span>}
          </button>

          {/* Cart Bag Button */}
          <button
            type="button"
            className="navbar-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <i className="bi bi-bag"></i>
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="shop-now-btn"
            onClick={() => navigateTo('shop')}
          >
            Shop Catalog
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="navbar-toggle"
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
      ></button>
    </nav>
  )
}

export default Navbar
