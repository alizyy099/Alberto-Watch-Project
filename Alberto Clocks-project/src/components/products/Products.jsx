import { useMemo, useState } from 'react'
import { useShop } from '../../context/useShop'
import products from '../../assets/data/products.json'
import categories from '../../assets/data/categories.json'
import './Products.css'

function Products() {
  const { navigateTo, addToCart } = useShop()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('latest')
  const [showAll, setShowAll] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const list =
      selectedCategory === 'All'
        ? [...products]
        : products.filter((product) => product.category === selectedCategory)

    if (sortBy === 'popular') {
      return list.sort((a, b) => b.popularity - a.popularity)
    }

    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price)
    }

    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price)
    }

    return list.sort((a, b) => b.id - a.id)
  }, [selectedCategory, sortBy])

  const visibleProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 12)

  const handleProductOrder = (product) => {
    addToCart(product, {}, 1)
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

        <h2>
          Choose Your <span>Timepiece</span>
        </h2>

        <p className="products-intro">
          Start with a collection, then refine your selection by popularity,
          latest arrivals, or explore our complete catalog with advanced horology filters.
        </p>
      </div>

      <div className="category-grid">
        <button
          type="button"
          className={`category-card all-card ${
            selectedCategory === 'All' ? 'active' : ''
          }`}
          onClick={() => chooseCategory('All')}
        >
          <div className="category-card-content">
            <span className="category-index">00</span>
            <i className="bi bi-grid-3x3-gap"></i>
            <h3>All Watches</h3>
            <p>Explore the complete Alberto collection.</p>

            <span className="category-link">
              Explore <i className="bi bi-arrow-right"></i>
            </span>
          </div>
        </button>

        {categories.map((category, index) => (
          <button
            type="button"
            className={`category-card ${
              selectedCategory === category.name ? 'active' : ''
            }`}
            key={category.name}
            onClick={() => chooseCategory(category.name)}
          >
            <img src={category.image} alt={category.name} />
            <div className="category-card-overlay"></div>

            <div className="category-card-content">
              <span className="category-index">0{index + 1}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <span className="category-link">
                Explore <i className="bi bi-arrow-right"></i>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="collection-results" id="collection-results">
        <div className="collection-toolbar">
          <div>
            <p className="toolbar-label">SELECTED COLLECTION</p>

            <h3>
              {selectedCategory === 'All'
                ? 'All Timepieces'
                : `${selectedCategory} Watches`}
            </h3>

            <span>{filteredProducts.length} timepieces available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="shop-now-btn"
              style={{ minHeight: '38px', padding: '8px 16px', fontSize: '11px' }}
              onClick={() => navigateTo('shop', null, { category: selectedCategory })}
            >
              <i className="bi bi-sliders"></i>
              Filter & Search in Shop
            </button>

            <label className="sort-control">
              <span>
                <i className="bi bi-sliders2"></i>
                Sort By
              </span>

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
        </div>

        <div className="products-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <button
                type="button"
                className="product-image"
                onClick={() => navigateTo('product', product.id)}
                aria-label={`View ${product.name}`}
              >
                <img src={product.image} alt={product.name} />

                <span className="product-view">
                  <i className="bi bi-eye"></i>
                  View Details & Zoom
                </span>
              </button>

              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3
                  onClick={() => navigateTo('product', product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.name}
                </h3>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-bottom">
                  <span className="product-price">
                    ${product.price.toLocaleString()}
                  </span>

                  <div className="product-actions">
                    <button
                      type="button"
                      className="details-button"
                      onClick={() => navigateTo('product', product.id)}
                    >
                      Details
                      <i className="bi bi-arrow-up-right"></i>
                    </button>

                    <button
                      type="button"
                      className="buy-button"
                      onClick={() => handleProductOrder(product)}
                      title="Add to luxury bag"
                    >
                      Buy
                      <i className="bi bi-bag-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length > 12 && (
          <div className="show-more-wrapper">
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show More'}
              <i
                className={`bi ${
                  showAll ? 'bi-arrow-up' : 'bi-arrow-down'
                }`}
              ></i>
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div
          className="product-modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="modal-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            </div>

            <div className="modal-content">
              <p>{selectedProduct.category}</p>
              <h3>{selectedProduct.name}</h3>

              <span className="modal-price">
                ${selectedProduct.price.toLocaleString()}
              </span>

              <div className="modal-meta">
                <span>
                  Color
                  <strong>{selectedProduct.color}</strong>
                </span>

                <span>
                  Popularity
                  <strong>{selectedProduct.popularity}/100</strong>
                </span>
              </div>

              <p className="modal-description">
                {selectedProduct.description}
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="modal-action"
                  onClick={() => {
                    handleProductOrder(selectedProduct)
                    setSelectedProduct(null)
                  }}
                >
                  Add to Bag
                  <i className="bi bi-bag-check"></i>
                </button>

                <button
                  type="button"
                  className="modal-action"
                  style={{
                    background: 'transparent',
                    border: '1px solid #d9bd72',
                    color: '#d9bd72'
                  }}
                  onClick={() => {
                    const id = selectedProduct.id
                    setSelectedProduct(null)
                    navigateTo('product', id)
                  }}
                >
                  Full Page & Zoom
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Products