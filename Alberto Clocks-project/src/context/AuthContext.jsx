import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './AuthContextInstance'

const DEMO_USER = {
  id: 'usr_vip_01',
  name: 'Julian Vance',
  email: 'julian.vance@alberto-horology.com',
  phone: '+41 22 819 9000',
  memberTier: 'Geneva Patron (Gold)',
  collectorPoints: 4850,
  joinedYear: '2024',
  address: {
    street: '14 Rue du Rhône, Suite 402',
    city: 'Geneva',
    state: 'GE',
    postalCode: '1204',
    country: 'Switzerland'
  }
}

const INITIAL_ORDERS = [
  {
    orderId: 'ALB-948102',
    date: '2026-08-14',
    status: 'Delivered',
    statusStep: 3, // 1: Preparation, 2: Dispatched, 3: Delivered
    courier: 'DHL Express Concierge (Track: #CH-882910-DHL)',
    items: [
      {
        productId: 7,
        name: 'Aurelius Rose',
        category: 'Luxury',
        image: '/images/watches/aurelius-rose.jpg',
        unitPrice: 1284,
        quantity: 1,
        selectedColor: 'Rose Gold',
        selectedStrap: '316L Stainless Steel Bracelet',
        selectedCaseSize: '41mm (Modern)'
      }
    ],
    shippingAddress: {
      name: 'Julian Vance',
      street: '14 Rue du Rhône, Suite 402',
      city: 'Geneva',
      state: 'GE',
      postalCode: '1204',
      country: 'Switzerland'
    },
    subtotal: 1284,
    shippingCost: 0,
    discount: 0,
    total: 1284
  }
]

const INITIAL_SELL_SUBMISSIONS = [
  {
    ticketId: 'APP-781920',
    date: '2026-08-28',
    brand: 'Rolex',
    model: 'Submariner Date 126610LN',
    year: '2022',
    condition: 'Excellent',
    boxPapers: 'Complete Set (Box & Papers)',
    expectedPrice: 12500,
    status: 'Under Review by Master Horologist',
    estimateRange: '$12,000 – $13,200',
    images: ['/images/classic1.jpeg', '/images/imperial1.jpeg']
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_user')
      return saved ? JSON.parse(saved) : DEMO_USER
    } catch {
      return DEMO_USER
    }
  })

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login') // 'login' | 'register'

  // User Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_orders')
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  // User Sell Submissions
  const [sellSubmissions, setSellSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_sell_submissions')
      return saved ? JSON.parse(saved) : INITIAL_SELL_SUBMISSIONS
    } catch {
      return INITIAL_SELL_SUBMISSIONS
    }
  })

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('alberto_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('alberto_user')
      }
    } catch (e) {
      console.warn('Auth user localStorage error:', e)
    }
  }, [user])

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('alberto_orders', JSON.stringify(orders))
    } catch (e) {
      console.warn('Auth orders localStorage error:', e)
    }
  }, [orders])

  // Persist sell submissions
  useEffect(() => {
    try {
      localStorage.setItem('alberto_sell_submissions', JSON.stringify(sellSubmissions))
    } catch (e) {
      console.warn('Auth submissions localStorage error:', e)
    }
  }, [sellSubmissions])

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
  }, [])

  const login = useCallback((email, _password) => {
    const loggedUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Alberto Collector',
      email,
      phone: '+41 22 819 9000',
      memberTier: 'Horology Member',
      collectorPoints: 1200,
      joinedYear: '2026',
      address: {
        street: '10 Grand Rue',
        city: 'Zurich',
        state: 'ZH',
        postalCode: '8001',
        country: 'Switzerland'
      }
    }
    setUser(loggedUser)
    setIsAuthModalOpen(false)
    return loggedUser
  }, [])

  const register = useCallback((userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'Alberto Collector',
      email: userData.email,
      phone: userData.phone || '+41 22 000 0000',
      memberTier: 'New Member (Silver)',
      collectorPoints: 500,
      joinedYear: '2026',
      address: {
        street: userData.street || '',
        city: userData.city || '',
        state: userData.state || '',
        postalCode: userData.postalCode || '',
        country: userData.country || 'Switzerland'
      }
    }
    setUser(newUser)
    setIsAuthModalOpen(false)
    return newUser
  }, [])

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER)
    setIsAuthModalOpen(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        ...updatedFields,
        address: {
          ...prev.address,
          ...(updatedFields.address || {})
        }
      }
    })
  }, [])

  const addOrder = useCallback((orderData) => {
    const newOrder = {
      ...orderData,
      orderId: orderData.orderId || `ALB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Atelier Geneva Preparation',
      statusStep: 1,
      courier: 'DHL Insured Armored Express'
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }, [])

  const addSellSubmission = useCallback((submissionData) => {
    const newTicket = {
      ...submissionData,
      ticketId: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review by Master Horologist'
    }
    setSellSubmissions((prev) => [newTicket, ...prev])
    return newTicket
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    loginAsDemo,
    logout,
    updateProfile,
    orders,
    addOrder,
    sellSubmissions,
    addSellSubmission
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
