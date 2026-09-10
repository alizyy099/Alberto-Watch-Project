import baseProducts from '../assets/data/products.json'

// Curated variation palettes and gallery assets for luxury horology
const COLOR_PALETTES = {
  Gold: { code: '#d9bd72', label: 'Yellow Gold' },
  'Rose Gold': { code: '#e5a583', label: 'Rose Gold' },
  Silver: { code: '#d1d5db', label: 'Platinum Silver' },
  Black: { code: '#1e2024', label: 'Obsidian Black' },
  Blue: { code: '#1e3a8a', label: 'Midnight Blue' },
  Brown: { code: '#78350f', label: 'Cognac Brown' },
  Green: { code: '#065f46', label: 'Emerald Green' }
}

const STRAP_OPTIONS = [
  { id: 'leather', name: 'Italian Calf Leather', priceOffset: 0, tag: 'Included' },
  { id: 'steel', name: '316L Stainless Steel Bracelet', priceOffset: 85, tag: 'Popular' },
  { id: 'milanese', name: 'Milanese Mesh Band', priceOffset: 65, tag: 'Signature' },
  { id: 'alligator', name: 'Embossed Alligator Strap', priceOffset: 120, tag: 'Luxury' }
]

const CASE_SIZES = ['39mm (Classic)', '41mm (Modern)', '43mm (Executive)']

// Curated supplementary gallery images
const DETAIL_SHOTS = [
  '/images/parts/precision-gear-set.jpg',
  '/images/parts/protective-watch-glass.jpg',
  '/images/parts/premium-leather-strap.jpg',
  '/images/imperial1.jpeg',
  '/images/classic1.jpeg',
  '/images/heritageClassic1.jpeg'
]

// Function to map each product with rich gallery, specs, variations, and reviews
export const products = baseProducts.map((product, idx) => {
  const baseColor = product.color || 'Silver'
  const primaryPalette = COLOR_PALETTES[baseColor] || { code: '#d1d5db', label: baseColor }

  // Generate 2-3 alternate color options
  const alternateColors = Object.entries(COLOR_PALETTES)
    .filter(([name]) => name !== baseColor)
    .slice((idx % 3), (idx % 3) + 2)
    .map(([name, data]) => ({
      name,
      code: data.code,
      label: data.label
    }))

  const variations = {
    colors: [
      { name: baseColor, code: primaryPalette.code, label: primaryPalette.label, image: product.image },
      ...alternateColors.map((alt) => ({
        ...alt,
        image: product.image
      }))
    ],
    straps: STRAP_OPTIONS,
    caseSizes: CASE_SIZES
  }

  // Gallery images: Main photo + detail angles
  const gallery = [
    product.image,
    DETAIL_SHOTS[idx % DETAIL_SHOTS.length],
    DETAIL_SHOTS[(idx + 2) % DETAIL_SHOTS.length],
    DETAIL_SHOTS[(idx + 4) % DETAIL_SHOTS.length]
  ]

  // Movement style inference
  let movement = 'Swiss Quartz Calibre A12'
  if (product.category === 'Automatic') {
    movement = 'Alberto Automatic Calibre 8800 (28,800 vph, 48h reserve)'
  } else if (product.category === 'Luxury') {
    movement = 'Swiss Automatic Chronometer COSC Certified'
  } else if (product.category === 'Smart') {
    movement = 'Alberto OS Connected Core (5-day battery)'
  } else if (product.category === 'Vintage') {
    movement = 'Hand-finished Mechanical Quartz Movement'
  }

  const specs = {
    movement,
    caseMaterial: '316L Surgical Grade Stainless Steel',
    glass: 'Anti-Reflective Double-Domed Sapphire Crystal',
    waterResistance: product.category === 'Sports' ? '200M / 20 ATM' : '100M / 10 ATM',
    caseDiameter: '41mm',
    thickness: '11.8mm',
    lugWidth: '20mm',
    powerReserve: product.category === 'Automatic' ? '48 Hours' : '3-Year Battery Life',
    jewels: product.category === 'Automatic' ? '26 Jewels' : 'Jeweled Escapement',
    warranty: '5-Year Alberto International Warranty'
  }

  const rating = Number((4.6 + ((product.id * 7) % 5) * 0.08).toFixed(1))
  const reviewCount = 24 + ((product.id * 13) % 40)
  const stockCount = 3 + ((product.id * 5) % 12)
  const isLimited = product.price > 800 || product.category === 'Luxury'

  return {
    ...product,
    gallery,
    variations,
    specs,
    rating,
    reviewCount,
    stockCount,
    inStock: true,
    isLimited,
    sku: `ALB-${String(product.id).padStart(3, '0')}-${product.category.substring(0, 3).toUpperCase()}`,
    highlights: [
      'Double Domed Sapphire Glass',
      specs.waterResistance,
      '5-Year Warranty',
      'Complimentary Global Shipping'
    ]
  }
})

// Helper functions
export function getProductById(id) {
  const numericId = Number(id)
  return products.find((p) => p.id === numericId) || products[0]
}

export function getRelatedProducts(currentProduct, limit = 4) {
  if (!currentProduct) return products.slice(0, limit)

  // Same category first, then similar price band, excluding current
  const related = products
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => {
      const aCat = a.category === currentProduct.category ? 1 : 0
      const bCat = b.category === currentProduct.category ? 1 : 0
      if (aCat !== bCat) return bCat - aCat
      return Math.abs(a.price - currentProduct.price) - Math.abs(b.price - currentProduct.price)
    })

  return related.slice(0, limit)
}

export function getAllCategories() {
  const unique = new Set(products.map((p) => p.category))
  return ['All', ...Array.from(unique)]
}

export function getAllColors() {
  const unique = new Set(products.map((p) => p.color))
  return Array.from(unique)
}

export function getPriceBounds() {
  const prices = products.map((p) => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}
