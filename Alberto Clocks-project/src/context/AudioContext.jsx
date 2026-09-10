import { useState, useEffect, useCallback } from 'react'
import { AudioContext } from './AudioContextInstance'
import { audioEngine } from './AudioEngine'

export function AudioProvider({ children }) {
  // Volume: 0.0 to 1.0 (default 35% - soft and elegant)
  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_ambient_volume')
      return saved !== null ? parseFloat(saved) : 0.35
    } catch {
      return 0.35
    }
  })

  const [isMuted, setIsMutedState] = useState(() => {
    try {
      return localStorage.getItem('alberto_ambient_muted') === 'true'
    } catch {
      return false
    }
  })

  const [isPlaying, setIsPlayingState] = useState(() => {
    try {
      return localStorage.getItem('alberto_ambient_enabled') !== 'false'
    } catch {
      return true
    }
  })

  const [soundscape, setSoundscapeState] = useState(() => {
    try {
      return localStorage.getItem('alberto_ambient_soundscape') || 'salon'
    } catch {
      return 'salon'
    }
  })

  // Settings modal visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Initialize engine settings on mount
  useEffect(() => {
    audioEngine.setVolume(volume)
    audioEngine.setMuted(isMuted)
    audioEngine.setSoundscape(soundscape)
  }, [volume, isMuted, soundscape])

  // Handle autoplay on load and user gesture unlock
  useEffect(() => {
    const isAutoplayDesired = localStorage.getItem('alberto_ambient_enabled') !== 'false'

    if (isAutoplayDesired) {
      // Attempt immediate browser autoplay
      audioEngine.play()

      const unlockAndPlay = () => {
        // Ensure user hasn't manually stopped it
        if (localStorage.getItem('alberto_ambient_enabled') !== 'false') {
          if (audioEngine.audioContext && audioEngine.audioContext.state === 'suspended') {
            audioEngine.audioContext.resume().catch(() => {})
          }
          audioEngine.play()
          setIsPlayingState(true)
        }
        cleanup()
      }

      const events = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'click']
      const cleanup = () => {
        events.forEach((evt) => window.removeEventListener(evt, unlockAndPlay))
      }

      events.forEach((evt) => {
        window.addEventListener(evt, unlockAndPlay, { once: true, passive: true })
      })

      return () => {
        cleanup()
      }
    }
  }, [])

  // Volume controller
  const setVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, typeof val === 'number' ? val : parseFloat(val)))
    setVolumeState(clamped)
    audioEngine.setVolume(clamped)
    try {
      localStorage.setItem('alberto_ambient_volume', clamped.toString())
    } catch {}

    // If unmuting by raising volume
    if (clamped > 0 && isMuted) {
      setIsMutedState(false)
      audioEngine.setMuted(false)
      try {
        localStorage.setItem('alberto_ambient_muted', 'false')
      } catch {}
    }
  }, [isMuted])

  // Mute / Unmute
  const toggleMute = useCallback(() => {
    setIsMutedState((prev) => {
      const next = !prev
      audioEngine.setMuted(next)
      try {
        localStorage.setItem('alberto_ambient_muted', next.toString())
      } catch {}
      return next
    })
  }, [])

  // Play / Pause
  const togglePlay = useCallback(() => {
    setIsPlayingState((prev) => {
      const next = !prev
      if (next) {
        audioEngine.play()
        try {
          localStorage.setItem('alberto_ambient_enabled', 'true')
        } catch {}
      } else {
        audioEngine.pause()
        try {
          localStorage.setItem('alberto_ambient_enabled', 'false')
        } catch {}
      }
      return next
    })
  }, [])

  // Change Soundscape Atmosphere
  const setSoundscape = useCallback((name) => {
    setSoundscapeState(name)
    audioEngine.setSoundscape(name)
    try {
      localStorage.setItem('alberto_ambient_soundscape', name)
    } catch {}
  }, [])

  // Reset to Atelier Defaults (35% volume, unmuted, salon)
  const resetDefaults = useCallback(() => {
    setVolume(0.35)
    setIsMutedState(false)
    audioEngine.setMuted(false)
    setSoundscape('salon')
  }, [setVolume, setSoundscape])

  // Settings Modal Controls
  const openSettings = useCallback(() => setIsSettingsOpen(true), [])
  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])
  const toggleSettings = useCallback(() => setIsSettingsOpen((prev) => !prev), [])

  const value = {
    isPlaying,
    volume,
    isMuted,
    soundscape,
    isSettingsOpen,
    togglePlay,
    setVolume,
    toggleMute,
    setSoundscape,
    resetDefaults,
    openSettings,
    closeSettings,
    toggleSettings
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}
