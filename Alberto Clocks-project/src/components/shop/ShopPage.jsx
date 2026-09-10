import { useState, useMemo } from 'react'
import { useShop } from '../../context/useShop'
import {
  products as allProducts,
  getAllCategories,
  getAllColors,
  getPriceBounds
} from '../../data/enhancedProducts'
import './ShopPage.css'

export default function ShopPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    navigateTo,
    addToCart,
    setQuickViewProduct
  } = useShop()

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [activeCardColor, setActiveCardColor] = useState({}) // { [productId]: colorName }

  const categories = useMemo(() => getAllCategories(), [])
  const colors = useMemo(() => getAllColors(), [])
  const priceBounds = useMemo(() => getPriceBounds(), [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...allProducts]

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      list = list.filter((p) => p.category === filters.category)
    }

    // Color filter
    if (filters.color && filters.color !== 'All') {
      list = list.filter((p) => p.color === filters.color)
    }

    // Price range filter
    list = list.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    )

    // Movement filter
    if (filters.movement && filters.movement !== 'All') {
      list = list.filter((p) => {
        if (filters.movement === 'Automatic') return p.category === 'Automatic' || p.specs?.movement?.includes('Automatic')
        if (filters.movement === 'Quartz') return p.specs?.movement?.includes('Quartz')
        if (filters.movement === 'Smart') return p.category === 'Smart'
        return true
      })
    }

    // In Stock filter
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock)
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        list.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        list.sort((a, b) => b.popularity - a.popularity)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        list.sort((a, b) => b.id - a.id)
        break
    }

    return list
  }, [filters])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts = { All: allProducts.length }
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.category !== 'All' ||
      filters.color !== 'All' ||
      filters.minPrice > priceBounds.min ||
      filters.maxPrice < priceBounds.max ||
      filters.movement !== 'All' ||
      filters.inStockOnly
    )
  }, [filters, priceBounds])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.category !== 'All') count++
    if (filters.color !== 'All') count++
    if (filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max) count++
    if (filters.movement !== 'All') count++
    if (filters.inStockOnly) count++
    return count
  }, [filters, priceBounds])

  const handleCardColorSelect = (e, productId, colorName) => {
    e.stopPropagation()
    setActiveCardColor((prev) => ({ ...prev, [productId]: colorName }))
  }

  return (
    <div className="shop-page">
      {/* Editorial Hero Banner */}
      <section className="shop-hero">
        <div className="shop-hero-inner">
          <div className="shop-breadcrumbs">
            <button type="button" onClick={() => navigateTo('home')}>Home</button>
            <i className="bi bi-chevron-right"></i>
            <span className="current">Shop Catalog</span>
          </div>

          <p className="shop-hero-tag">THE ALBERTO HOROLOGY ATELIER</p>
          <h1>Fine Watchmaking <span>Collection</span></h1>
          <p className="shop-hero-lead">
            Explore {allProducts.length} distinctive Swiss-inspired, automatic, and vintage chronographs.
            Filtered by handcraftsmanship, case finish, and bespoke mechanisms.
          </p>

          <div className="shop-hero-stats">
            <div className="stat-pill">
              <i className="bi bi-gem"></i>
              <span>Swiss Sapphire Crystal</span>
            </div>
            <div className="stat-pill">
              <i className="bi bi-shield-check"></i>
              <span>5-Year International Warranty</span>
            </div>
            <div className="stat-pill">
              <i className="bi bi-airplane"></i>
              <span>Complimentary Concierge Courier</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Container */}
      <div className="shop-main-layout">
        {/* Mobile Filter Toggle Bar */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <i className="bi bi-sliders"></i>
            <span>Filters & Categories</span>
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          <div className="shop-layout-switchers">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <i className="bi bi-grid-3x3-gap-fill"></i>
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <i className="bi bi-view-list"></i>
            </button>
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3>Filters</h3>
            <button
              type="button"
              className="close-sidebar-btn"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="sidebar-inner">
            {/* Search filter */}
            <div className="filter-block">
              <h4 className="filter-title">Search Watches</h4>
              <div className="shop-search-input-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search by name, calibre..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
                {filters.search && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-block">
              <h4 className="filter-title">Collections</h4>
              <ul className="category-filter-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      className={`category-item-btn ${filters.category === cat ? 'active' : ''}`}
                      onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                    >
                      <span>{cat}</span>
                      <span className="count-badge">{categoryCounts[cat] || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Filter */}
            <div className="filter-block">
              <div className="filter-title-row">
                <h4 className="filter-title">Price Range</h4>
                <span className="price-readout">
                  ${filters.minPrice} – ${filters.maxPrice}
                </span>
              </div>
              <div className="price-slider-wrap">
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step="20"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  aria-label="Maximum price filter"
                />
              </div>
              <div className="price-inputs-row">
                <div className="price-input-box">
                  <span>Min $</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    min={priceBounds.min}
                    max={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) || priceBounds.min }))
                    }
                  />
                </div>
                <div className="price-input-box">
                  <span>Max $</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    min={filters.minPrice}
                    max={priceBounds.max}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) || priceBounds.max }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Color Swatch Filter */}
            <div className="filter-block">
              <h4 className="filter-title">Case & Dial Finish</h4>
              <div className="color-swatch-grid">
                <button
                  type="button"
                  className={`color-btn-pill ${filters.color === 'All' ? 'active' : ''}`}
                  onClick={() => setFilters((prev) => ({ ...prev, color: 'All' }))}
                >
                  All
                </button>
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-btn-pill ${filters.color === c ? 'active' : ''}`}
                    onClick={() => setFilters((prev) => ({ ...prev, color: c }))}
                  >
                    <span className={`color-dot dot-${c.toLowerCase().replace(/\s+/g, '-')}`}></span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Movement Filter */}
            <div className="filter-block">
              <h4 className="filter-title">Calibre Movement</h4>
              <div className="radio-filter-group">
                {['All', 'Automatic', 'Quartz', 'Smart'].map((mov) => (
                  <label key={mov} className="radio-label">
                    <input
                      type="radio"
                      name="movement"
                      checked={filters.movement === mov}
                      onChange={() => setFilters((prev) => ({ ...prev, movement: mov }))}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">{mov === 'All' ? 'All Movements' : mov}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="filter-block toggle-block">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Ready to Dispatch (In Stock)</span>
              </label>
            </div>

            {/* Reset Filters CTA */}
            {hasActiveFilters && (
              <button type="button" className="reset-filters-btn" onClick={resetFilters}>
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile filters drawer */}
        {mobileFiltersOpen && (
          <div
            className="mobile-filters-overlay"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
        )}

        {/* Catalog Content Area */}
        <main className="shop-content">
          {/* Controls Bar: Sort, View Switcher, Result Counter */}
          <div className="shop-toolbar">
            <div className="toolbar-left">
              <span className="results-count">
                Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} timepieces
              </span>
            </div>

            <div className="toolbar-right">
              {/* Sort By Dropdown */}
              <div className="sort-dropdown-wrap">
                <label htmlFor="shop-sort">Sort By:</label>
                <select
                  id="shop-sort"
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="featured">Featured Watches</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>

              {/* Layout Switcher for Desktop */}
              <div className="desktop-view-switchers">
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                  aria-label="List view"
                >
                  <i className="bi bi-view-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filter-chips">
              <span className="active-label">Active Filters:</span>
              {filters.search && (
                <span className="filter-chip">
                  Search: &ldquo;{filters.search}&rdquo;
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, search: '' }))}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="filter-chip">
                  Category: {filters.category}
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.color !== 'All' && (
                <span className="filter-chip">
                  Color: {filters.color}
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, color: 'All' }))}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {(filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max) && (
                <span className="filter-chip">
                  ${filters.minPrice} – ${filters.maxPrice}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        minPrice: priceBounds.min,
                        maxPrice: priceBounds.max
                      }))
                    }
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.movement !== 'All' && (
                <span className="filter-chip">
                  Movement: {filters.movement}
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, movement: 'All' }))}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.inStockOnly && (
                <span className="filter-chip">
                  In Stock Only
                  <button type="button" onClick={() => setFilters((p) => ({ ...p, inStockOnly: false }))}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}

              <button type="button" className="clear-all-chips-btn" onClick={resetFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Product Cards Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="shop-no-results">
              <div className="no-results-icon">
                <i className="bi bi-search"></i>
              </div>
              <h3>No Timepieces Found</h3>
              <p>
                We couldn&apos;t find any Alberto watches matching your current combination of filters.
                Try broadening your criteria or reset the filters.
              </p>
              <button type="button" className="reset-cta-btn" onClick={resetFilters}>
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`shop-product-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {filteredProducts.map((product) => {
                const currentColor = activeCardColor[product.id] || product.color || 'Silver'

                return (
                  <article className="shop-product-card" key={product.id}>
                    {/* Top Badges */}
                    <div className="card-top-badges">
                      <span className="category-pill">{product.category}</span>
                      {product.isLimited && <span className="limited-pill">Collector&apos;s Edition</span>}
                    </div>

                    {/* Image Area */}
                    <div
                      className="card-image-wrap"
                      onClick={() => navigateTo('product', product.id)}
                    >
                      <img src={product.image} alt={product.name} loading="lazy" />

                      {/* Quick View Hover Overlay */}
                      <div className="card-hover-actions">
                        <button
                          type="button"
                          className="quick-view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setQuickViewProduct(product)
                          }}
                          title="Quick View"
                        >
                          <i className="bi bi-eye"></i>
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="card-details">
                      {/* Color variations dots */}
                      {product.variations?.colors && (
                        <div className="card-color-swatches">
                          {product.variations.colors.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              className={`card-color-dot ${currentColor === c.name ? 'active' : ''}`}
                              style={{ backgroundColor: c.code }}
                              onClick={(e) => handleCardColorSelect(e, product.id, c.name)}
                              title={c.name}
                              aria-label={c.name}
                            />
                          ))}
                        </div>
                      )}

                      <div className="card-rating">
                        <i className="bi bi-star-fill"></i>
                        <span>{product.rating}</span>
                        <small>({product.reviewCount})</small>
                      </div>

                      <h3
                        className="card-title"
                        onClick={() => navigateTo('product', product.id)}
                      >
                        {product.name}
                      </h3>

                      <p className="card-desc">{product.description}</p>

                      <div className="card-specs-row">
                        <span>{product.specs?.caseDiameter || '41mm'}</span>
                        <span className="divider">•</span>
                        <span>{product.specs?.waterResistance || '100M'}</span>
                      </div>

                      <div className="card-footer">
                        <div className="card-price">
                          ${product.price.toLocaleString()}
                        </div>

                        <div className="card-actions-group">
                          <button
                            type="button"
                            className="card-add-cart-btn"
                            onClick={() => addToCart(product, { color: currentColor }, 1)}
                            title="Add to luxury bag"
                            aria-label="Add to bag"
                          >
                            <i className="bi bi-bag-plus"></i>
                          </button>

                          <button
                            type="button"
                            className="card-details-btn"
                            onClick={() => navigateTo('product', product.id)}
                          >
                            Details
                            <i className="bi bi-arrow-up-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
