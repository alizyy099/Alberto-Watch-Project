import { useState } from 'react'
import watchParts from '../../assets/data/watchParts.json'
import './WatchParts.css'

function WatchParts() {
  const [selectedPart, setSelectedPart] = useState(null)

  const handleBuy = (part) => {
    setSelectedPart(null)
    alert(
      `Order confirmed: ${part.name} — $${part.price.toLocaleString()}. Thank you for choosing Alberto.`
    )
  }

  return (
    <section className="watch-parts-section" id="watch-parts">
      <div className="watch-parts-header">
        <p>ALBERTO ESSENTIALS</p>

        <h2>
          Complete Your <span>Timepiece</span>
        </h2>

        <p>
          Shop selected components separately for care, replacement and servicing.
        </p>
      </div>

      <div className="watch-parts-grid">
        {watchParts.map((part, index) => (
          <article
            className="watch-part-card"
            key={part.id}
          >
            <button
              className="part-visual"
              onClick={() => setSelectedPart(part)}
              aria-label={`View ${part.name}`}
            >
              <img
                src={part.image}
                alt={part.name}
              />

              <span className="part-number">
                0{index + 1}
              </span>

              <span className="part-category">
                {part.category}
              </span>
            </button>

            <div className="watch-part-info">
              <p>{part.category}</p>

              <h3>{part.name}</h3>

              <span className="part-description">
                {part.description}
              </span>

              <div className="part-bottom">
                <strong>
                  ${part.price.toLocaleString()}
                </strong>

                <button
                  onClick={() => setSelectedPart(part)}
                >
                  View & Buy
                  <i className="bi bi-arrow-up-right"></i>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedPart && (
        <div
          className="parts-modal-backdrop"
          onClick={() => setSelectedPart(null)}
        >
          <div
            className="parts-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="parts-modal-close"
              onClick={() => setSelectedPart(null)}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="parts-modal-visual">
              <img
                src={selectedPart.image}
                alt={selectedPart.name}
              />
            </div>

            <div className="parts-modal-content">
              <p>ALBERTO ESSENTIAL</p>

              <h3>{selectedPart.name}</h3>

              <strong>
                ${selectedPart.price.toLocaleString()}
              </strong>

              <p>{selectedPart.description}</p>

              <small>{selectedPart.note}</small>

              <button
                onClick={() => handleBuy(selectedPart)}
              >
                Buy This Part
                <i className="bi bi-bag-check"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default WatchParts