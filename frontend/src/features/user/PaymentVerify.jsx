import React, { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyPaymentQuery } from './venueApi'
import './PaymentVerify.scss'

function PaymentVerify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const bookingId = searchParams.get('bookingId')
  const { data, error, isLoading, isError } = useVerifyPaymentQuery(bookingId, { skip: !bookingId })

  const paymentData = data?.data
  const status = paymentData?.status || 'Unknown'
  const message = data?.message || ''

  useEffect(() => {
    if (status === 'confirmed') {
      navigate('/my-bookings')
    }
  }, [status, navigate])

  return (
    <div className="payment-verify-page">
      <main className="container">
        <div className="payment-card">
          <h1>Payment Verification</h1>

          {!bookingId && (
            <p className="status-text">No booking ID found in the URL. Please return to your bookings page.</p>
          )}

          {bookingId && isLoading && (
            <p className="status-text">Verifying payment status, please wait...</p>
          )}

          {bookingId && isError && (
            <div className="status-card failed">
              <h2>Unable to verify payment</h2>
              <p>{error?.data?.message || error?.message || 'Something went wrong while verifying payment.'}</p>
            </div>
          )}

          {bookingId && !isLoading && !isError && data && (
            <div className={`status-card ${status === 'confirmed' ? 'success' : status === 'failed' ? 'failed' : 'pending'}`}>
              <h2>
                {status === 'confirmed' ? 'Payment Confirmed' : status === 'failed' ? 'Payment Failed' : 'Payment Pending'}
              </h2>
              {message && <p>{message}</p>}
              <div className="payment-info">
                <div>
                  <span>Booking ID</span>
                  <strong>{bookingId}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{status}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="action-row">
            <Link to="/my-bookings" className="secondary-btn">
              View My Bookings
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentVerify
