import { useState, useEffect, useMemo, useCallback } from 'react'
import { ShopContext } from './ShopContextInstance'
import { products, getProductById, getPriceBounds } from '../data/enhancedProducts'

const defaultPriceBounds = getPriceBounds()

const INITIAL_FILTERS = {
  search: '',
  category: 'All',
  color: 'All',
  minPrice: defaultPriceBounds.min,
  maxPrice: defaultPriceBounds.max,
  movement: 'All',
  inStockOnly: false,
  sortBy: 'featured'
}

function getInitialRoute() {
  if (typeof window === 'undefined') {
    return { page: 'home', productId: 1, categoryFilter: 'All' }
  }

  const hash = window.location.hash || ''

  if (hash.startsWith('#/product/')) {
    const parts = hash.replace('#/product/', '').split('?')[0]
    const id = parseInt(parts, 10)
    if (!isNaN(id) && products.some((p) => p.id === id)) {
      return { page: 'product', productId: id, categoryFilter: 'All' }
    }
  }

  if (hash.startsWith('#/checkout')) {
    return { page: 'checkout', productId: 1, categoryFilter: 'All' }
  }

  if (hash.startsWith('#/account')) {
    return { page: 'account', productId: 1, categoryFilter: 'All' }
  }

  if (hash.startsWith('#/sell-watch')) {
    return { page: 'sell-watch', productId: 1, categoryFilter: 'All' }
  }

  if (hash.startsWith('#/shop')) {
    const queryIdx = hash.indexOf('?')
    let cat = 'All'
    if (queryIdx !== -1) {
      const searchParams = new URLSearchParams(hash.slice(queryIdx))
      const queryCat = searchParams.get('category')
      if (queryCat) cat = queryCat
    }
    return { page: 'shop', productId: 1, categoryFilter: cat }
  }

  return { page: 'home', productId: 1, categoryFilter: 'All' }
}

const initialRoute = getInitialRoute()

export function ShopProvider({ children }) {
  const [page, setPage] = useState(initialRoute.page)
  const [activeProductId, setActiveProductId] = useState(initialRoute.productId)
  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    category: initialRoute.categoryFilter
  }))
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Toast Notification
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    window.clearTimeout(window._albertoToastTimer)
    window._albertoToastTimer = window.setTimeout(() => {
      setToast(null)
    }, 3800)
  }, [])

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('alberto_cart', JSON.stringify(cart))
    } catch (err) {
      console.warn('Cart localStorage error:', err)
    }
  }, [cart])

  // Parse URL hash on hashchange events
  const parseHash = useCallback(() => {
    const hash = window.location.hash || ''

    if (hash.startsWith('#/product/')) {
      const parts = hash.replace('#/product/', '').split('?')[0]
      const id = parseInt(parts, 10)
      if (!isNaN(id) && products.some((p) => p.id === id)) {
        setActiveProductId(id)
        setPage('product')
        return
      }
    }

    if (hash.startsWith('#/checkout')) {
      setPage('checkout')
      return
    }

    if (hash.startsWith('#/account')) {
      setPage('account')
      return
    }

    if (hash.startsWith('#/sell-watch')) {
      setPage('sell-watch')
      return
    }

    if (hash.startsWith('#/shop')) {
      setPage('shop')
      const queryIdx = hash.indexOf('?')
      if (queryIdx !== -1) {
        const searchParams = new URLSearchParams(hash.slice(queryIdx))
        const cat = searchParams.get('category')
        if (cat) {
          setFilters((prev) => ({ ...prev, category: cat }))
        }
      }
      return
    }

    if (!hash || hash === '#/' || hash === '#home' || hash.startsWith('#')) {
      setPage('home')
    }
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', parseHash)
    return () => window.removeEventListener('hashchange', parseHash)
  }, [parseHash])

  // Navigation function
  const navigateTo = useCallback((targetPage, productId = null, filterOpts = null) => {
    if (filterOpts) {
      setFilters((prev) => ({ ...prev, ...filterOpts }))
    }

    if (targetPage === 'product' && productId) {
      setActiveProductId(productId)
      setPage('product')
      window.location.hash = `#/product/${productId}`
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetPage === 'shop') {
      setPage('shop')
      if (filterOpts?.category && filterOpts.category !== 'All') {
        window.location.hash = `#/shop?category=${encodeURIComponent(filterOpts.category)}`
      } else {
        window.location.hash = '#/shop'
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetPage === 'checkout') {
      setPage('checkout')
      window.location.hash = '#/checkout'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetPage === 'account') {
      setPage('account')
      window.location.hash = '#/account'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetPage === 'sell-watch') {
      setPage('sell-watch')
      window.location.hash = '#/sell-watch'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetPage === 'home') {
      setPage('home')
      window.location.hash = '#/'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Cart operations
  const addToCart = useCallback((product, options = {}, quantity = 1) => {
    const selectedColor = options.color || product.variations?.colors?.[0]?.name || product.color
    const selectedStrap = options.strap || product.variations?.straps?.[0]?.name || 'Italian Calf Leather'
    const selectedCaseSize = options.caseSize || product.variations?.caseSizes?.[0] || '41mm'
    const strapPriceOffset = options.strapPriceOffset || 0
    const unitPrice = product.price + strapPriceOffset

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedStrap === selectedStrap &&
          item.selectedCaseSize === selectedCaseSize
      )

      if (existingIdx > -1) {
        const updated = [...prev]
        updated[existingIdx].quantity += quantity
        return updated
      }

      return [
        ...prev,
        {
          cartId: `${product.id}-${selectedColor}-${selectedStrap}-${selectedCaseSize}-${Date.now()}`,
          productId: product.id,
          product,
          name: product.name,
          image: product.image,
          category: product.category,
          unitPrice,
          quantity,
          selectedColor,
          selectedStrap,
          selectedCaseSize
        }
      ]
    })

    showToast(`Added "${product.name}" to your luxury shopping bag.`)
    setIsCartOpen(true)
  }, [showToast])

  const removeFromCart = useCallback((cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId))
  }, [])

  const updateCartQuantity = useCallback((cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  }, [cart])

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [])

  const activeProduct = useMemo(() => {
    return getProductById(activeProductId)
  }, [activeProductId])

  const value = {
    page,
    setPage,
    navigateTo,
    activeProductId,
    setActiveProductId,
    activeProduct,
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    cartSubtotal,
    quickViewProduct,
    setQuickViewProduct,
    toast,
    showToast
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
