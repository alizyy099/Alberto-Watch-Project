import { useState } from 'react'
import './Support.css'

function Support() {

  const [issue, setIssue] = useState('')

  const getMessagePlaceholder = () => {

    if (issue === 'Get Help') {
      return 'Write your message...'
    }

    if (issue === 'Send Feedback') {
      return 'Write your feedback...'
    }

    if (issue === 'Complaint') {
      return 'Write your complaint...'
    }

    if (issue === 'Repair & Service') {
      return 'Describe your repair or service issue...'
    }

    if (issue === 'General Question') {
      return 'Write your question...'
    }

    return 'Select an issue first...'
  }


  const handleSubmit = (event) => {
    event.preventDefault()

    alert('Your request has been submitted successfully!')
  }


  return (

    <section
      className="support-section"
      id="support"
    >

      {/* Header */}

      <div className="support-header">

        <p className="support-subtitle">
          SUPPORT CENTER
        </p>

        <h2>
          How Can We
          <span> Help You?</span>
        </h2>

        <p className="support-intro">
          Have a question, concern, or feedback?
          Our support team is here to assist you.
        </p>

      </div>


      {/* Support Card */}

      <div className="support-card">

        {/* Card Heading */}

        <div className="support-card-header">

          <div className="support-icon">
            <i className="bi bi-headset"></i>
          </div>

          <div>

            <p>
              ALBERTO SUPPORT
            </p>

            <h3>
              Get in Touch
            </h3>

          </div>

        </div>


        {/* Contact Information */}

        <div className="support-contact">

          <div className="contact-item">

            <i className="bi bi-envelope"></i>

            <div>
              <small>Email</small>
              <span>support@albertoclocks.com</span>
            </div>

          </div>


          <div className="contact-item">

            <i className="bi bi-telephone"></i>

            <div>
              <small>Contact</small>
              <span>+92 21 3456 7890</span>
            </div>

          </div>


          <div className="contact-item">

            <i className="bi bi-geo-alt"></i>

            <div>
              <small>Address</small>
              <span>Karachi, Pakistan</span>
            </div>

          </div>

        </div>


        {/* Form */}

        <form
          className="support-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}

          <div className="form-group">

            <label htmlFor="name">
              Your Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              required
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>


          {/* Address */}

          <div className="form-group">

            <label htmlFor="address">
              Address
            </label>

            <input
              id="address"
              type="text"
              placeholder="Enter your address"
            />

          </div>


          {/* Issue */}

          <div className="form-group">

            <label htmlFor="issue">
              Select Issue
            </label>

            <select
              id="issue"
              value={issue}
              onChange={(event) =>
                setIssue(event.target.value)
              }
              required
            >

              <option value="">
                Choose an option
              </option>

              <option value="Get Help">
                Get Help
              </option>

              <option value="Send Feedback">
                Send Feedback
              </option>

              <option value="Complaint">
                Complaint
              </option>

              <option value="Repair & Service">
                Repair & Service
              </option>

              <option value="General Question">
                General Question
              </option>

            </select>

          </div>


          {/* Message */}

          <div className="form-group message-group">

            <label htmlFor="message">
              Your Message
            </label>

            <textarea
              id="message"
              rows="6"
              placeholder={getMessagePlaceholder()}
              required
            ></textarea>

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="support-submit"
          >

            <i className="bi bi-send"></i>

            Submit Request

          </button>

        </form>

      </div>

    </section>

  )
}

export default Support