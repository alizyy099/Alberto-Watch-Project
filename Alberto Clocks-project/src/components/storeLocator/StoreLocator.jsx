import { useState } from 'react'
import './StoreLocator.css'
import stores from '../../assets/data/stores.json'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function StoreLocator() {
  const [location, setLocation] = useState(null)
  const [distance, setDistance] = useState(null)
  const [error, setError] = useState('')

  const storeLocation = stores[0]

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371

    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )

    return R * c
  }

  const handleLocation = () => {
    setError('')

    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setLocation({
          latitude,
          longitude
        })

        const calculatedDistance = getDistance(
          latitude,
          longitude,
          storeLocation.latitude,
          storeLocation.longitude
        )

        setDistance(calculatedDistance)
      },
      () => {
        setError(
          'Location access was denied. Please allow location permission and try again.'
        )
      }
    )
  }

  return (
    <section className="store-section" id="store">
      <div className="store-header">
        <p className="store-subtitle">
          STORE LOCATOR
        </p>

        <h2>
          Find Your
          <span> Nearest Store</span>
        </h2>

        <p className="store-intro">
          Discover the Alberto experience and
          find our nearest location using your
          current position.
        </p>
      </div>

      <div className="store-container">
        <div className="store-map">
          <MapContainer
            center={[
              storeLocation.latitude,
              storeLocation.longitude
            ]}
            zoom={13}
            scrollWheelZoom={true}
            style={{
              height: '100%',
              width: '100%'
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                storeLocation.latitude,
                storeLocation.longitude
              ]}
            >
              <Popup>
                <strong>
                  {storeLocation.name}
                </strong>
                <br />
                {storeLocation.city}
              </Popup>
            </Marker>

            {location && (
              <Marker
                position={[
                  location.latitude,
                  location.longitude
                ]}
              >
                <Popup>
                  <strong>
                    Your Current Location
                  </strong>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="store-info">
          <p className="store-number">
            ALBERTO 01
          </p>

          <h3>{storeLocation.name}</h3>

          <p className="store-address">
            {storeLocation.city}
          </p>

          <div className="store-details">
            <div>
              <i className="bi bi-clock"></i>
              <span>{storeLocation.hours}</span>
            </div>

            <div>
              <i className="bi bi-telephone"></i>
              <span>{storeLocation.phone}</span>
            </div>
          </div>

          {distance !== null && (
            <div className="distance-box">
              <i className="bi bi-signpost-2"></i>

              <div>
                <small>Distance from you</small>
                <strong>
                  {distance.toFixed(1)} km
                </strong>
              </div>
            </div>
          )}

          {error && (
            <p className="location-error">
              {error}
            </p>
          )}

          <button
            className="location-btn"
            onClick={handleLocation}
          >
            <i className="bi bi-crosshair"></i>
            {location
              ? 'Update My Location'
              : 'Use My Location'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default StoreLocator