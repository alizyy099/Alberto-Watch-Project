import { useEffect, useState } from 'react'
import about from '../../assets/data/about.json'
import team from '../../assets/data/team.json'
import './About.css'

function About() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % about.slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const changeSlide = (direction) => {
    setCurrentSlide((current) => (
      (current + direction + about.slides.length) % about.slides.length
    ))
  }

  return (
    <section className="about-section" id="about">
      <div className="about-header">
        <p className="about-subtitle">ABOUT ALBERTO</p>
        <h2>A Legacy of <span>Time</span></h2>
        <p className="about-intro">The story, people and values behind Alberto Watch Company.</p>
      </div>

      <div className="about-history">
        <div className="history-number">01</div>
        <div className="history-content">
          <p className="about-label">OUR STORY</p>
          <h3>{about.storyTitle}</h3>
          {about.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>

      <div className="about-highlights">
        {about.highlights.map((item) => (
          <article className="highlight-card" key={item.title}>
            <i className={`bi ${item.icon}`}></i>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="about-gallery">
        <div className="gallery-heading">
          <p className="about-label">INSIDE ALBERTO</p>
          <h3>Beyond the <span>Timepiece</span></h3>
        </div>

        <div className="about-slider">
          <img
            src={about.slides[currentSlide].image}
            alt={about.slides[currentSlide].title}
          />
          <div className="slider-overlay">
            <div>
              <p>{about.slides[currentSlide].title}</p>
              <h4>{about.slides[currentSlide].text}</h4>
            </div>
          </div>

          <button className="slider-arrow slider-prev" onClick={() => changeSlide(-1)} aria-label="Previous slide">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="slider-arrow slider-next" onClick={() => changeSlide(1)} aria-label="Next slide">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="slider-dots">
          {about.slides.map((slide, index) => (
            <button
              key={slide.title}
              className={currentSlide === index ? 'active' : ''}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="crew-section">
        <div className="crew-heading">
          <p className="about-label">OUR CREW</p>
          <h3>The People Behind <span>Alberto</span></h3>
          <p>A small team focused on precision, craftsmanship and customer service.</p>
        </div>

        <div className="crew-grid">
          {team.map((member) => (
            <article className="crew-card" key={member.id}>
              <div className="crew-image">
                <img src={member.image} alt={member.role} />
              </div>
              <div className="crew-info">
                <span>{member.role}</span>
                <h4>{member.name}</h4>
                <p>{member.title}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
