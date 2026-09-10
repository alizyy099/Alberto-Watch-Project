import { useState, useMemo, useEffect, useRef } from 'react'
import { useShop } from '../../context/useShop'
import { getProductById, getRelatedProducts } from '../../data/enhancedProducts'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const {
    activeProductId,
    navigateTo,
    addToCart,
    showToast
  } = useShop()

  const product = useMemo(() => getProductById(activeProductId), [activeProductId])
  const relatedProducts = useMemo(() => getRelatedProducts(product, 4), [product])

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)

  // Zoom lens state for main image
  const [isHoveringZoom, setIsHoveringZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageContainerRef = useRef(null)

  // Variations state
  const [selectedColor, setSelectedColor] = useState(product.variations?.colors?.[0]?.name || product.color)
  const [selectedStrap, setSelectedStrap] = useState(product.variations?.straps?.[0]?.name || 'Italian Calf Leather')
  const [strapOffset, setStrapOffset] = useState(0)
  const [selectedCaseSize, setSelectedCaseSize] = useState(product.variations?.caseSizes?.[0] || '41mm')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('specs') // 'specs' | 'craftsmanship' | 'shipping' | 'reviews'
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % (product.gallery?.length || 1))
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + (product.gallery?.length || 1)) % (product.gallery?.length || 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, product.gallery])

  // Handle Zoom Pan on Main Image
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    })
  }

  // Variations Handlers
  const handleColorChange = (c) => {
    setSelectedColor(c.name)
  }

  const handleStrapChange = (strap) => {
    setSelectedStrap(strap.name)
    setStrapOffset(strap.priceOffset || 0)
  }

  // Social Share Handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://albertoclocks.com'
  const shareText = `Explore the ${product.name} timepiece by Alberto Clocks.`

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedText = encodeURIComponent(shareText)
    let url = ''

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'pinterest':
        url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(product.image)}&description=${encodedText}`
        break
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(currentUrl)
          showToast('Product link copied to clipboard!', 'info')
        }
        return
      default:
        return
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
    }
  }

  const finalUnitPrice = product.price + strapOffset

  const handleAddToCart = () => {
    addToCart(
      product,
      {
        color: selectedColor,
        strap: selectedStrap,
        caseSize: selectedCaseSize,
        strapPriceOffset: strapOffset
      },
      quantity
    )
  }

  const handleBuyNow = () => {
    handleAddToCart()
  }

  const galleryImages = product.gallery || [product.image]
  const currentImage = galleryImages[activeImageIndex] || product.image

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <nav className="product-breadcrumbs-wrap" aria-label="Breadcrumb">
        <div className="breadcrumbs-container">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <i className="bi bi-chevron-right"></i>
          <button type="button" onClick={() => navigateTo('shop')}>Shop Catalog</button>
          <i className="bi bi-chevron-right"></i>
          <button
            type="button"
            onClick={() => navigateTo('shop', null, { category: product.category })}
          >
            {product.category}
          </button>
          <i className="bi bi-chevron-right"></i>
          <span className="current">{product.name}</span>
        </div>
      </nav>

      <main className="product-layout-container">
        {/* =========================================
            LEFT COLUMN: GALLERY, ZOOM & LIGHTBOX
            ========================================= */}
        <section className="product-gallery-column">
          <div className="gallery-layout">
            {/* Thumbnails list */}
            <div className="gallery-thumbnails">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Stage with Hover Zoom */}
            <div className="gallery-main-stage">
              <div
                className="main-image-viewport"
                ref={imageContainerRef}
                onMouseEnter={() => setIsHoveringZoom(true)}
                onMouseLeave={() => setIsHoveringZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsLightboxOpen(true)}
                title="Click for full-screen inspection"
              >
                {/* Standard Base Image */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`base-image ${isHoveringZoom ? 'hovering' : ''}`}
                />

                {/* Interactive Zoom Lens / Magnifier */}
                {isHoveringZoom && (
                  <div
                    className="zoom-lens-layer"
                    style={{
                      backgroundImage: `url(${currentImage})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: '250%'
                    }}
                  />
                )}

                {/* Zoom Hint & Expand Button */}
                <div className="zoom-hint-badge">
                  <i className="bi bi-zoom-in"></i>
                  <span>Hover to zoom • Click to expand</span>
                </div>

                <button
                  type="button"
                  className="expand-lightbox-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLightboxOpen(true)
                  }}
                  aria-label="Expand image to fullscreen"
                >
                  <i className="bi bi-arrows-fullscreen"></i>
                </button>
              </div>

              {/* Angle selector caption */}
              <div className="gallery-caption">
                <span>View {activeImageIndex + 1} of {galleryImages.length}</span>
                <span>• High-Resolution Horology Capture</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            RIGHT COLUMN: DETAILS, VARIATIONS & ACTIONS
            ========================================= */}
        <section className="product-info-column">
          {/* Top category & SKU */}
          <div className="product-meta-header">
            <span className="meta-category">{product.category} COLLECTION</span>
            <span className="meta-sku">SKU: {product.sku}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          {/* Rating and Reviews */}
          <div className="product-rating-bar">
            <div className="stars">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </div>
            <span className="rating-score">{product.rating}</span>
            <span className="reviews-link">({product.reviewCount} Verified Collector Reviews)</span>
            <span className="stock-pulse">
              <span className="pulse-dot"></span>
              In Stock & Ready to Dispatch
            </span>
          </div>

          {/* Price */}
          <div className="product-pricing-box">
            <div className="price-display">
              <span className="currency">$</span>
              <span className="amount">{finalUnitPrice.toLocaleString()}</span>
              {strapOffset > 0 && (
                <span className="strap-premium-note">(includes +${strapOffset} bracelet selection)</span>
              )}
            </div>
            <span className="tax-shipping-note">Inclusive of international import duties & express courier insurance.</span>
          </div>

          {/* Short description */}
          <p className="product-lead-description">{product.description}</p>

          {/* Feature Highlights Pills */}
          <div className="product-highlights-row">
            {product.highlights?.map((h, i) => (
              <span key={i} className="highlight-pill">
                <i className="bi bi-check2"></i> {h}
              </span>
            ))}
          </div>

          <div className="product-divider"></div>

          {/* =========================================
              VARIATION 1: COLOR / DIAL FINISH
              ========================================= */}
          {product.variations?.colors && (
            <div className="variation-section">
              <div className="var-header">
                <span className="var-title">Dial & Case Finish:</span>
                <strong className="var-selection-label">{selectedColor}</strong>
              </div>
              <div className="color-swatches-row">
                {product.variations.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`color-swatch-circle ${selectedColor === c.name ? 'active' : ''}`}
                    onClick={() => handleColorChange(c)}
                    title={c.label || c.name}
                    aria-label={`Select ${c.name} finish`}
                  >
                    <span className="inner-swatch" style={{ backgroundColor: c.code }}></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================
              VARIATION 2: STRAP / BRACELET
              ========================================= */}
          {product.variations?.straps && (
            <div className="variation-section">
              <div className="var-header">
                <span className="var-title">Strap / Band Material:</span>
                <strong className="var-selection-label">{selectedStrap}</strong>
              </div>
              <div className="straps-cards-grid">
                {product.variations.straps.map((strap) => (
                  <button
                    key={strap.id}
                    type="button"
                    className={`strap-option-card ${selectedStrap === strap.name ? 'active' : ''}`}
                    onClick={() => handleStrapChange(strap)}
                  >
                    <div className="strap-card-content">
                      <span className="strap-name">{strap.name}</span>
                      <span className="strap-price-tag">
                        {strap.priceOffset === 0 ? 'Included' : `+$${strap.priceOffset}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================
              VARIATION 3: CASE DIAMETER / SIZE
              ========================================= */}
          {product.variations?.caseSizes && (
            <div className="variation-section">
              <div className="var-header">
                <span className="var-title">Case Diameter:</span>
                <strong className="var-selection-label">{selectedCaseSize}</strong>
              </div>
              <div className="sizes-pills-row">
                {product.variations.caseSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-pill-btn ${selectedCaseSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedCaseSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-divider"></div>

          {/* Quantity & CTA Buttons */}
          <div className="product-order-actions">
            <div className="quantity-adjuster">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <button
              type="button"
              className="btn-add-to-bag"
              onClick={handleAddToCart}
            >
              <i className="bi bi-bag-plus"></i>
              Add to Bag • ${(finalUnitPrice * quantity).toLocaleString()}
            </button>

            <button
              type="button"
              className="btn-buy-now"
              onClick={handleBuyNow}
            >
              Acquire Now
            </button>

            <button
              type="button"
              className={`btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
              onClick={() => {
                setIsWishlisted(!isWishlisted)
                showToast(
                  isWishlisted
                    ? 'Removed from your watch wishlist'
                    : 'Saved to your watch wishlist',
                  'info'
                )
              }}
              title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist toggle"
            >
              <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>
          </div>

          {/* =========================================
              SOCIAL MEDIA SHARE BAR
              ========================================= */}
          <div className="product-social-share-wrap">
            <span className="share-label">Share This Timepiece:</span>
            <div className="social-share-buttons">
              <button
                type="button"
                className="social-btn facebook"
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
                aria-label="Share on Facebook"
              >
                <i className="bi bi-facebook"></i>
              </button>

              <button
                type="button"
                className="social-btn twitter"
                onClick={() => handleShare('twitter')}
                title="Share on X (Twitter)"
                aria-label="Share on X"
              >
                <i className="bi bi-twitter-x"></i>
              </button>

              <button
                type="button"
                className="social-btn pinterest"
                onClick={() => handleShare('pinterest')}
                title="Pin on Pinterest"
                aria-label="Share on Pinterest"
              >
                <i className="bi bi-pinterest"></i>
              </button>

              <button
                type="button"
                className="social-btn whatsapp"
                onClick={() => handleShare('whatsapp')}
                title="Share via WhatsApp"
                aria-label="Share via WhatsApp"
              >
                <i className="bi bi-whatsapp"></i>
              </button>

              <button
                type="button"
                className="social-btn linkedin"
                onClick={() => handleShare('linkedin')}
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </button>

              <button
                type="button"
                className="social-btn copy-link"
                onClick={() => handleShare('copy')}
                title="Copy Product Link"
                aria-label="Copy link"
              >
                <i className="bi bi-link-45deg"></i>
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          {/* Luxury Guarantees Strip */}
          <div className="luxury-guarantees-grid">
            <div className="guarantee-item">
              <i className="bi bi-shield-lock-fill"></i>
              <div>
                <h6>5-Year Warranty</h6>
                <p>Full mechanical & artisan guarantee</p>
              </div>
            </div>
            <div className="guarantee-item">
              <i className="bi bi-box-seam-fill"></i>
              <div>
                <h6>Signature Packaging</h6>
                <p>Delivered in lacquered Alberto presentation casket</p>
              </div>
            </div>
            <div className="guarantee-item">
              <i className="bi bi-arrow-left-right"></i>
              <div>
                <h6>30-Day Returns</h6>
                <p>Complimentary concierge return service</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          TECHNICAL SPECIFICATIONS & DETAILS TABS
          ========================================= */}
      <section className="product-details-tabs-section">
        <div className="tabs-container">
          <div className="tabs-header-nav">
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              <i className="bi bi-sliders"></i>
              Technical Specifications
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'craftsmanship' ? 'active' : ''}`}
              onClick={() => setActiveTab('craftsmanship')}
            >
              <i className="bi bi-gem"></i>
              Atelier Craftsmanship
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              <i className="bi bi-airplane-engines"></i>
              Shipping & Presentation
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="bi bi-chat-quote"></i>
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="tabs-content-pane">
            {activeTab === 'specs' && (
              <div className="tab-pane specs-pane">
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th>Calibre Movement</th>
                      <td>{product.specs?.movement}</td>
                    </tr>
                    <tr>
                      <th>Case Material</th>
                      <td>{product.specs?.caseMaterial}</td>
                    </tr>
                    <tr>
                      <th>Crystal Glass</th>
                      <td>{product.specs?.glass}</td>
                    </tr>
                    <tr>
                      <th>Case Diameter</th>
                      <td>{selectedCaseSize}</td>
                    </tr>
                    <tr>
                      <th>Case Thickness</th>
                      <td>{product.specs?.thickness}</td>
                    </tr>
                    <tr>
                      <th>Lug Width</th>
                      <td>{product.specs?.lugWidth}</td>
                    </tr>
                    <tr>
                      <th>Water Resistance</th>
                      <td>{product.specs?.waterResistance}</td>
                    </tr>
                    <tr>
                      <th>Power Reserve</th>
                      <td>{product.specs?.powerReserve}</td>
                    </tr>
                    <tr>
                      <th>Jewels</th>
                      <td>{product.specs?.jewels}</td>
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      <td>{product.specs?.warranty}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'craftsmanship' && (
              <div className="tab-pane craftsmanship-pane">
                <div className="craft-grid">
                  <div className="craft-text">
                    <h3>The Art of Alberto Horology</h3>
                    <p>
                      Every Alberto timepiece represents a relentless synthesis of mechanical integrity
                      and refined Italian silhouette. Crafted in limited series, our cases undergo over 40 individual
                      polishing and satin-brushing stages to achieve light transitions worthy of high horology.
                    </p>
                    <p>
                      The dial is protected by double-curved sapphire crystal with anti-reflective coating on both
                      facets, providing distortion-free legibility whether in direct sunlight or ambient gala lighting.
                    </p>
                    <div className="craft-badge-row">
                      <span><i className="bi bi-award"></i> Geneva Inspected</span>
                      <span><i className="bi bi-check-circle"></i> Hand Assembled</span>
                    </div>
                  </div>
                  <div className="craft-image-box">
                    <img src="/images/parts/precision-gear-set.jpg" alt="Alberto precision gears" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="tab-pane shipping-pane">
                <div className="shipping-grid">
                  <div className="shipping-card">
                    <i className="bi bi-truck"></i>
                    <h4>Complimentary Express Shipping</h4>
                    <p>
                      Dispatched via insured DHL Express or FedEx Priority. Expected delivery within 2–4 business days worldwide.
                    </p>
                  </div>
                  <div className="shipping-card">
                    <i className="bi bi-box"></i>
                    <h4>Artisan Presentation Casket</h4>
                    <p>
                      Encased in an authentic piano-lacquered wooden box with travel pouch, warranty card, and micro-fiber cleaning cloth.
                    </p>
                  </div>
                  <div className="shipping-card">
                    <i className="bi bi-file-earmark-check"></i>
                    <h4>Certificate of Authenticity</h4>
                    <p>
                      Each watch is individually serialized and accompanied by a master horologist inspection certificate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane reviews-pane">
                <div className="reviews-summary-bar">
                  <div className="rating-big-number">
                    <strong>{product.rating}</strong>
                    <span>out of 5.0</span>
                    <div className="stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <div className="reviews-count-meta">
                    <h4>Collector Feedback</h4>
                    <p>98% of owners recommend this timepiece for everyday and evening wear.</p>
                  </div>
                </div>

                <div className="reviews-list">
                  <div className="review-card">
                    <div className="review-top">
                      <span className="reviewer-name">Julian V. • Verified Collector</span>
                      <span className="review-date">3 weeks ago</span>
                    </div>
                    <div className="review-stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <h5>Exceeded all expectations in person</h5>
                    <p>
                      The dial finishing on this {product.name} is magnificent. The anti-reflective sapphire crystal
                      gives the watch a clarity that rivals pieces three times its price. The strap is supple right out of the box.
                    </p>
                  </div>

                  <div className="review-card">
                    <div className="review-top">
                      <span className="reviewer-name">Marcus S. • Horology Enthusiast</span>
                      <span className="review-date">1 month ago</span>
                    </div>
                    <div className="review-stars">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <h5>Outstanding weight and proportions</h5>
                    <p>
                      Wears comfortably on the wrist with ideal presence. The variation in strap options made it easy
                      to match with formal suits or weekend wear.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          RELATED PRODUCTS SECTION
          ========================================= */}
      <section className="product-related-section">
        <div className="related-inner">
          <div className="related-header">
            <p className="subtitle">YOU MAY ALSO ADMIRE</p>
            <h2>Related <span>Timepieces</span></h2>
            <p className="intro">
              Curated companions sharing the horological design language of the {product.name}.
            </p>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((rel) => (
              <article
                className="related-product-card"
                key={rel.id}
                onClick={() => navigateTo('product', rel.id)}
              >
                <div className="related-image-wrap">
                  <img src={rel.image} alt={rel.name} loading="lazy" />
                  <span className="related-cat-badge">{rel.category}</span>
                </div>

                <div className="related-content">
                  <div className="related-stars">
                    <i className="bi bi-star-fill"></i>
                    <span>{rel.rating}</span>
                  </div>
                  <h3>{rel.name}</h3>
                  <p className="related-price">${rel.price.toLocaleString()}</p>
                  <button
                    type="button"
                    className="related-view-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateTo('product', rel.id)
                    }}
                  >
                    View Timepiece
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FULL-SCREEN LIGHTBOX MODAL
          ========================================= */}
      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen watch gallery"
        >
          <div
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="lightbox-topbar">
              <div className="lightbox-title-wrap">
                <h4>{product.name}</h4>
                <span>Image {activeImageIndex + 1} of {galleryImages.length}</span>
              </div>

              <div className="lightbox-controls">
                {/* Toggle Zoom in Lightbox */}
                <button
                  type="button"
                  className="lb-btn"
                  onClick={() => setLightboxZoom((z) => (z === 1 ? 2 : 1))}
                  title={lightboxZoom === 1 ? 'Zoom In (2x)' : 'Reset Zoom (1x)'}
                  aria-label="Toggle zoom"
                >
                  <i className={`bi ${lightboxZoom === 1 ? 'bi-zoom-in' : 'bi-zoom-out'}`}></i>
                </button>

                {/* Close */}
                <button
                  type="button"
                  className="lb-btn close"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close Lightbox"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Main Lightbox Stage */}
            <div className="lightbox-stage">
              {/* Prev Button */}
              <button
                type="button"
                className="lb-nav-btn prev"
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                  )
                }
                aria-label="Previous image"
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {/* Main Expanded Image */}
              <div className="lb-image-stage">
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`lb-active-image ${lightboxZoom === 2 ? 'zoomed-in' : ''}`}
                  onClick={() => setLightboxZoom((z) => (z === 1 ? 2 : 1))}
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                className="lb-nav-btn next"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
                }
                aria-label="Next image"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* Lightbox Thumbnails Strip */}
            <div className="lightbox-thumbnails-strip">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`lb-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
