import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { useShop } from '../../context/useShop'
import './AuthModal.css'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginAsDemo
  } = useAuth()

  const { showToast } = useShop()

  // Form states
  const [loginEmail, setLoginEmail] = useState('julian.vance@alberto-horology.com')
  const [loginPassword, setLoginPassword] = useState('AlbertoVIP2026')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCountry, setRegCountry] = useState('Switzerland')

  if (!isAuthModalOpen) return null

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!loginEmail) return
    login(loginEmail, loginPassword)
    showToast(`Welcome back, ${loginEmail.split('@')[0]}!`, 'success')
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!regEmail || !regName) return
    register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      country: regCountry
    })
    showToast(`Welcome to Alberto Horology Club, ${regName}!`, 'success')
  }

  const handleDemoClick = () => {
    loginAsDemo()
    showToast('Signed in with Geneva VIP Demo account!', 'success')
  }

  return (
    <div className="auth-backdrop" onClick={closeAuthModal}>
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Alberto Collector Access"
      >
        <button
          type="button"
          className="auth-close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Brand Header */}
        <div className="auth-brand-header">
          <img src="/images/logo.png" alt="Alberto Clocks" />
          <h3>Alberto Horology</h3>
          <p>Private Collector Sanctuary</p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="demo-vip-box">
          <div className="demo-vip-info">
            <i className="bi bi-gem"></i>
            <div>
              <strong>Geneva Collector Demo</strong>
              <span>Instant access to VIP profile & past orders</span>
            </div>
          </div>
          <button type="button" className="btn-demo-quick" onClick={handleDemoClick}>
            1-Click Sign In
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${authModalMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthModalMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authModalMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthModalMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {authModalMode === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-field">
              <label htmlFor="auth-email">Collector Email</label>
              <div className="auth-input-wrap">
                <i className="bi bi-envelope"></i>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="name@horology.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="auth-password">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    showToast('Password reset link dispatched to your email.', 'info')
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="auth-input-wrap">
                <i className="bi bi-lock"></i>
                <input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Access Collector Suite
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>
        ) : (
          /* Register Form */
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <div className="auth-input-wrap">
                <i className="bi bi-person"></i>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Julian Vance"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <div className="auth-input-wrap">
                <i className="bi bi-envelope"></i>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="collector@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-row-2">
              <div className="auth-field">
                <label htmlFor="reg-phone">Phone / WhatsApp</label>
                <div className="auth-input-wrap">
                  <i className="bi bi-telephone"></i>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+41 22 000 0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-country">Country of Residence</label>
                <div className="auth-input-wrap">
                  <i className="bi bi-globe"></i>
                  <select
                    id="reg-country"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                  >
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-pass">Create Master Password</label>
              <div className="auth-input-wrap">
                <i className="bi bi-shield-lock"></i>
                <input
                  id="reg-pass"
                  type="password"
                  placeholder="At least 8 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Join Alberto Horology Club
              <i className="bi bi-award"></i>
            </button>
          </form>
        )}

        <div className="auth-footer-note">
          <i className="bi bi-shield-check"></i>
          <span>Geneva Master Horology Vault Protected • 256-Bit SSL</span>
        </div>
      </div>
    </div>
  )
}
