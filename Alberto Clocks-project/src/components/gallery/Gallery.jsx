import gallery from '../../assets/data/gallery.json'
import './Gallery.css'

function Gallery() {
  const featured = gallery.filter((item) => !item.comingSoon)
  const comingSoon = gallery.filter((item) => item.comingSoon)

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-header">
        <p className="gallery-subtitle">THE COLLECTION</p>
        <h2>A Closer Look at <span>Alberto</span></h2>
        <p className="gallery-intro">
          A visual selection of signature timepieces and designs coming next.
        </p>
      </div>

      <div className="gallery-block">
        <div className="gallery-block-header">
          <div>
            <p className="gallery-label">FEATURED</p>
            <h3>Signature Timepieces</h3>
          </div>
          <p className="gallery-block-description">
            Selected designs that represent the refined character of the Alberto collection.
          </p>
        </div>

        <div className="gallery-grid">
          {featured.map((item) => (
            <article className="gallery-card" key={item.name}>
              <div className="gallery-image">
                <img src={item.image} alt={item.name} />
                <div className="gallery-overlay">
                  <span>{item.category}</span>
                  <h4>{item.name}</h4>
                  <p>${item.price.toLocaleString()}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="gallery-block coming-soon-section">
        <div className="gallery-block-header">
          <div>
            <p className="gallery-label">COMING SOON</p>
            <h3>The Future of Alberto</h3>
          </div>
          <p className="gallery-block-description">
            Three upcoming concepts prepared for the next chapter of the collection.
          </p>
        </div>

        <div className="coming-soon-grid">
          {comingSoon.map((item) => (
            <article className="coming-soon-card" key={item.name}>
              <div className="coming-soon-image">
                <img src={item.image} alt={item.name} />
                <div className="coming-soon-overlay">
                  <span className="coming-soon-badge">COMING SOON</span>
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
