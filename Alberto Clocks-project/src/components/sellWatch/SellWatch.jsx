import { useState } from 'react'
import './SellWatch.css'

function SellWatch() {
  const [brand, setBrand] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    alert(
      'Your watch has been submitted successfully! Our team will review the details and contact you.'
    )
  }

  return (
    <section className="sell-watch-section" id="sell-watch">

      {/* =========================
          HEADER
      ========================= */}

      <div className="sell-watch-header">

        <p className="sell-watch-subtitle">
          SELL YOUR WATCH
        </p>

        <h2>
          Give Your Timepiece
          <span> A New Story</span>
        </h2>

        <p className="sell-watch-intro">
          Thinking about selling your watch?
          Tell us about your timepiece and our
          team will review the details.
        </p>

      </div>


      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="sell-watch-card">

        <div className="sell-watch-card-header">

          <div className="sell-watch-icon">
            <i className="bi bi-watch"></i>
          </div>

          <div>
            <p>ALBERTO WATCH APPRAISAL</p>

            <h3>
              Submit Your Timepiece
            </h3>
          </div>

        </div>


        <form
          className="sell-watch-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              IMAGE UPLOAD
          ========================= */}

          <div className="watch-upload">

            <div className="upload-icon">
              <i className="bi bi-camera"></i>
            </div>

            <h4>
              Add Watch Images
            </h4>

            <p>
              Upload clear images of your
              watch from different angles.
            </p>

            <label
              htmlFor="watch-images"
              className="upload-button"
            >
              <i className="bi bi-cloud-arrow-up"></i>
              Choose Images
            </label>

            <input
              id="watch-images"
              type="file"
              accept="image/*"
              multiple
            />

            <small>
              JPG, PNG or WEBP
            </small>

          </div>


          {/* =========================
              WATCH INFORMATION
          ========================= */}

          <div className="form-section">

            <div className="form-section-title">
              <span>01</span>
              <h4>Watch Information</h4>
            </div>


            <div className="form-row">

              <div className="form-group">

                <label htmlFor="watch-name">
                  Watch Name / Model
                </label>

                <input
                  id="watch-name"
                  type="text"
                  placeholder="e.g. Submariner"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="brand">
                  Select Brand
                </label>

                <select
                  id="brand"
                  value={brand}
                  onChange={(event) =>
                    setBrand(event.target.value)
                  }
                  required
                >

                  <option value="">
                    Choose a brand
                  </option>

                  <option value="Rolex">
                    Rolex
                  </option>

                  <option value="Omega">
                    Omega
                  </option>

                  <option value="Patek Philippe">
                    Patek Philippe
                  </option>

                  <option value="Audemars Piguet">
                    Audemars Piguet
                  </option>

                  <option value="Cartier">
                    Cartier
                  </option>

                  <option value="TAG Heuer">
                    TAG Heuer
                  </option>

                  <option value="Breitling">
                    Breitling
                  </option>

                  <option value="Tudor">
                    Tudor
                  </option>

                  <option value="Longines">
                    Longines
                  </option>

                  <option value="Seiko">
                    Seiko
                  </option>

                  <option value="Citizen">
                    Citizen
                  </option>

                  <option value="Casio">
                    Casio
                  </option>

                  <option value="Michael Kors">
                    Michael Kors
                  </option>

                  <option value="Bulova">
                    Bulova
                  </option>

                  <option value="Fossil">
                    Fossil
                  </option>

                  <option value="Others">
                    Others
                  </option>

                </select>

              </div>

            </div>


            {/* CUSTOM BRAND */}

            {brand === 'Others' && (
              <div className="form-group custom-brand">

                <label htmlFor="custom-brand">
                  Type Your Brand
                </label>

                <input
                  id="custom-brand"
                  type="text"
                  placeholder="Enter your brand name"
                  required
                />

              </div>
            )}


            <div className="form-row">

              <div className="form-group">

                <label htmlFor="watch-age">
                  Approximate Watch Age
                </label>

                <input
                  id="watch-age"
                  type="text"
                  placeholder="e.g. 3 years"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="condition">
                  Watch Condition
                </label>

                <select
                  id="condition"
                  required
                >

                  <option value="">
                    Select condition
                  </option>

                  <option value="Like New">
                    Like New
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                  <option value="Needs Repair">
                    Needs Repair
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* =========================
              CONDITION & ISSUES
          ========================= */}

          <div className="form-section">

            <div className="form-section-title">
              <span>02</span>
              <h4>Condition & Details</h4>
            </div>


            <div className="form-group">

              <label htmlFor="issues">
                Blemishes or Issues
              </label>

              <textarea
                id="issues"
                rows="5"
                placeholder="Describe any scratches, dents, glass damage, strap issues, movement problems, or other concerns..."
              ></textarea>

            </div>


            <div className="form-group">

              <label htmlFor="additional-details">
                Additional Details
              </label>

              <textarea
                id="additional-details"
                rows="4"
                placeholder="Tell us anything else about your watch, such as original box, papers, receipt, service history, or other details..."
              ></textarea>

            </div>

          </div>


          {/* =========================
              PERSONAL INFORMATION
          ========================= */}

          <div className="form-section">

            <div className="form-section-title">
              <span>03</span>
              <h4>Your Information</h4>
            </div>


            <div className="form-row">

              <div className="form-group">

                <label htmlFor="seller-name">
                  Your Name
                </label>

                <input
                  id="seller-name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="seller-email">
                  Email Address
                </label>

                <input
                  id="seller-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>

          </div>


          {/* =========================
              SUBMIT
          ========================= */}

          <div className="sell-watch-submit">

            <p>
              By submitting this form, you agree
              that Alberto may contact you regarding
              your watch submission.
            </p>

            <button
              type="submit"
              className="sell-submit-button"
            >
              <i className="bi bi-send"></i>

              Submit Watch for Review

              <i className="bi bi-arrow-right"></i>
            </button>

          </div>

        </form>

      </div>

    </section>
  )
}

export default SellWatch