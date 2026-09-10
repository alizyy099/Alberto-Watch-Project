import { useState, useRef } from 'react'
import { useAuth } from '../../context/useAuth'
import { useShop } from '../../context/useShop'
import './SellWatch.css'

const WATCH_BRANDS = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'Vacheron Constantin',
  'Alberto Clocks',
  'Breitling',
  'TAG Heuer',
  'Tudor',
  'IWC Schaffhausen',
  'Jaeger-LeCoultre',
  'Panerai',
  'Hublot',
  'Grand Seiko',
  'Other'
]

const CONDITIONS = [
  { value: 'Unworn', label: 'Unworn / Factory Stickered', desc: 'Never worn, original stickers, flawless condition' },
  { value: 'Mint', label: 'Mint / Like New', desc: 'Minimal to no signs of wear, perfectly running' },
  { value: 'Excellent', label: 'Excellent', desc: 'Minor hairline scratches from gentle wear' },
  { value: 'Good', label: 'Good', desc: 'Noticeable signs of regular wear, no deep gouges' },
  { value: 'Vintage', label: 'Vintage Patina', desc: 'Original aged dial, honest collector character' },
  { value: 'Needs Repair', label: 'Needs Servicing', desc: 'Requires mechanical service or polishing' }
]

const PROVENANCE_OPTIONS = [
  { value: 'Complete Set', label: 'Complete Set (Original Box & Papers / Card)' },
  { value: 'Box Only', label: 'Watch with Original Presentation Box Only' },
  { value: 'Papers Only', label: 'Watch with Original Warranty Papers / Card Only' },
  { value: 'Watch Only', label: 'Watch Only (No Box, No Papers)' }
]

