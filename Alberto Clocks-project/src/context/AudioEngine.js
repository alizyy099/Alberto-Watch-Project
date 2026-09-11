// Luxury Horology Ambient Audio Engine for Alberto Clocks

class HorologyAudioEngine {
  constructor() {
    this.audioElement = null
    this.audioContext = null
    this.synthGain = null
    this.synthTimer = null
    this.isSynthRunning = false
    this.currentSoundscape = 'salon'
    this.volume = 1.0
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
    const duration = 4.8

    // Musical progressions based on current soundscape
    let freqs = []
    let oscType = 'sine'
    let cutoff = 850
    let hasTick = false
    let attack = 1.4

    switch (this.currentSoundscape) {
      case 'escapement':
        // Warm mechanical drone with fifths + clockwork pulse
        freqs = [110.0, 164.81, 220.0, 329.63]
        cutoff = 750
        hasTick = true
        break

      case 'chimes':
        // Ethereal pentatonic crystal bells
        {
          const chimePool = [329.63, 392.0, 440.0, 523.25, 659.25, 783.99, 1046.5]
          freqs = [
            chimePool[Math.floor(Math.random() * chimePool.length)],
            chimePool[Math.floor(Math.random() * chimePool.length)]
          ]
          cutoff = 2600
          attack = 0.4
        }
        break

      case 'royal':
        // Royal Horology Strings: Symphonic D Major Chords
        {
          const royalChords = [
            [146.83, 220.0, 293.66, 369.99, 440.0], // Dmaj9
            [123.47, 185.0, 220.0, 293.66, 369.99], // Bm9
            [98.0, 146.83, 185.0, 220.0, 293.66],   // Gmaj7
            [110.0, 164.81, 220.0, 293.66, 329.63]  // A11
          ]
          freqs = royalChords[Math.floor(Math.random() * royalChords.length)]
          oscType = 'triangle'
          cutoff = 1100
          attack = 1.8
        }
        break

      case 'alpine':
        // Alpine Atelier Breeze: Woodwind-like acoustic harmonics
        {
          const alpinePool = [
            [164.81, 196.0, 246.94, 329.63, 493.88], // Em9
            [196.0, 246.94, 293.66, 392.0, 493.88],  // Gmaj9
            [220.0, 261.63, 329.63, 440.0, 523.25],  // Am9
            [146.83, 220.0, 293.66, 369.99, 440.0]  // Dsus4
          ]
          freqs = alpinePool[Math.floor(Math.random() * alpinePool.length)]
          cutoff = 1400
          attack = 1.2
        }
        break

      case 'vallee':
        // Vallée de Joux Twilight: Deep warm analog synth drone
        {
          const valleeChords = [
            [87.31, 130.81, 174.61, 261.63], // F1/F2
            [73.42, 110.0, 146.83, 220.0],   // D1/D2
            [65.41, 98.0, 130.81, 196.0],    // C1/C2
            [58.27, 87.31, 116.54, 174.61]   // Bb0/Bb1
          ]
          freqs = valleeChords[Math.floor(Math.random() * valleeChords.length)]
          oscType = 'sawtooth'
          cutoff = 420
          attack = 2.2
        }
        break

      case 'chronos':
        // Chronos Kinetic Pulse: Modern minimal horology rhythm
        {
          const chronosChords = [
            [130.81, 196.0, 261.63, 311.13], // Cm7
            [116.54, 174.61, 233.08, 293.66], // Bb
            [103.83, 155.56, 207.65, 261.63], // Abmaj7
            [130.81, 196.0, 261.63, 349.23]  // Csus4
          ]
          freqs = chronosChords[Math.floor(Math.random() * chronosChords.length)]
          oscType = 'sine'
          cutoff = 950
          hasTick = true
          attack = 0.8
        }
        break

      case 'salon':
      default:
        // Geneva Salon: Classic lush jazz-horology chords
        {
          const chords = [
            [174.61, 220.0, 261.63, 329.63], // Fmaj7
            [146.83, 174.61, 220.0, 261.63], // Dm7
            [116.54, 146.83, 174.61, 220.0], // Bbmaj7
            [130.81, 196.0, 261.63, 329.63]  // Cadd9
          ]
          freqs = chords[Math.floor(Math.random() * chords.length)]
          cutoff = 800
          attack = 1.3
        }
        break
    }

    // Play chord tones with soft bell/pad envelope
    freqs.forEach((freq, idx) => {
      try {
        const osc = this.audioContext.createOscillator()
        const noteGain = this.audioContext.createGain()
        const filter = this.audioContext.createBiquadFilter()

        osc.type = oscType === 'sawtooth' ? (idx === 0 ? 'sawtooth' : 'triangle') : (idx % 2 === 0 ? oscType : 'sine')
        osc.frequency.setValueAtTime(freq, now)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(cutoff, now)

        // Envelope: soft swell, long decay
        const noteVol = (0.09 / (freqs.length || 1))
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

    // Gentle mechanical escapement tick
    if (hasTick) {
      try {
        const tickOsc = this.audioContext.createOscillator()
        const tickGain = this.audioContext.createGain()
        tickOsc.type = 'triangle'
        tickOsc.frequency.setValueAtTime(2600, now)
        tickGain.gain.setValueAtTime(0.018, now)
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
        tickOsc.connect(tickGain)
        tickGain.connect(this.synthGain)
        tickOsc.start(now)
        tickOsc.stop(now + 0.035)
      } catch {}
    }

    this.synthTimer = setTimeout(() => {
      this.scheduleNextSynthChord()
    }, (duration - 0.7) * 1000)
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
