import { useState } from 'react'
import { useShop } from '../../context/useShop'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    navigateTo
  } = useShop()

  const [orderComplete, setOrderComplete] = useState(false)
  const orderId = '000000'

  if (!isCartOpen) return null

  const freeShippingThreshold = 1000
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal)

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    navigateTo('checkout')
  }

  const handleClose = () => {
    setIsCartOpen(false)
    setOrderComplete(false)
  }

  return (
    <div className="cart-drawer-backdrop" onClick={handleClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <i className="bi bi-bag-check-fill"></i>
            <div>
              <h3>Alberto Bag</h3>
              <span>{cartCount} {cartCount === 1 ? 'Timepiece' : 'Timepieces'}</span>
            </div>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={handleClose}
            aria-label="Close Shopping Bag"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-shipping-bar">
          <div className="shipping-text">
            {remainingForFreeShipping === 0 ? (
              <span className="unlocked">
                <i className="bi bi-shield-check"></i> Complimentary Concierge Delivery Unlocked
              </span>
            ) : (
              <span>
                Add <strong>${remainingForFreeShipping.toLocaleString()}</strong> more for Complimentary Delivery
              </span>
            )}
          </div>
          <div className="shipping-track">
            <div className="shipping-progress" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Order Completed Screen */}
        {orderComplete ? (
          <div className="order-complete-view">
            <div className="complete-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h4>Order Confirmed</h4>
            <p>
              Thank you for acquiring your Alberto timepiece. Your order has been placed with
              our Geneva master watchmaker suite.
            </p>
            <div className="order-details-box">
              <span>Order Number: <strong>#ALB-{orderId}</strong></span>
              <span>Included: Certificate of Authenticity & 5-Year Guarantee</span>
            </div>
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => {
                handleClose()
                navigateTo('shop')
              }}
            >
              Continue Exploring Collection
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag View */
          <div className="cart-empty-view">
            <div className="empty-icon-box">
              <i className="bi bi-watch"></i>
            </div>
            <h4>Your Bag is Empty</h4>
            <p>Explore our handcrafted Swiss & automatic horology collections to select your timepiece.</p>
            <button
              type="button"
              className="explore-btn"
              onClick={() => {
                handleClose()
                navigateTo('shop')
              }}
            >
              Discover The Collection
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        ) : (
          /* Cart Item List */
          <div className="cart-body">
            <ul className="cart-item-list">
              {cart.map((item) => (
                <li key={item.cartId} className="cart-item">
                  <button
                    type="button"
                    className="cart-item-image"
                    onClick={() => {
                      handleClose()
                      navigateTo('product', item.productId)
                    }}
                    title={`View ${item.name}`}
                  >
                    <img src={item.image} alt={item.name} />
                  </button>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <span className="cart-item-category">{item.category}</span>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.cartId)}
                        title="Remove timepiece"
                        aria-label="Remove item"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>

                    <h5
                      className="cart-item-name"
                      onClick={() => {
                        handleClose()
                        navigateTo('product', item.productId)
                      }}
                    >
                      {item.name}
                    </h5>

                    <div className="cart-item-variations">
                      <span className="var-chip">{item.selectedColor}</span>
                      <span className="var-chip">{item.selectedStrap}</span>
                      <span className="var-chip">{item.selectedCaseSize}</span>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartId, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartId, 1)}
                          aria-label="Increase quantity"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      <span className="cart-item-price">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer with Totals and Checkout */}
        {cart.length > 0 && !orderComplete && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span className="summary-price">${cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-perks">
              <span><i className="bi bi-box2-heart"></i> Includes luxury presentation wooden box</span>
              <span><i className="bi bi-shield-check"></i> 5-Year International Warranty</span>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={handleProceedToCheckout}
            >
              Proceed to Concierge Checkout
              <i className="bi bi-lock-fill"></i>
            </button>

            <button
              type="button"
              className="cart-view-shop-btn"
              onClick={() => {
                handleClose()
                navigateTo('shop')
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
