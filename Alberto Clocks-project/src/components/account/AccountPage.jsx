import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { useShop } from '../../context/useShop'
import { useAudio } from '../../context/useAudio'
import { useTheme } from '../../context/useTheme'
import './AccountPage.css'

export default function AccountPage() {
  const { user, logout, updateProfile, orders, sellSubmissions, openAuthModal } = useAuth()
  const { navigateTo, showToast } = useShop()
  const {
    isPlaying,
    volume,
    isMuted,
    soundscape,
    togglePlay,
    setVolume,
    toggleMute,
    setSoundscape,
    resetDefaults
  } = useAudio()

  const { theme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'profile' | 'submissions'

  // Editable Profile fields
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [street, setStreet] = useState(user?.address?.street || '')
  const [city, setCity] = useState(user?.address?.city || '')
  const [state, setState] = useState(user?.address?.state || '')
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '')
  const [country, setCountry] = useState(user?.address?.country || 'Switzerland')

  // Selected Order for Invoice view
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-not-logged">
          <div className="not-logged-icon">
            <i className="bi bi-person-lock"></i>
          </div>
          <h2>Private Collector Suite</h2>
          <p>Sign in to access your order history, certified horology papers, and concierge profile.</p>
          <button
            type="button"
            className="account-login-btn"
            onClick={() => openAuthModal('login')}
          >
            Access Collector Account
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    )
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    updateProfile({
      name,
      email,
      phone,
      address: {
        street,
        city,
        state,
        postalCode,
        country
      }
    })
    showToast('Collector profile updated successfully.', 'success')
  }

  return (
    <div className="account-page">
      {/* Header Banner */}
      <section className="account-hero">
        <div className="account-hero-inner">
          <div className="account-breadcrumbs">
            <button type="button" onClick={() => navigateTo('home')}>Home</button>
            <i className="bi bi-chevron-right"></i>
            <span className="current">Collector Suite</span>
          </div>

          <div className="account-profile-summary">
            <div className="profile-avatar">
              <span>{user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}</span>
            </div>

            <div className="profile-text">
              <div className="profile-badge-row">
                <span className="collector-tier-badge">
                  <i className="bi bi-award-fill"></i> {user.memberTier || 'Horology Patron'}
                </span>
                <span className="collector-id-badge">ID: {user.id}</span>
              </div>

              <h1>{user.name}</h1>
              <p className="profile-email">
                <i className="bi bi-envelope"></i> {user.email} • <i className="bi bi-geo-alt"></i> {user.address?.city || 'Geneva'}, {user.address?.country || 'Switzerland'}
              </p>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="account-action-btn signout"
                onClick={() => {
                  logout()
                  showToast('Signed out of Alberto Horology.', 'info')
                  navigateTo('home')
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="account-layout-container">
        {/* Navigation Tabs */}
        <div className="account-tabs-nav">
          <button
            type="button"
            className={`acc-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-bag-check"></i>
            Acquisitions & Orders ({orders.length})
          </button>

          <button
            type="button"
            className={`acc-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-badge"></i>
            Collector Details & Address
          </button>

          <button
            type="button"
            className={`acc-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <i className="bi bi-watch"></i>
            Watch Appraisals ({sellSubmissions.length})
          </button>

          <button
            type="button"
            className={`acc-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear"></i>
            Settings & Ambience
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="account-tab-content">
            <div className="tab-section-header">
              <div>
                <h3>Horological Acquisitions</h3>
                <p>Track delivery, provenance documentation, and inspection certificates for your timepieces.</p>
              </div>

              <button
                type="button"
                className="btn-browse-more"
                onClick={() => navigateTo('shop')}
              >
                Explore Collection
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="empty-account-box">
                <i className="bi bi-bag-x"></i>
                <h4>No Timepieces Acquired Yet</h4>
                <p>Discover our Swiss and automatic collections to begin your Alberto horology journey.</p>
                <button
                  type="button"
                  className="empty-cta-btn"
                  onClick={() => navigateTo('shop')}
                >
                  Browse Timepieces
                </button>
              </div>
            ) : (
              <div className="orders-cards-list">
                {orders.map((order) => (
                  <article key={order.orderId} className="order-card">
                    <div className="order-card-header">
                      <div className="order-id-group">
                        <span className="order-label">ACQUISITION REF</span>
                        <h4>#{order.orderId}</h4>
                        <span className="order-date">Placed on {order.date}</span>
                      </div>

                      <div className="order-status-group">
                        <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          <i className="bi bi-circle-fill"></i>
                          {order.status}
                        </span>
                        <span className="courier-note">{order.courier}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items-grid">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.image} alt={item.name} className="order-item-img" />
                          <div className="order-item-info">
                            <span className="item-cat">{item.category}</span>
                            <h5>{item.name}</h5>
                            <div className="item-variations-tags">
                              <span>{item.selectedColor}</span>
                              <span>{item.selectedStrap}</span>
                              <span>{item.selectedCaseSize}</span>
                            </div>
                            <span className="item-qty-price">
                              Qty: {item.quantity} × ${item.unitPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="order-card-footer">
                      <div className="order-total-summary">
                        <span>Total Paid:</span>
                        <strong>${order.total.toLocaleString()}</strong>
                        <small>(Includes Swiss VAT & Concierge Armored Transit)</small>
                      </div>

                      <div className="order-footer-buttons">
                        <button
                          type="button"
                          className="btn-invoice"
                          onClick={() => setSelectedInvoice(order)}
                        >
                          <i className="bi bi-receipt"></i>
                          View Certificate & Invoice
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Address */}
        {activeTab === 'profile' && (
          <div className="account-tab-content">
            <div className="tab-section-header">
              <div>
                <h3>Collector Identity & Delivery Sanctuary</h3>
                <p>Keep your personal credentials and white-glove courier shipping location up to date.</p>
              </div>
            </div>

            <form className="profile-edit-form" onSubmit={handleProfileSave}>
              <div className="form-group-card">
                <h4><i className="bi bi-person-fill"></i> Personal Information</h4>

                <div className="form-grid-2">
                  <div className="field-group">
                    <label>Full Legal Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label>Collector Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label>Direct Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label>Membership Status</label>
                    <input
                      type="text"
                      value={user.memberTier}
                      disabled
                      className="readonly-field"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-card">
                <h4><i className="bi bi-shield-check"></i> Insured Courier Delivery Address</h4>

                <div className="field-group">
                  <label>Street Address & Suite / Villa</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 14 Rue du Rhône, Suite 402"
                    required
                  />
                </div>

                <div className="form-grid-3">
                  <div className="field-group">
                    <label>City / Canton</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Geneva"
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label>State / Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="GE"
                    />
                  </div>

                  <div className="field-group">
                    <label>Postal / ZIP Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1204"
                      required
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Country / Territory</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-save-profile">
                <i className="bi bi-check-lg"></i>
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Appraisal Submissions */}
        {activeTab === 'submissions' && (
          <div className="account-tab-content">
            <div className="tab-section-header">
              <div>
                <h3>Watch Appraisal Inquiries</h3>
                <p>Manage timepieces you have submitted for Alberto valuation, trade-in, or outright purchase.</p>
              </div>

              <button
                type="button"
                className="btn-browse-more"
                onClick={() => navigateTo('sell-watch')}
              >
                Submit A Watch
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            {sellSubmissions.length === 0 ? (
              <div className="empty-account-box">
                <i className="bi bi-search"></i>
                <h4>No Appraisal Inquiries Submitted</h4>
                <p>Looking to sell or trade your luxury timepiece? Our master horologists evaluate pieces within 24 hours.</p>
                <button
                  type="button"
                  className="empty-cta-btn"
                  onClick={() => navigateTo('sell-watch')}
                >
                  Submit Watch For Appraisal
                </button>
              </div>
            ) : (
              <div className="submissions-list">
                {sellSubmissions.map((sub) => (
                  <article key={sub.ticketId} className="submission-card">
                    <div className="submission-header">
                      <div>
                        <span className="sub-label">APPRAISAL DOSSIER</span>
                        <h4>#{sub.ticketId}</h4>
                        <span className="sub-date">Submitted on {sub.date}</span>
                      </div>

                      <div className="sub-status-badge">
                        <i className="bi bi-hourglass-split"></i>
                        {sub.status}
                      </div>
                    </div>

                    <div className="submission-details-grid">
                      <div>
                        <span className="prop-name">Brand & Model</span>
                        <strong>{sub.brand} — {sub.model}</strong>
                      </div>
                      <div>
                        <span className="prop-name">Year & Condition</span>
                        <strong>{sub.year || 'Modern'} • {sub.condition}</strong>
                      </div>
                      <div>
                        <span className="prop-name">Provenance</span>
                        <strong>{sub.boxPapers || 'Complete Set'}</strong>
                      </div>
                      <div>
                        <span className="prop-name">Valuation Estimate</span>
                        <strong className="sub-estimate">{sub.estimateRange || `$${sub.expectedPrice?.toLocaleString() || 'Pending Review'}`}</strong>
                      </div>
                    </div>

                    {sub.images && sub.images.length > 0 && (
                      <div className="submission-photos">
                        <span className="photos-title">Uploaded Inspection Photos ({sub.images.length}):</span>
                        <div className="photos-strip">
                          {sub.images.map((img, i) => (
                            <img key={i} src={img} alt={`Submission photo ${i + 1}`} />
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings & Ambience */}
        {activeTab === 'settings' && (
          <div className="account-tab-content">
            <div className="tab-section-header">
              <div>
                <h3>Collector Ambience & Sound Settings</h3>
                <p>Personalize your background acoustic salon atmosphere and volume levels.</p>
              </div>

              <button
                type="button"
                className="btn-browse-more"
                onClick={resetDefaults}
                title="Reset audio settings to standard 35% soft level"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset Audio Defaults
              </button>
            </div>

            <div className="account-settings-grid">
              {/* Master Play / Pause Card */}
              <div className="acc-setting-card">
                <div className="acc-card-row">
                  <div className="acc-card-info">
                    <h4>Background Ambience Replay</h4>
                    <p>
                      {isPlaying
                        ? (isMuted ? 'Ambience active but muted' : 'Soft background salon music playing on continuous replay')
                        : 'Background music is currently paused'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`acc-audio-toggle-btn ${isPlaying ? 'active' : ''}`}
                    onClick={togglePlay}
                  >
                    <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                    <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
                  </button>
                </div>
              </div>

              {/* Volume Slider Card */}
              <div className="acc-setting-card">
                <div className="acc-volume-header">
                  <div className="vol-title-left">
                    <button
                      type="button"
                      className={`acc-mute-btn ${isMuted ? 'muted' : ''}`}
                      onClick={toggleMute}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <i
                        className={`bi ${
                          isMuted || volume === 0
                            ? 'bi-volume-mute-fill'
                            : volume < 0.45
                            ? 'bi-volume-down-fill'
                            : 'bi-volume-up-fill'
                        }`}
                      ></i>
                    </button>
                    <div>
                      <h4>Background Ambience Volume</h4>
                      <p>Adjust the level of ambient horology music dynamically</p>
                    </div>
                  </div>

                  <span className="acc-vol-percent">{isMuted ? 0 : Math.round(volume * 100)}%</span>
                </div>

                <div className="acc-slider-track">
                  <i className="bi bi-volume-low"></i>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : Math.round(volume * 100)}
                    onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
                    className="luxury-volume-range"
                    aria-label="Background music volume"
                  />
                  <i className="bi bi-volume-up-fill"></i>
                </div>

                <div className="acc-presets-row">
                  <span>Presets:</span>
                  <div className="acc-preset-chips">
                    {[
                      { label: 'Mute (0%)', val: 0 },
                      { label: 'Soft 35%', val: 0.35 },
                      { label: 'Balanced 65%', val: 0.65 },
                      { label: 'Full 100%', val: 1.0 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        className={`preset-chip ${
                          !isMuted && Math.abs(volume - p.val) < 0.05
                            ? 'active'
                            : (p.val === 0 && isMuted ? 'active' : '')
                        }`}
                        onClick={() => {
                          if (p.val === 0) {
                            if (!isMuted) toggleMute()
                          } else {
                            setVolume(p.val)
                          }
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Mode Selector */}
              <div className="acc-setting-card">
                <h4>Atelier Visual Theme</h4>
                <p>Switch between the signature Midnight Dark mode and Clean Porcelain Light mode</p>

                <div className="theme-toggle-grid">
                  <button
                    type="button"
                    className={`theme-option-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="theme-card-icon dark-icon">
                      <i className="bi bi-moon-stars-fill"></i>
                    </div>
                    <div className="theme-card-text">
                      <div className="theme-card-title-row">
                        <h6>Midnight Dark Mode</h6>
                        <span className="default-pill">Default</span>
                      </div>
                      <p>Signature horology dark palette with ambient obsidian glow & gold accents.</p>
                    </div>
                    <div className="theme-radio-circle">
                      {theme === 'dark' && <i className="bi bi-check-circle-fill"></i>}
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`theme-option-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="theme-card-icon light-icon">
                      <i className="bi bi-sun-fill"></i>
                    </div>
                    <div className="theme-card-text">
                      <div className="theme-card-title-row">
                        <h6>Clean Porcelain Light Mode</h6>
                      </div>
                      <p>Pristine alabaster white luxury styling with crisp slate typography & warm gold.</p>
                    </div>
                    <div className="theme-radio-circle">
                      {theme === 'light' && <i className="bi bi-check-circle-fill"></i>}
                    </div>
                  </button>
                </div>
              </div>

              {/* Soundscape Atmosphere */}
              <div className="acc-setting-card">
                <h4>Atelier Atmosphere Selection (7 Soundscapes)</h4>
                <p>Choose your musical tone while exploring timepieces</p>

                <div className="acc-soundscapes-grid">
                  <div
                    className={`soundscape-card ${soundscape === 'salon' ? 'active' : ''}`}
                    onClick={() => setSoundscape('salon')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-disc"></i>
                      {soundscape === 'salon' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Geneva Salon Piano</h6>
                    <p>Lush piano chords, warm harmonics, and gentle ambient salon atmosphere.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'escapement' ? 'active' : ''}`}
                    onClick={() => setSoundscape('escapement')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-stopwatch"></i>
                      {soundscape === 'escapement' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Mechanical Escapement</h6>
                    <p>Warm ambient harmonic drone accompanied by a whisper-quiet Swiss balance pulse.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'chimes' ? 'active' : ''}`}
                    onClick={() => setSoundscape('chimes')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-bell"></i>
                      {soundscape === 'chimes' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Midnight Celesta</h6>
                    <p>Ethereal crystalline bell chimes echoing softly through quiet evening ateliers.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'royal' ? 'active' : ''}`}
                    onClick={() => setSoundscape('royal')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-music-note-list"></i>
                      {soundscape === 'royal' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Royal Horology Strings</h6>
                    <p>Grand orchestral string harmonies in D Major with regal warmth and resonance.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'alpine' ? 'active' : ''}`}
                    onClick={() => setSoundscape('alpine')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-wind"></i>
                      {soundscape === 'alpine' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Alpine Atelier Breeze</h6>
                    <p>Acoustic nylon harp harmonics and airy Swiss mountain woodwind textures.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'vallee' ? 'active' : ''}`}
                    onClick={() => setSoundscape('vallee')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-sunset"></i>
                      {soundscape === 'vallee' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Vallée de Joux Twilight</h6>
                    <p>Deep warm analog synth pad with tranquil sunset filter modulation.</p>
                  </div>

                  <div
                    className={`soundscape-card ${soundscape === 'chronos' ? 'active' : ''}`}
                    onClick={() => setSoundscape('chronos')}
                  >
                    <div className="soundscape-top">
                      <i className="bi bi-activity"></i>
                      {soundscape === 'chronos' && <span className="active-badge">Active</span>}
                    </div>
                    <h6>Chronos Kinetic Pulse</h6>
                    <p>Modern minimalist clockwork beats, hypnotic micro-clicks, and Rhodes harmony.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice / Certificate Modal */}
      {selectedInvoice && (
        <div className="invoice-backdrop" onClick={() => setSelectedInvoice(null)}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="invoice-close"
              onClick={() => setSelectedInvoice(null)}
              aria-label="Close invoice"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="invoice-header">
              <img src="/images/logo.png" alt="Alberto Clocks" />
              <div>
                <h2>Alberto Clocks Geneva</h2>
                <p>Certificate of Acquisition & Master Warranty</p>
              </div>
            </div>

            <div className="invoice-meta-row">
              <div>
                <span>ORDER NUMBER</span>
                <strong>#{selectedInvoice.orderId}</strong>
              </div>
              <div>
                <span>DATE</span>
                <strong>{selectedInvoice.date}</strong>
              </div>
              <div>
                <span>PATRON</span>
                <strong>{selectedInvoice.shippingAddress?.name || user.name}</strong>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Variations</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td><strong>{it.name}</strong> ({it.category})</td>
                    <td>{it.selectedColor} • {it.selectedStrap} • {it.selectedCaseSize}</td>
                    <td>{it.quantity}</td>
                    <td>${(it.unitPrice * it.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals">
              <div className="invoice-total-line">
                <span>Subtotal</span>
                <span>${selectedInvoice.subtotal?.toLocaleString() || selectedInvoice.total.toLocaleString()}</span>
              </div>
              <div className="invoice-total-line">
                <span>Insured Global Courier</span>
                <span style={{ color: '#34d399' }}>Complimentary</span>
              </div>
              <div className="invoice-total-line grand-total">
                <span>Total Acquired</span>
                <span>${selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="invoice-authenticity-stamp">
              <i className="bi bi-patch-check-fill"></i>
              <div>
                <h6>Certified Genuine Alberto Horology</h6>
                <p>5-Year International Mechanical Warranty Registered to Serial #{selectedInvoice.orderId}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
