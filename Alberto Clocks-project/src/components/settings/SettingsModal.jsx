import { useEffect, useState } from 'react'
import { useAudio } from '../../context/useAudio'
import './SettingsModal.css'

export default function SettingsModal() {
  const {
    isPlaying,
    volume,
    isMuted,
    soundscape,
    isSettingsOpen,
    closeSettings,
    togglePlay,
    setVolume,
    toggleMute,
    setSoundscape,
    resetDefaults
  } = useAudio()

  const [currency, setCurrency] = useState('USD')
  const [timeFormat, setTimeFormat] = useState('12h')
  const [activeTab, setActiveTab] = useState('audio') // 'audio' | 'boutique'

  // Keyboard close
  useEffect(() => {
    if (!isSettingsOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSettings()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSettingsOpen, closeSettings])

  if (!isSettingsOpen) return null

  const volumePercent = isMuted ? 0 : Math.round(volume * 100)

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10) / 100
    setVolume(val)
  }

  const presets = [
    { label: 'Mute', val: 0 },
    { label: 'Soft (25%)', val: 0.25 },
    { label: 'Ideal (40%)', val: 0.40 },
    { label: 'Lounge (70%)', val: 0.70 },
    { label: 'Full (100%)', val: 1.0 }
  ]

  return (
    <div
      className="settings-modal-overlay"
      onClick={closeSettings}
      role="dialog"
      aria-modal="true"
      aria-label="Alberto Clocks Settings"
    >
      <div
        className="settings-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="settings-modal-header">
          <div className="settings-header-left">
            <div className="settings-icon-badge">
              <i className="bi bi-gear-fill"></i>
            </div>
            <div>
              <h3>Atelier Settings</h3>
              <p>Configure your soundscape ambience and boutique preferences</p>
            </div>
          </div>
          <button
            type="button"
            className="settings-close-btn"
            onClick={closeSettings}
            aria-label="Close settings"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs-nav">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <i className="bi bi-music-note-beamed"></i>
            Background Ambience
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'boutique' ? 'active' : ''}`}
            onClick={() => setActiveTab('boutique')}
          >
            <i className="bi bi-sliders"></i>
            Boutique & Display
          </button>
        </div>

        {/* Tab 1: Background Ambience & Volume */}
        {activeTab === 'audio' && (
          <div className="settings-tab-pane">
            {/* Status & Master Play/Pause Switch */}
            <div className="settings-card audio-status-card">
              <div className="audio-status-info">
                <div className="equalizer-visualizer">
                  <span className={`eq-bar ${isPlaying && !isMuted ? 'active' : ''}`}></span>
                  <span className={`eq-bar ${isPlaying && !isMuted ? 'active' : ''}`}></span>
                  <span className={`eq-bar ${isPlaying && !isMuted ? 'active' : ''}`}></span>
                  <span className={`eq-bar ${isPlaying && !isMuted ? 'active' : ''}`}></span>
                  <span className={`eq-bar ${isPlaying && !isMuted ? 'active' : ''}`}></span>
                </div>
                <div>
                  <h4>
                    {isPlaying
                      ? (isMuted ? 'Ambience Muted' : 'Ambience Playing (Looping)')
                      : 'Ambience Paused'}
                  </h4>
                  <p>
                    {isPlaying
                      ? 'Soft ambient salon music continuously replaying in background'
                      : 'Click Play to begin the Alberto luxury soundscape'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={`audio-master-toggle-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
              </button>
            </div>

            {/* Volume Control Section */}
            <div className="settings-card volume-slider-card">
              <div className="volume-card-header">
                <div className="volume-header-left">
                  <button
                    type="button"
                    className={`volume-mute-btn ${isMuted || volumePercent === 0 ? 'muted' : ''}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    aria-label="Toggle mute"
                  >
                    <i
                      className={`bi ${
                        isMuted || volumePercent === 0
                          ? 'bi-volume-mute-fill'
                          : volumePercent < 45
                          ? 'bi-volume-down-fill'
                          : 'bi-volume-up-fill'
                      }`}
                    ></i>
                  </button>
                  <div>
                    <h5>Background Music Volume</h5>
                    <p>Adjust the level of your ambient horology accompaniment</p>
                  </div>
                </div>

                <div className="volume-percent-pill">
                  <span>{volumePercent}%</span>
                </div>
              </div>

              {/* Slider track */}
              <div className="slider-control-row">
                <i className="bi bi-volume-low slider-icon-min"></i>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volumePercent}
                  onChange={handleSliderChange}
                  className="luxury-volume-range"
                  aria-label="Background music volume"
                />
                <i className="bi bi-volume-up-fill slider-icon-max"></i>
              </div>

              {/* Quick Preset Buttons */}
              <div className="volume-presets-row">
                <span className="presets-label">Quick Presets:</span>
                <div className="presets-button-group">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`preset-chip ${
                        !isMuted && Math.abs(volume - preset.val) < 0.05
                          ? 'active'
                          : (preset.val === 0 && isMuted ? 'active' : '')
                      }`}
                      onClick={() => {
                        if (preset.val === 0) {
                          if (!isMuted) toggleMute()
                        } else {
                          setVolume(preset.val)
                        }
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Soundscape Selection */}
            <div className="settings-card soundscape-selector-card">
              <div className="section-card-title">
                <h5>Atelier Soundscape Theme</h5>
                <p>Select your preferred musical atmosphere for browsing timepieces</p>
              </div>

              <div className="soundscapes-grid">
                <button
                  type="button"
                  className={`soundscape-card ${soundscape === 'salon' ? 'active' : ''}`}
                  onClick={() => setSoundscape('salon')}
                >
                  <div className="soundscape-top">
                    <i className="bi bi-disc"></i>
                    {soundscape === 'salon' && <span className="active-badge">Active</span>}
                  </div>
                  <h6>Geneva Salon Piano</h6>
                  <p>Warm piano chords, delicate harmonics, and atmospheric luxury room tone.</p>
                </button>

                <button
                  type="button"
                  className={`soundscape-card ${soundscape === 'escapement' ? 'active' : ''}`}
                  onClick={() => setSoundscape('escapement')}
                >
                  <div className="soundscape-top">
                    <i className="bi bi-stopwatch"></i>
                    {soundscape === 'escapement' && <span className="active-badge">Active</span>}
                  </div>
                  <h6>Mechanical Escapement</h6>
                  <p>Mellow ambient drone accompanied by a whisper-quiet 120 bpm Swiss balance pulse.</p>
                </button>

                <button
                  type="button"
                  className={`soundscape-card ${soundscape === 'chimes' ? 'active' : ''}`}
                  onClick={() => setSoundscape('chimes')}
                >
                  <div className="soundscape-top">
                    <i className="bi bi-bell"></i>
                    {soundscape === 'chimes' && <span className="active-badge">Active</span>}
                  </div>
                  <h6>Midnight Celesta</h6>
                  <p>Gentle crystalline bell chimes echoing through quiet evening ateliers.</p>
                </button>
              </div>
            </div>

            {/* Replay Notice */}
            <div className="replay-badge-notice">
              <i className="bi bi-repeat"></i>
              <span>Continuous Loop on Replay • Seamless gapless playback without interruption</span>
            </div>
          </div>
        )}

        {/* Tab 2: Boutique & Regional Display */}
        {activeTab === 'boutique' && (
          <div className="settings-tab-pane">
            <div className="settings-card">
              <h5>Currency Standard</h5>
              <p>Choose the default valuation currency displayed across the shop and checkout.</p>
              <div className="currency-options-grid">
                {[
                  { code: 'USD', symbol: '$', label: 'US Dollar' },
                  { code: 'EUR', symbol: '€', label: 'Euro' },
                  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
                  { code: 'GBP', symbol: '£', label: 'British Pound' }
                ].map((cur) => (
                  <button
                    key={cur.code}
                    type="button"
                    className={`currency-choice-btn ${currency === cur.code ? 'active' : ''}`}
                    onClick={() => setCurrency(cur.code)}
                  >
                    <span className="cur-symbol">{cur.symbol}</span>
                    <span className="cur-name">{cur.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <h5>Horology Time Representation</h5>
              <p>Preferred watch dial time convention across catalog specifications.</p>
              <div className="toggle-group-row">
                <button
                  type="button"
                  className={`time-toggle-btn ${timeFormat === '12h' ? 'active' : ''}`}
                  onClick={() => setTimeFormat('12h')}
                >
                  12-Hour Classic (10:10 Default)
                </button>
                <button
                  type="button"
                  className={`time-toggle-btn ${timeFormat === '24h' ? 'active' : ''}`}
                  onClick={() => setTimeFormat('24h')}
                >
                  24-Hour Military / GMT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="settings-modal-footer">
          <button
            type="button"
            className="btn-reset-defaults"
            onClick={resetDefaults}
            title="Reset audio settings to standard 35% soft level"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            Reset to Atelier Defaults
          </button>

          <button
            type="button"
            className="btn-save-close"
            onClick={closeSettings}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
