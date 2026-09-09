import technology from '../../assets/data/technology.json'
import './Technology.css'

function Technology() {
  return (
    <section className="technology-section" id="technology">
      <div className="technology-header">
        <p className="technology-subtitle">THE TECHNOLOGY</p>

        <h2>
          Precision Behind <span>Every Second</span>
        </h2>

        <p className="technology-intro">
          Every Alberto timepiece is shaped by a balance of precision engineering,
          considered materials and careful finishing.
        </p>
      </div>

      <div className="technology-list">
        {technology.map((item, index) => (
          <article
            className={`technology-content ${
              index % 2 === 1 ? 'reverse' : ''
            }`}
            key={item.number}
          >
            <div className="technology-info">
              <p className="technology-number">
                {item.number}
              </p>

              <h3>{item.title}</h3>

              {item.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="technology-visual">
              <img
                src={item.image}
                alt={item.title}
              />

              <span className="technology-caption">
                ALBERTO / {item.number}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Technology