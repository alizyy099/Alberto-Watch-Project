import { useState } from 'react'
import { useShop } from '../../context/useShop'
import './QuickViewModal.css'

function QuickViewContent({ product, onClose }) {
  const { addToCart, navigateTo } = useShop()

  const [selectedColor, setSelectedColor] = useState(
    product.variations?.colors?.[0]?.name || product.color || 'Silver'
  )
  const firstStrap = product.variations?.straps?.[0]
  const [selectedStrap, setSelectedStrap] = useState(firstStrap?.name || 'Italian Calf Leather')
  const [strapOffset, setStrapOffset] = useState(firstStrap?.priceOffset || 0)
  const [selectedSize, setSelectedSize] = useState(product.variations?.caseSizes?.[0] || '41mm')
  const [quantity, setQuantity] = useState(1)

  const handleColorChange = (c) => {
    setSelectedColor(c.name)
  }

  const handleStrapChange = (s) => {
    setSelectedStrap(s.name)
    setStrapOffset(s.priceOffset || 0)
  }

  const handleAdd = () => {
    addToCart(
      product,
      {
        color: selectedColor,
        strap: selectedStrap,
        caseSize: selectedSize,
        strapPriceOffset: strapOffset
      },
      quantity
    )
    onClose()
  }

  const finalPrice = product.price + strapOffset

  return (
    <div
      className="qv-modal"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick View ${product.name}`}
    >
      <button
        type="button"
        className="qv-close-btn"
        onClick={onClose}
        aria-label="Close modal"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <div className="qv-grid">
        {/* Watch Image */}
        <div className="qv-image-column">
          <div className="qv-image-wrap">
            <img src={product.image} alt={product.name} />
            <span className="qv-badge">{product.category}</span>
          </div>
          <div className="qv-thumb-hint">
            <span>{product.specs?.caseDiameter} • {product.specs?.glass}</span>
          </div>
        </div>

        {/* Details & Variations */}
        <div className="qv-info-column">
          <div className="qv-header">
            <span className="qv-sku">{product.sku}</span>
            <h3>{product.name}</h3>
            <div className="qv-rating">
              <div className="stars">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <span>{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            <div className="qv-price-row">
              <span className="qv-price">${finalPrice.toLocaleString()}</span>
              {strapOffset > 0 && <span className="qv-offset-note">(+${strapOffset} for bracelet)</span>}
            </div>
          </div>

          <p className="qv-desc">{product.description}</p>

          {/* Color Swatches */}
          {product.variations?.colors && (
            <div className="qv-var-group">
              <label className="qv-var-label">
                Dial / Case: <strong>{selectedColor}</strong>
              </label>
              <div className="qv-swatches">
                {product.variations.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`qv-swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                    onClick={() => handleColorChange(c)}
                    title={c.label || c.name}
                    aria-label={`Select ${c.name}`}
                  >
                    <span className="swatch-color" style={{ backgroundColor: c.code }}></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Straps */}
          {product.variations?.straps && (
            <div className="qv-var-group">
              <label className="qv-var-label">
                Strap: <strong>{selectedStrap}</strong>
              </label>
              <div className="qv-chips">
                {product.variations.straps.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`qv-chip-btn ${selectedStrap === s.name ? 'active' : ''}`}
                    onClick={() => handleStrapChange(s)}
                  >
                    {s.name}
                    {s.priceOffset > 0 && <span className="chip-offset">+${s.priceOffset}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.variations?.caseSizes && (
            <div className="qv-var-group">
              <label className="qv-var-label">
                Case Diameter: <strong>{selectedSize}</strong>
              </label>
              <div className="qv-sizes">
                {product.variations.caseSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`qv-size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="qv-actions-row">
            <div className="qv-qty-box">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <i className="bi bi-dash"></i>
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <button type="button" className="qv-add-btn" onClick={handleAdd}>
              <i className="bi bi-bag-plus"></i>
              Add to Luxury Bag
            </button>
          </div>

          <button
            type="button"
            className="qv-full-page-link"
            onClick={() => {
              onClose()
              navigateTo('product', product.id)
            }}
          >
            View Full Product Page & High-Res Zoom
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useShop()

  if (!quickViewProduct) return null

  const handleClose = () => {
    setQuickViewProduct(null)
  }

  return (
    <div className="qv-backdrop" onClick={handleClose}>
      <QuickViewContent
        key={quickViewProduct.id}
        product={quickViewProduct}
        onClose={handleClose}
      />
    </div>
  )
}
