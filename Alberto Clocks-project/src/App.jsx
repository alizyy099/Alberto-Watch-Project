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

function App() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  )
}

export default App
