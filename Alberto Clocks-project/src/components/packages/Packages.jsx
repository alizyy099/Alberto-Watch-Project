import { useState } from 'react'
import packages from '../../assets/data/packages.json'
import './Packages.css'

function Packages() {
  const [selectedPackage, setSelectedPackage] = useState(null)

  const handleOrder = (item) => {
    setSelectedPackage(null)
    alert(
      `Order confirmed: ${item.name} — $${item.price.toLocaleString()}. Alberto will prepare your package.`
    )
  }

  return (
    <section className="packages-section" id="packages">
      <div className="packages-header">
        <p>ALBERTO SIGNATURE PACKAGES</p>

        <h2>
          More Than a Watch.
          <br />
          <span>A Complete Experience.</span>
        </h2>

        <p>
          Choose a curated package and discover exactly what comes with your timepiece.
        </p>
      </div>

      <div className="packages-grid">
        {packages.map((item, index) => (
          <article
            className={`package-card ${index === 3 ? 'featured' : ''}`}
            key={item.id}
            onClick={() => setSelectedPackage(item)}
          >
            <div className="package-image">
              <img src={item.image} alt={item.watch} />
              <div className="package-image-shade"></div>
              <span>0{index + 1}</span>
              <em>{item.tag}</em>
            </div>

            <div className="package-card-body">
              <p className="package-label">{item.watch}</p>

              <h3>{item.name}</h3>

              <p className="package-description">
                {item.description}
              </p>

              <div className="package-bottom">
                <strong>${item.price.toLocaleString()}</strong>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedPackage(item)
                  }}
                >
                  View & Buy
                  <i className="bi bi-bag-check"></i>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedPackage && (
        <div
          className="package-modal-backdrop"
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className="package-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="package-modal-close"
              onClick={() => setSelectedPackage(null)}
              aria-label="Close package details"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="package-modal-image">
              <img
                src={selectedPackage.image}
                alt={selectedPackage.watch}
              />

              <div>
                <span>{selectedPackage.tag}</span>
                <strong>{selectedPackage.watch}</strong>
              </div>
            </div>

            <div className="package-modal-content">
              <p className="package-modal-label">PACKAGE DETAILS</p>

              <h3>{selectedPackage.name}</h3>

              <div className="package-modal-price">
                ${selectedPackage.price.toLocaleString()}
              </div>

              <p className="package-modal-description">
                {selectedPackage.description}
              </p>

              <div className="package-deal">
                <i className="bi bi-stars"></i>

                <div>
                  <small>ALBERTO DEAL</small>
                  <span>{selectedPackage.deal}</span>
                </div>
              </div>

              <div className="package-includes">
                <p>WHAT'S INCLUDED</p>

                <ul>
                  {selectedPackage.items.map((feature) => (
                    <li key={feature}>
                      <i className="bi bi-check2-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="package-buy"
                onClick={() => handleOrder(selectedPackage)}
              >
                Buy Package
                <i className="bi bi-bag-check"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Packages