import { useState } from 'react'
import { useAudio } from '../../context/useAudio'
import './FloatingAudioPlayer.css'

export default function FloatingAudioPlayer() {
  const {
    isPlaying,
    volume,
    isMuted,
    togglePlay,
    setVolume,
    toggleMute,
    openSettings
  } = useAudio()

  const [isExpanded, setIsExpanded] = useState(false)

  const volumePercent = isMuted ? 0 : Math.round(volume * 100)

  return (
    <div
      className={`floating-audio-widget ${isExpanded ? 'expanded' : ''} ${
        isPlaying && !isMuted ? 'playing' : ''
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main Pill Controls */}
      <div className="audio-pill-bar">
        {/* Play/Pause Button */}
        <button
          type="button"
          className="pill-btn play-btn"
          onClick={togglePlay}
          title={isPlaying ? 'Pause Background Ambience' : 'Play Background Ambience'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
        </button>

        {/* Animated Sound Equalizer Waves */}
        <div className="pill-equalizer" onClick={togglePlay} title="Ambient loop status">
          <span className={`bar ${isPlaying && !isMuted ? 'animate' : ''}`}></span>
          <span className={`bar ${isPlaying && !isMuted ? 'animate' : ''}`}></span>
          <span className={`bar ${isPlaying && !isMuted ? 'animate' : ''}`}></span>
        </div>

        {/* Volume / Mute Button */}
        <button
          type="button"
          className={`pill-btn mute-btn ${isMuted ? 'muted' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label="Toggle mute"
        >
          <i
            className={`bi ${
              isMuted || volumePercent === 0
                ? 'bi-volume-mute'
                : volumePercent < 45
                ? 'bi-volume-down'
                : 'bi-volume-up'
            }`}
          ></i>
        </button>

        {/* Volume Percentage */}
        <span className="pill-vol-label" onClick={() => setIsExpanded(!isExpanded)}>
          {volumePercent}%
        </span>

        {/* Settings Gear */}
        <button
          type="button"
          className="pill-btn settings-trigger-btn"
          onClick={openSettings}
          title="Open Boutique Audio & Ambience Settings"
          aria-label="Open settings"
        >
          <i className="bi bi-gear"></i>
        </button>
      </div>

      {/* Expanded Quick Volume Slider Popover */}
      {isExpanded && (
        <div className="audio-slider-popover">
          <div className="popover-inner">
            <span className="popover-title">Ambience Volume</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volumePercent}
              onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
              className="quick-volume-slider"
              aria-label="Adjust background volume"
            />
            <div className="popover-footer">
              <span>{volumePercent}%</span>
              <button
                type="button"
                className="popover-settings-link"
                onClick={() => {
                  setIsExpanded(false)
                  openSettings()
                }}
              >
                More Settings <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
