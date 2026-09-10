import { ShopProvider } from './context/ShopContext'
import { useShop } from './context/useShop'
import { AuthProvider } from './context/AuthContext'
import { AudioProvider } from './context/AudioContext'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import Products from './components/products/Products'
import Packages from './components/packages/Packages'
import WatchParts from './components/watchParts/WatchParts'
import Technology from './components/technology/Technology'
import Gallery from './components/gallery/Gallery'
import About from './components/about/About'
import StoreLocator from './components/storeLocator/StoreLocator'
import Support from './components/support/Support'
import Contact from './components/contact/Contact'
import SellWatch from './components/sellWatch/SellWatch'
import Footer from './components/footer/Footer'
import ShopPage from './components/shop/ShopPage'
import ProductDetailPage from './components/productDetail/ProductDetailPage'
import CheckoutPage from './components/checkout/CheckoutPage'
import AccountPage from './components/account/AccountPage'
import CartDrawer from './components/cart/CartDrawer'
import QuickViewModal from './components/quickView/QuickViewModal'
import AuthModal from './components/auth/AuthModal'
import SettingsModal from './components/settings/SettingsModal'
import FloatingAudioPlayer from './components/audio/FloatingAudioPlayer'

function MainContent() {
  const { page, activeProductId, toast } = useShop()

  return (
    <>
      <Navbar />

      {page === 'shop' && <ShopPage />}

      {page === 'product' && <ProductDetailPage key={activeProductId} />}

      {page === 'checkout' && <CheckoutPage />}

      {page === 'account' && <AccountPage />}

      {page === 'sell-watch' && <SellWatch />}

      {page === 'home' && (
        <>
          <Hero />
          <Products />
          <Packages />
          <WatchParts />
          <Technology />
          <Gallery />
          <About />
          <StoreLocator />
          <Support />
          <Contact />
          <SellWatch />
        </>
      )}

      <CartDrawer />
      <QuickViewModal />
      <AuthModal />
      <SettingsModal />
      <FloatingAudioPlayer />

      {toast && (
        <div className={`alberto-toast ${toast.type}`}>
          <i
            className={
              toast.type === 'error'
                ? 'bi bi-exclamation-octagon-fill'
                : toast.type === 'info'
                ? 'bi bi-info-circle-fill'
                : 'bi bi-check-circle-fill'
            }
          ></i>
          <span>{toast.message}</span>
        </div>
      )}

      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <ShopProvider>
          <MainContent />
        </ShopProvider>
      </AudioProvider>
    </AuthProvider>
  )
}

export default App