export default function SellWatch() {
  const { user, addSellSubmission } = useAuth()
  const { navigateTo, showToast } = useShop()

  // Image Upload state
  const [uploadedImages, setUploadedImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Form states
  const [brand, setBrand] = useState('Rolex')
  const [customBrand, setCustomBrand] = useState('')
  const [model, setModel] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [year, setYear] = useState('')
  const [material, setMaterial] = useState('Stainless Steel')
  const [condition, setCondition] = useState('Excellent')
  const [boxPapers, setBoxPapers] = useState('Complete Set')
  const [expectedPrice, setExpectedPrice] = useState('')
  const [transactionType, setTransactionType] = useState('trade-in') // 'payout' | 'trade-in'
  const [notes, setNotes] = useState('')

  // Seller Details
  const [sellerName, setSellerName] = useState(user?.name || '')
  const [sellerEmail, setSellerEmail] = useState(user?.email || '')
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '')
  const [sellerCountry, setSellerCountry] = useState(user?.address?.country || 'Switzerland')

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  // Handle Image Files
  const handleFiles = (files) => {
    const fileList = Array.from(files)
    const validImages = fileList.filter((file) => file.type.startsWith('image/'))

    if (validImages.length === 0) {
      showToast('Please upload valid image files (JPG, PNG, WEBP).', 'error')
      return
    }

    const newImagePreviews = validImages.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      url: URL.createObjectURL(file)
    }))

    setUploadedImages((prev) => [...prev, ...newImagePreviews])
    showToast(`Added ${validImages.length} watch photo${validImages.length > 1 ? 's' : ''}.`, 'success')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveImage = (idToRemove) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== idToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (uploadedImages.length === 0) {
      showToast('Please upload at least 1 photo of your timepiece.', 'error')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const brandToSave = brand === 'Other' ? customBrand || 'Bespoke Brand' : brand
      const numericPrice = parseFloat(expectedPrice) || 5000
      const estimateLow = Math.round(numericPrice * 0.95)
      const estimateHigh = Math.round(numericPrice * 1.1)

      const submissionData = {
        brand: brandToSave,
        model: model || 'Fine Chronometer',
        referenceNumber,
        year,
        material,
        condition,
        boxPapers,
        expectedPrice: numericPrice,
        transactionType,
        notes,
        sellerName,
        sellerEmail,
        sellerPhone,
        sellerCountry,
        estimateRange: `$${estimateLow.toLocaleString()} – $${estimateHigh.toLocaleString()}`,
        images: uploadedImages.map((img) => img.url)
      }

      const ticket = addSellSubmission(submissionData)
      setSubmittedTicket(ticket)
      setIsSubmitting(false)
      showToast('Timepiece appraisal dossier submitted successfully!', 'success')
    }, 1200)
  }

  // If submitted, show confirmed appraisal ticket
  if (submittedTicket) {
    return (
      <section className="sell-watch-section" id="sell-watch">
        <div className="sell-confirmed-card">
          <div className="sell-confirmed-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <span className="appraisal-ticket-tag">GENEVA APPRAISAL DOSSIER CREATED</span>
          <h2>Dossier #{submittedTicket.ticketId}</h2>
          <p className="appraisal-lead">
            Thank you, {submittedTicket.sellerName}. Your {submittedTicket.brand} {submittedTicket.model} has been
            assigned to an Alberto Senior Horologist. A preliminary written appraisal offer will be sent to{' '}
            <strong>{submittedTicket.sellerEmail}</strong> within 24 hours.
          </p>

          <div className="appraisal-summary-box">
            <div className="summary-row-top">
              <div>
                <h5>{submittedTicket.brand} — {submittedTicket.model}</h5>
                <span>Ref: {submittedTicket.referenceNumber || 'N/A'} • Condition: {submittedTicket.condition}</span>
              </div>
              <span className="appraisal-status-chip">
                <i className="bi bi-hourglass-split"></i> Under Review
              </span>
            </div>

            <div className="appraisal-valuation-preview">
              <div className="valuation-stat">
                <span>Indicative Valuation Range</span>
                <strong>{submittedTicket.estimateRange}</strong>
              </div>
              <div className="valuation-stat">
                <span>Transaction Preference</span>
                <strong style={{ color: '#d9bd72' }}>
                  {submittedTicket.transactionType === 'trade-in'
                    ? 'Trade-in (+15% Alberto Boutique Credit)'
                    : 'Direct Wire Cash Payout'}
                </strong>
              </div>
            </div>

            {submittedTicket.images && submittedTicket.images.length > 0 && (
              <div className="appraisal-uploaded-strip">
                <span>Attached Photos ({submittedTicket.images.length}):</span>
                <div className="photos-row">
                  {submittedTicket.images.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} alt={`Watch photo ${i + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="confirmed-buttons-group">
            <button
              type="button"
              className="btn-view-account"
              onClick={() => navigateTo('account')}
            >
              <i className="bi bi-person-badge"></i>
              View Dossier in Collector Suite
            </button>

            <button
              type="button"
              className="btn-submit-another"
              onClick={() => {
                setSubmittedTicket(null)
                setUploadedImages([])
                setModel('')
                setReferenceNumber('')
                setExpectedPrice('')
                setNotes('')
              }}
            >
              Appraise Another Watch
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sell-watch-section" id="sell-watch">
      {/* Header */}
      <div className="sell-watch-header">
        <p className="sell-watch-subtitle">THE ALBERTO HOROLOGY CONSIGNMENT & ACQUISITION</p>
        <h2>Sell Or Trade Your <span>Timepiece</span></h2>
        <p className="sell-watch-intro">
          Receive a guaranteed market valuation from Geneva master watchmakers.
          Choose between direct bank wire liquidation or enjoy a <strong>+15% trade-in bonus</strong> towards
          any timepiece in the Alberto collection.
        </p>

        <div className="sell-perks-strip">
          <div className="perk-card">
            <i className="bi bi-shield-check"></i>
            <div>
              <h6>Insured Armored Transit</h6>
              <span>Complimentary prepaid Swiss courier kit</span>
            </div>
          </div>
          <div className="perk-card">
            <i className="bi bi-clock-history"></i>
            <div>
              <h6>24-Hour Valuation</h6>
              <span>Binding offer from certified horologists</span>
            </div>
          </div>
          <div className="perk-card">
            <i className="bi bi-currency-exchange"></i>
            <div>
              <h6>+15% Trade-in Bonus</h6>
              <span>Maximum value towards Alberto models</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Appraisal Form Card */}
      <div className="sell-watch-card">
        <div className="sell-watch-card-header">
          <div className="sell-watch-icon">
            <i className="bi bi-watch"></i>
          </div>
          <div>
            <p>GENEVA HOROLOGY APPRAISAL DOSSIER</p>
            <h3>Submit Watch Details & Imagery</h3>
          </div>
        </div>

        <form className="sell-watch-form" onSubmit={handleSubmit}>
          {/* =========================================
              IMAGE UPLOADER SECTION (FEATURE REQUIREMENT)
              ========================================= */}
          <div className="form-section upload-section-container">
            <div className="form-section-title">
              <span>01</span>
              <h4>Upload Watch Photographs (Required)</h4>
            </div>

            <p className="upload-section-lead">
              High-resolution imagery allows our master horologists to assess dial integrity, bezel crispness,
              and movement provenance without requiring initial shipment.
            </p>

            {/* Drop Zone */}
            <div
              className={`watch-upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-dropzone-icon">
                <i className="bi bi-cloud-arrow-up"></i>
              </div>

              <h4>Drag & Drop Watch Photos Here</h4>
              <p>or click to browse your files from your computer</p>

              <button
                type="button"
                className="btn-select-files"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <i className="bi bi-camera"></i>
                Select Images
              </button>

              <input
                ref={fileInputRef}
                id="watch-images"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files)
                }}
              />

              <small className="upload-formats-hint">
                Supports JPG, PNG, WEBP • Max 10MB per image
              </small>
            </div>

            {/* Uploaded Images Preview Strip */}
            {uploadedImages.length > 0 && (
              <div className="uploaded-previews-section">
                <div className="previews-header">
                  <h5>Uploaded Images ({uploadedImages.length})</h5>
                  <button
                    type="button"
                    className="btn-clear-all-images"
                    onClick={() => setUploadedImages([])}
                  >
                    Remove All
                  </button>
                </div>

                <div className="previews-grid">
                  {uploadedImages.map((img, idx) => (
                    <div key={img.id} className="preview-card">
                      <div className="preview-img-wrap">
                        <img src={img.url} alt={`Upload ${idx + 1}`} />
                        {idx === 0 && <span className="primary-badge">Primary Photo</span>}
                        <button
                          type="button"
                          className="btn-remove-preview"
                          onClick={() => handleRemoveImage(img.id)}
                          title="Remove image"
                          aria-label="Remove image"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <span className="preview-name">{img.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Photography Angles Guide */}
            <div className="photo-angles-guide">
              <h6>Recommended Photography Angles:</h6>
              <div className="angles-chips-row">
                <span><i className="bi bi-check2-circle"></i> 1. Front Dial & Crystal</span>
                <span><i className="bi bi-check2-circle"></i> 2. Caseback & Serial</span>
                <span><i className="bi bi-check2-circle"></i> 3. Crown & Bezel Profile</span>
                <span><i className="bi bi-check2-circle"></i> 4. Clasp & Bracelet</span>
                <span><i className="bi bi-check2-circle"></i> 5. Box & Guarantee Papers</span>
              </div>
            </div>
          </div>

          {/* =========================================
              SECTION 2: WATCH SPECIFICATIONS
              ========================================= */}
          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>
              <h4>Watch Specifications</h4>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand / Manufacture</label>
                <select
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                >
                  {WATCH_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {brand === 'Other' ? (
                <div className="form-group">
                  <label htmlFor="custom-brand">Specify Brand Name</label>
                  <input
                    id="custom-brand"
                    type="text"
                    placeholder="e.g. Richard Mille"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="watch-name">Model Name</label>
                  <input
                    id="watch-name"
                    type="text"
                    placeholder="e.g. Submariner Date, Royal Oak, Speedmaster"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="watch-ref">Reference / Model Number</label>
                <input
                  id="watch-ref"
                  type="text"
                  placeholder="e.g. 126610LN, 15500ST"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="watch-year">Year of Manufacture</label>
                <input
                  id="watch-year"
                  type="text"
                  placeholder="e.g. 2022 (or Approximate)"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="case-material">Case Material</label>
              <select
                id="case-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="Stainless Steel">316L / 904L Stainless Steel</option>
                <option value="18k Yellow Gold">18k Yellow Gold</option>
                <option value="18k Rose Gold">18k Rose Gold</option>
                <option value="18k White Gold">18k White Gold</option>
                <option value="Platinum">950 Platinum</option>
                <option value="Titanium">Grade 5 Titanium</option>
                <option value="Two-Tone">Two-Tone (Steel & Gold)</option>
                <option value="Ceramic">Ceramic</option>
              </select>
            </div>
          </div>

          {/* =========================================
              SECTION 3: CONDITION & PROVENANCE
              ========================================= */}
          <div className="form-section">
            <div className="form-section-title">
              <span>03</span>
              <h4>Condition & Provenance</h4>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condition">Physical & Mechanical Condition</label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="box-papers">Original Box & Papers</label>
                <select
                  id="box-papers"
                  value={boxPapers}
                  onChange={(e) => setBoxPapers(e.target.value)}
                  required
                >
                  {PROVENANCE_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="issues">Blemishes, Scratches or Service History</label>
              <textarea
                id="issues"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any scratches on crystal, bezel dings, recent factory service, or replacement parts..."
              ></textarea>
            </div>
          </div>

          {/* =========================================
              SECTION 4: VALUATION & TRANSACTION TYPE
              ========================================= */}
          <div className="form-section">
            <div className="form-section-title">
              <span>04</span>
              <h4>Desired Valuation & Payout Preference</h4>
            </div>

            <div className="form-group">
              <label htmlFor="expected-price">Expected Net Value ($ USD)</label>
              <input
                id="expected-price"
                type="number"
                placeholder="e.g. 9500"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                required
              />
            </div>

            <div className="transaction-type-cards">
              <label className={`type-card ${transactionType === 'trade-in' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  checked={transactionType === 'trade-in'}
                  onChange={() => setTransactionType('trade-in')}
                />
                <div className="type-card-body">
                  <div className="type-card-title">
                    <strong>Alberto Trade-In Credit</strong>
                    <span className="bonus-badge">+15% Bonus Value</span>
                  </div>
                  <p>Apply your watch value plus a 15% VIP credit towards acquiring any Alberto luxury timepiece.</p>
                </div>
              </label>

              <label className={`type-card ${transactionType === 'payout' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="transactionType"
                  checked={transactionType === 'payout'}
                  onChange={() => setTransactionType('payout')}
                />
                <div className="type-card-body">
                  <div className="type-card-title">
                    <strong>Direct Bank Wire Liquidation</strong>
                    <span className="payout-badge">Fast Swiss Wire</span>
                  </div>
                  <p>Instant cash funds transferred directly to your bank account upon physical verification.</p>
                </div>
              </label>
            </div>
          </div>

          {/* =========================================
              SECTION 5: SELLER CONTACT
              ========================================= */}
          <div className="form-section">
            <div className="form-section-title">
              <span>05</span>
              <h4>Collector Contact Details</h4>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seller-name">Full Name</label>
                <input
                  id="seller-name"
                  type="text"
                  placeholder="e.g. Julian Vance"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller-email">Email Address</label>
                <input
                  id="seller-email"
                  type="email"
                  placeholder="name@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seller-phone">Phone / WhatsApp</label>
                <input
                  id="seller-phone"
                  type="tel"
                  placeholder="+41 22 819 9000"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller-country">Country of Residence</label>
                <select
                  id="seller-country"
                  value={sellerCountry}
                  onChange={(e) => setSellerCountry(e.target.value)}
                >
                  <option value="Switzerland">Switzerland</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Monaco">Monaco</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="sell-watch-submit">
            <p>
              By submitting this dossier, your information is processed confidentially under Swiss horology secrecy laws.
              No obligation to accept valuation.
            </p>

            <button
              type="submit"
              className="sell-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Analyzing Timepiece Dossier...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill"></i>
                  Submit Timepiece for Master Appraisal
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
