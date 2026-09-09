import { useState } from 'react'
import './Hero.css'

function Hero() {

  const videos = [
    '/brown-golden-watch1.mp4',
    '/blue-watch2.mp4',
    '/golden-watch1.mp4',
    '/brown-watch1.mp4'
  ]

  const [currentVideo, setCurrentVideo] = useState(0)

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length)
  }

  return (
    <section className="hero" id="home">

         


      <video
        key={videos[currentVideo]}
        className="hero-video"
        src={videos[currentVideo]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      />

      <div className="hero-overlay"></div>

       <div className="hero-content">

  <h2 className="hero-brand">
    ALBERTO WATCH
  </h2>

  <h1>
    Time,
    <br />
    Crafted
    <br />
    to Perfection.
  </h1>

  <p className="hero-description">
    Discover exceptional timepieces where timeless design
    meets precision craftsmanship.
  </p>

</div>

    </section>
  )
}

export default Hero