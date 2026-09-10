import { useState, useMemo } from 'react'
import { useShop } from '../../context/useShop'
import { useAuth } from '../../context/useAuth'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, navigateTo, showToast } = useShop()
  const { user, addOrder, isAuthenticated, openAuthModal } = useAuth()

  // Form states (pre-fill with user details if available)
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : 'Julian')
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : 'Vance')
  const [email, setEmail] = useState(user?.email || 'julian.vance@alberto-horology.com')
  const [phone, setPhone] = useState(user?.phone || '+41 22 819 9000')
  const [street, setStreet] = useState(user?.address?.street || '14 Rue du Rhône, Suite 402')
  const [city, setCity] = useState(user?.address?.city || 'Geneva')
  const [state, setState] = useState(user?.address?.state || 'GE')
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '1204')
  const [country, setCountry] = useState(user?.address?.country || 'Switzerland')

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState('complimentary') // 'complimentary' ($0) | 'armored' ($95)

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'wire' | 'crypto'
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912')
  const [cardHolder, setCardHolder] = useState(user?.name || 'JULIAN VANCE')
  const [cardExpiry, setCardExpiry] = useState('11/28')
  const [cardCvv, setCardCvv] = useState('891')

  // Promo Code
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')

  // Gift Message
  const [includeGiftMessage, setIncludeGiftMessage] = useState(false)
  const [giftMessageText, setGiftMessageText] = useState('')

  // Order Submission state
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [wireRefCode] = useState('8942')

  // Calculate Totals
  const shippingCost = shippingMethod === 'armored' ? 95 : 0
  const discountAmount = useMemo(() => {
    return appliedDiscount > 0 ? Math.round((cartSubtotal * appliedDiscount) / 100) : 0
  }, [cartSubtotal, appliedDiscount])

  const finalTotal = Math.max(0, cartSubtotal + shippingCost - discountAmount)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'ALBERTO10') {
      setAppliedDiscount(10)
      setPromoMessage('VIP 10% Collector Privilege Applied')
      showToast('10% VIP reduction applied to your order.', 'success')
    } else if (promoCode.trim().toUpperCase() === 'GENEVA') {
      setAppliedDiscount(15)
      setPromoMessage('Geneva Atelier 15% Privilege Applied')
      showToast('15% Atelier reduction applied.', 'success')
    } else {
      setPromoMessage('Invalid VIP code. Try code: ALBERTO10')
      showToast('Invalid concierge promo code.', 'error')
    }
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const orderId = `ALB-${Math.floor(100000 + Math.random() * 900000)}`
      const orderData = {
        orderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Atelier Geneva Preparation',
        statusStep: 1,
        courier:
          shippingMethod === 'armored'
            ? 'White-Glove Armored Express Courier'
            : 'Insured Concierge DHL Express',
        items: [...cart],
        shippingAddress: {
          name: `${firstName} ${lastName}`,
          street,
          city,
          state,
          postalCode,
          country
        },
        subtotal: cartSubtotal,
        shippingCost,
        discount: discountAmount,
        total: finalTotal,
        giftMessage: includeGiftMessage ? giftMessageText : null
      }

      // Add to AuthContext order history
      addOrder(orderData)
      setConfirmedOrder(orderData)
      clearCart()
      setIsProcessing(false)
      showToast('Order confirmed! Geneva master watchmaker assigned.', 'success')
    }, 1400)
  }

  // If order is confirmed, display full confirmation receipt
  if (confirmedOrder) {
    return (
      <div className="checkout-page">
        <div className="order-confirmed-container">
          <div className="confirmed-icon-circle">
            <i className="bi bi-check-lg"></i>
          </div>

          <span className="order-confirmed-tag">ORDER CONFIRMED & IN PREPARATION</span>
          <h1>Acquisition #{confirmedOrder.orderId}</h1>
          <p className="order-lead-text">
            Thank you, {confirmedOrder.shippingAddress.name}. Your timepiece acquisition has been
            registered with the Alberto Geneva Atelier. A certificate of authenticity and 5-year
            international warranty are being prepared.
          </p>

          <div className="confirmed-dossier-card">
            <div className="dossier-header">
              <div>
                <h5>Geneva Dispatch Dossier</h5>
                <span>Tracking Ref: #{confirmedOrder.orderId}-CH</span>
              </div>
              <span className="courier-badge">
                <i className="bi bi-shield-lock-fill"></i> {confirmedOrder.courier}
              </span>
            </div>

            <div className="dossier-items-list">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="dossier-item">
                  <img src={item.image} alt={item.name} />
                  <div className="dossier-item-info">
                    <h6>{item.name}</h6>
                    <p>{item.selectedColor} • {item.selectedStrap} • {item.selectedCaseSize}</p>
                    <span>Qty: {item.quantity} × ${item.unitPrice.toLocaleString()}</span>
                  </div>
                  <strong className="dossier-price">
                    ${(item.unitPrice * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            <div className="dossier-summary-lines">
              <div className="dossier-line">
                <span>Subtotal</span>
                <span>${confirmedOrder.subtotal.toLocaleString()}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="dossier-line discount">
                  <span>VIP Privilege Discount</span>
                  <span>-${confirmedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="dossier-line">
                <span>Insured Courier Delivery</span>
                <span>{confirmedOrder.shippingCost === 0 ? 'Complimentary' : `$${confirmedOrder.shippingCost}`}</span>
              </div>
              <div className="dossier-line total">
                <span>Total Amount Authorized</span>
                <span>${confirmedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="dossier-shipping-address">
              <h6><i className="bi bi-geo-alt-fill"></i> Insured Destination Address:</h6>
              <p>
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city},{' '}
                {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.postalCode},{' '}
                {confirmedOrder.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="confirmed-actions-row">
            <button
              type="button"
              className="btn-confirmed-account"
              onClick={() => navigateTo('account')}
            >
              <i className="bi bi-person-badge"></i>
              View in Collector Suite
            </button>

            <button
              type="button"
              className="btn-confirmed-shop"
              onClick={() => navigateTo('shop')}
            >
              Continue Exploring
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If Cart is empty
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty-wrap">
          <div className="empty-box-icon">
            <i className="bi bi-bag"></i>
          </div>
          <h2>Your Luxury Bag is Empty</h2>
          <p>Please select an Alberto timepiece from our collection before proceeding to checkout.</p>
          <button
            type="button"
            className="btn-checkout-explore"
            onClick={() => navigateTo('shop')}
          >
            Discover Timepieces
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumbs */}
      <section className="checkout-header-bar">
        <div className="checkout-header-inner">
          <div className="checkout-breadcrumbs">
            <button type="button" onClick={() => navigateTo('home')}>Home</button>
            <i className="bi bi-chevron-right"></i>
            <button type="button" onClick={() => navigateTo('shop')}>Shop Catalog</button>
            <i className="bi bi-chevron-right"></i>
            <span className="current">Concierge Checkout</span>
          </div>

          <div className="checkout-banner-title">
            <h1>Alberto Concierge <span>Checkout</span></h1>
            <p>Direct from our Geneva Master Horology Atelier • Insured Express Transit</p>
          </div>
        </div>
      </section>

      {/* Main Checkout Grid */}
      <div className="checkout-main-grid">
        {/* =========================================
            LEFT COLUMN: SHIPPING & PAYMENT FORM
            ========================================= */}
        <form className="checkout-form-column" onSubmit={handlePlaceOrder}>
          {/* Guest vs User notice */}
          {!isAuthenticated ? (
            <div className="checkout-auth-prompt">
              <div className="prompt-text">
                <i className="bi bi-person-circle"></i>
                <span>Already an Alberto Collector? Sign in for saved delivery preferences.</span>
              </div>
              <button
                type="button"
                className="btn-prompt-login"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="checkout-auth-welcome">
              <i className="bi bi-patch-check-fill"></i>
              <span>Signed in as <strong>{user.name}</strong> ({user.memberTier})</span>
            </div>
          )}

          {/* Section 1: Contact & Delivery Address */}
          <div className="checkout-section-card">
            <div className="section-card-title">
              <span className="step-num">01</span>
              <h3>Insured Destination & Recipient</h3>
            </div>

            <div className="fields-grid-2">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Julian"
                  required
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Vance"
                  required
                />
              </div>
            </div>

            <div className="fields-grid-2">
              <div className="input-group">
                <label>Email Address (For Tracking & Certificate)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone / WhatsApp (For Courier Coordination)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 22 819 9000"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="14 Rue du Rhône, Suite 402"
                required
              />
            </div>

            <div className="fields-grid-3">
              <div className="input-group">
                <label>City / Canton</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Geneva"
                  required
                />
              </div>

              <div className="input-group">
                <label>State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="GE"
                />
              </div>

              <div className="input-group">
                <label>Postal / ZIP</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1204"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Country / Territory</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Switzerland">Switzerland (Geneva Hub)</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United Arab Emirates">United Arab Emirates (Dubai)</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="Monaco">Monaco</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          {/* Section 2: Courier Shipping Options */}
          <div className="checkout-section-card">
            <div className="section-card-title">
              <span className="step-num">02</span>
              <h3>Courier Transit Option</h3>
            </div>

            <div className="shipping-radio-list">
              <label
                className={`shipping-option-card ${shippingMethod === 'complimentary' ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'complimentary'}
                  onChange={() => setShippingMethod('complimentary')}
                />
                <div className="shipping-card-text">
                  <div className="shipping-opt-top">
                    <strong>Complimentary Concierge Delivery</strong>
                    <span className="price-free">Free (Included)</span>
                  </div>
                  <p>Insured DHL Express transit • Delivery in 2–4 business days with signature.</p>
                </div>
              </label>

              <label
                className={`shipping-option-card ${shippingMethod === 'armored' ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'armored'}
                  onChange={() => setShippingMethod('armored')}
                />
                <div className="shipping-card-text">
                  <div className="shipping-opt-top">
                    <strong>White-Glove Armored Express Courier</strong>
                    <span className="price-extra">+$95</span>
                  </div>
                  <p>Next-day priority delivery by dedicated security courier • Time-window appointment.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Luxury Payment */}
          <div className="checkout-section-card">
            <div className="section-card-title">
              <span className="step-num">03</span>
              <h3>Secure Horology Payment</h3>
            </div>

            <div className="payment-method-tabs">
              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <i className="bi bi-credit-card-2-front-fill"></i>
                Credit / Debit Card
              </button>

              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'wire' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('wire')}
              >
                <i className="bi bi-bank2"></i>
                Swiss Escrow Wire
              </button>

              <button
                type="button"
                className={`pay-tab ${paymentMethod === 'crypto' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <i className="bi bi-currency-bitcoin"></i>
                Digital Concierge
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-payment-form">
                <div className="input-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="NAME ON CARD"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Card Number</label>
                  <div className="card-input-container">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 0000 0000 0000"
                      maxLength={19}
                      required
                    />
                    <div className="card-logos">
                      <span className="card-chip-badge">VISA</span>
                      <span className="card-chip-badge">MC</span>
                      <span className="card-chip-badge">AMEX</span>
                    </div>
                  </div>
                </div>

                <div className="fields-grid-2">
                  <div className="input-group">
                    <label>Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Security Code (CVV)</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wire' && (
              <div className="wire-instructions-box">
                <div className="wire-header">
                  <i className="bi bi-shield-check"></i>
                  <div>
                    <h6>Direct Swiss Escrow Wire</h6>
                    <p>Geneva Cantonal Bank (Banque Cantonale de Genève - BCGE)</p>
                  </div>
                </div>
                <div className="wire-details-list">
                  <div><span>IBAN:</span> <strong>CH93 0078 8000 0123 4567 8</strong></div>
                  <div><span>BIC/SWIFT:</span> <strong>BCGECHGGXXX</strong></div>
                  <div><span>Beneficiary:</span> <strong>Alberto Horology SA</strong></div>
                  <div><span>Reference:</span> <strong>#{firstName.substring(0, 3).toUpperCase()}-ACQ-{wireRefCode}</strong></div>
                </div>
                <small className="wire-notice">
                  Your timepiece will be allocated immediately and dispatched upon wire verification (usually same business day).
                </small>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="wire-instructions-box">
                <div className="wire-header">
                  <i className="bi bi-wallet2"></i>
                  <div>
                    <h6>Private Crypto Concierge (BTC / ETH / USDT)</h6>
                    <p>Insured on-chain settlement via BitPay & Swiss crypto gateway</p>
                  </div>
                </div>
                <p className="crypto-text">
                  A personalized payment QR code and 15-minute locked exchange rate will be presented upon clicking &ldquo;Authorize Acquisition&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Bespoke Gift Message */}
          <div className="checkout-section-card gift-section">
            <label className="gift-toggle-label">
              <input
                type="checkbox"
                checked={includeGiftMessage}
                onChange={(e) => setIncludeGiftMessage(e.target.checked)}
              />
              <span className="gift-check-custom"></span>
              <div>
                <strong>Include Bespoke Wax-Sealed Gift Inscription</strong>
                <span>Complimentary Alberto parchment card enclosed in presentation box</span>
              </div>
            </label>

            {includeGiftMessage && (
              <div className="gift-textarea-wrap">
                <textarea
                  rows={3}
                  value={giftMessageText}
                  onChange={(e) => setGiftMessageText(e.target.value)}
                  placeholder="Enter your personal inscription to accompany this horological gift..."
                ></textarea>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="btn-place-order"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Authorizing Acquisition with Geneva Atelier...
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill"></i>
                Authorize Acquisition • ${finalTotal.toLocaleString()}
              </>
            )}
          </button>
        </form>

        {/* =========================================
            RIGHT COLUMN: ORDER SUMMARY SIDEBAR
            ========================================= */}
        <aside className="checkout-summary-column">
          <div className="summary-sticky-card">
            <div className="summary-header">
              <h4>Acquisition Summary</h4>
              <span>{cart.length} {cart.length === 1 ? 'Timepiece' : 'Timepieces'}</span>
            </div>

            {/* Item List */}
            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item.cartId} className="summary-item-card">
                  <div className="summary-item-img-wrap">
                    <img src={item.image} alt={item.name} />
                    <span className="item-qty-badge">{item.quantity}</span>
                  </div>

                  <div className="summary-item-info">
                    <span className="summary-cat">{item.category}</span>
                    <h5>{item.name}</h5>
                    <div className="summary-var-text">
                      <span>{item.selectedColor}</span>
                      <span>•</span>
                      <span>{item.selectedStrap}</span>
                      <span>•</span>
                      <span>{item.selectedCaseSize}</span>
                    </div>
                  </div>

                  <span className="summary-item-price">
                    ${(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* VIP Promo Code Box */}
            <form className="promo-code-form" onSubmit={handleApplyPromo}>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="VIP Concierge Code (Try: ALBERTO10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit">Apply</button>
              </div>
              {promoMessage && (
                <span className={`promo-feedback ${appliedDiscount > 0 ? 'success' : 'error'}`}>
                  {promoMessage}
                </span>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="summary-totals-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>VIP Concierge Privilege ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Insured Courier Delivery</span>
                <span>{shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}</span>
              </div>

              <div className="summary-row">
                <span>Swiss VAT & International Duties</span>
                <span style={{ color: '#34d399' }}>Inclusive</span>
              </div>

              <div className="summary-row grand-total">
                <span>Total Due</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="summary-trust-badges">
              <div className="trust-badge-item">
                <i className="bi bi-shield-check"></i>
                <span>5-Year Master Horology Warranty</span>
              </div>
              <div className="trust-badge-item">
                <i className="bi bi-box2-heart"></i>
                <span>Presentation Piano-Lacquered Wooden Casket</span>
              </div>
              <div className="trust-badge-item">
                <i className="bi bi-patch-check"></i>
                <span>Individual Certificate of Authenticity</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
