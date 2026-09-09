import { useMemo, useState } from 'react'
import products from '../../assets/data/products.json'
import categories from '../../assets/data/categories.json'
import './Products.css'

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('latest')
  const [showAll, setShowAll] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const list = selectedCategory === 'All'
      ? [...products]
      : products.filter((product) => product.category === selectedCategory)

    if (sortBy === 'popular') return list.sort((a, b) => b.popularity - a.popularity)
    if (sortBy === 'price-high') return list.sort((a, b) => b.price - a.price)
    if (sortBy === 'price-low') return list.sort((a, b) => a.price - b.price)

    return list.sort((a, b) => b.id - a.id)
  }, [selectedCategory, sortBy])

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12)

  const handleProductOrder = (product) => {
    alert(`Order confirmed: ${product.name} — $${product.price.toLocaleString()}. Thank you for choosing Alberto.`)
  }

  const chooseCategory = (category) => {
    setSelectedCategory(category)
    setShowAll(false)

    window.setTimeout(() => {
      document.getElementById('collection-results')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 60)
  }

  return (
    <section className="products-section" id="products">
      <div className="products-header">
        <p className="products-subtitle">THE ALBERTO COLLECTION</p>
        <h2>Choose Your <span>Timepiece</span></h2>
        <p className="products-intro">
          Start with a collection, then refine your selection by popularity,
          latest arrivals, or price.
        </p>
      </div>

      <div className="category-grid">
        <button
          className={`category-card all-card ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => chooseCategory('All')}
        >
          <div className="category-card-content">
            <span className="category-index">00</span>
            <i className="bi bi-grid-3x3-gap"></i>
            <h3>All Watches</h3>
            <p>Explore the complete Alberto collection.</p>
            <span className="category-link">Explore <i className="bi bi-arrow-right"></i></span>
          </div>
        </button>

        {categories.map((category, index) => (
          <button
            className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
            key={category.name}
            onClick={() => chooseCategory(category.name)}
          >
            <img src={category.image} alt={category.name} />
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <span className="category-index">0{index + 1}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-link">Explore <i className="bi bi-arrow-right"></i></span>
            </div>
          </button>
        ))}
      </div>

      <div className="collection-results" id="collection-results">
        <div className="collection-toolbar">
          <div>
            <p className="toolbar-label">SELECTED COLLECTION</p>
            <h3>{selectedCategory === 'All' ? 'All Timepieces' : `${selectedCategory} Watches`}</h3>
            <span>{filteredProducts.length} timepieces available</span>
          </div>

          <label className="sort-control">
            <span><i className="bi bi-sliders2"></i> Sort By</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setShowAll(false)
              }}
            >
              <option value="latest">Latest Watches</option>
              <option value="popular">Most Popular</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </label>
        </div>

        <div className="products-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <button
                className="product-image"
                onClick={() => setSelectedProduct(product)}
                aria-label={`View ${product.name}`}
              >
                <img src={product.image} alt={product.name} />
                <span className="product-view"><i className="bi bi-eye"></i> View Details</span>
              </button>

              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-bottom">
                  <span className="product-price">${product.price.toLocaleString()}</span>
                  <div className="product-actions">
                    <button className="details-button" onClick={() => setSelectedProduct(product)}>
                      Details <i className="bi bi-arrow-up-right"></i>
                    </button>
                    <button className="buy-button" onClick={() => handleProductOrder(product)}>
                      Buy <i className="bi bi-bag-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length > 12 && (
          <div className="show-more-wrapper">
            <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'Show More'}
              <i className={`bi ${showAll ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="modal-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="modal-content">
              <p>{selectedProduct.category}</p>
              <h3>{selectedProduct.name}</h3>
              <span className="modal-price">${selectedProduct.price.toLocaleString()}</span>

              <div className="modal-meta">
                <span>Color <strong>{selectedProduct.color}</strong></span>
                <span>Popularity <strong>{selectedProduct.popularity}/100</strong></span>
              </div>

              <p className="modal-description">{selectedProduct.description}</p>

              <button className="modal-action" onClick={() => handleProductOrder(selectedProduct)}>
                Buy Now <i className="bi bi-bag-check"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Products
