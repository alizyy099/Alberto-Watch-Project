// Luxury Horology Ambient Audio Engine for Alberto Clocks

class HorologyAudioEngine {
  constructor() {
    this.audioElement = null
    this.audioContext = null
    this.synthGain = null
    this.synthTimer = null
    this.isSynthRunning = false
    this.currentSoundscape = 'salon'
    this.volume = 0.35
    this.isMuted = false
    this.isPlaying = false
    this.hasUserInteracted = false
    this.initAudioElement()
  }

  initAudioElement() {
    if (typeof window === 'undefined') return
    try {
      this.audioElement = new Audio('/audio/alberto-ambience.wav')
      this.audioElement.loop = true
      this.audioElement.autoplay = true
      this.audioElement.volume = this.effectiveVolume
      this.audioElement.preload = 'auto'

      // Backup loop listener
      this.audioElement.addEventListener('ended', () => {
        if (this.isPlaying) {
          this.audioElement.currentTime = 0
          this.audioElement.play().catch(() => {})
        }
      })
    } catch {
      this.audioElement = null
    }
  }

  get effectiveVolume() {
    return this.isMuted ? 0 : Math.max(0, Math.min(1, this.volume))
  }

  // Ensure Web Audio context is initialized when needed
  initSynthContext() {
    if (typeof window === 'undefined') return
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.audioContext = new AudioCtx()
        this.synthGain = this.audioContext.createGain()
        this.synthGain.gain.setValueAtTime(this.effectiveVolume, this.audioContext.currentTime)
        this.synthGain.connect(this.audioContext.destination)
      }
    }
  }

  // Start the generative Web Audio synth for selected soundscapes
  startSynth() {
    this.initSynthContext()
    if (!this.audioContext || this.isSynthRunning) return

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }

    this.isSynthRunning = true
    this.scheduleNextSynthChord()
  }

  stopSynth() {
    this.isSynthRunning = false
    if (this.synthTimer) {
      clearTimeout(this.synthTimer)
      this.synthTimer = null
    }
  }

  scheduleNextSynthChord() {
    if (!this.isSynthRunning || !this.audioContext) return

    const now = this.audioContext.currentTime
    const duration = 4.5

    // Musical progressions based on current soundscape
    let freqs = []
    if (this.currentSoundscape === 'escapement') {
      // Warm mechanical drone with fifths
      freqs = [110.0, 164.81, 220.0, 329.63]
    } else if (this.currentSoundscape === 'chimes') {
      // Ethereal pentatonic chimes
      const chimePool = [329.63, 392.0, 440.0, 523.25, 659.25, 783.99]
      freqs = [
        chimePool[Math.floor(Math.random() * chimePool.length)],
        chimePool[Math.floor(Math.random() * chimePool.length)]
      ]
    } else {
      // Salon: Classic lush jazz-horology chords
      const chords = [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [116.54, 146.83, 174.61, 220.0], // Bbmaj7
        [130.81, 196.0, 261.63, 329.63]  // Cadd9
      ]
      freqs = chords[Math.floor(Math.random() * chords.length)]
    }

    // Play chord tones with soft bell/pad envelope
    freqs.forEach((freq, idx) => {
      try {
        const osc = this.audioContext.createOscillator()
        const noteGain = this.audioContext.createGain()
        const filter = this.audioContext.createBiquadFilter()

        osc.type = this.currentSoundscape === 'chimes' ? 'sine' : (idx % 2 === 0 ? 'sine' : 'triangle')
        osc.frequency.setValueAtTime(freq, now)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(this.currentSoundscape === 'chimes' ? 2400 : 750, now)

        // Envelope: soft swell, long decay
        const attack = 1.2
        const noteVol = (0.08 / (freqs.length || 1))
        noteGain.gain.setValueAtTime(0.0001, now)
        noteGain.gain.exponentialRampToValueAtTime(noteVol, now + attack)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

        osc.connect(filter)
        filter.connect(noteGain)
        noteGain.connect(this.synthGain)

        osc.start(now)
        osc.stop(now + duration)
      } catch {}
    })

    // Gentle mechanical escapement tick if on 'escapement' mode
    if (this.currentSoundscape === 'escapement') {
      try {
        const tickOsc = this.audioContext.createOscillator()
        const tickGain = this.audioContext.createGain()
        tickOsc.type = 'triangle'
        tickOsc.frequency.setValueAtTime(2800, now)
        tickGain.gain.setValueAtTime(0.015, now)
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
        tickOsc.connect(tickGain)
        tickGain.connect(this.synthGain)
        tickOsc.start(now)
        tickOsc.stop(now + 0.03)
      } catch {}
    }

    this.synthTimer = setTimeout(() => {
      this.scheduleNextSynthChord()
    }, (duration - 0.8) * 1000)
  }

  play() {
    this.isPlaying = true

    // Resume Audio Context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }

    if (this.currentSoundscape === 'salon' && this.audioElement) {
      this.stopSynth()
      this.audioElement.volume = this.effectiveVolume
      const promise = this.audioElement.play()
      if (promise !== undefined) {
        promise.catch(() => {
          // If browser blocked audio element, fall back to synth or wait for gesture
          this.startSynth()
        })
      }
    } else {
      if (this.audioElement) {
        this.audioElement.pause()
      }
      this.startSynth()
    }
  }

  pause() {
    this.isPlaying = false
    if (this.audioElement) {
      this.audioElement.pause()
    }
    this.stopSynth()
  }

  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(1, newVolume))
    const vol = this.effectiveVolume

    if (this.audioElement) {
      this.audioElement.volume = vol
    }

    if (this.synthGain && this.audioContext) {
      try {
        this.synthGain.gain.setValueAtTime(vol, this.audioContext.currentTime)
      } catch {}
    }
  }

  setMuted(muted) {
    this.isMuted = muted
    this.setVolume(this.volume)
  }

  setSoundscape(soundscape) {
    this.currentSoundscape = soundscape
    if (this.isPlaying) {
      this.play()
    }
  }
}

export const audioEngine = new HorologyAudioEngine()
