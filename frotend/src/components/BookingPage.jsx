import { useState } from 'react';
import './BookingPage.css';

export default function BookingPage() {
  const [hours, setHours] = useState(4);
  const [guestCount, setGuestCount] = useState(50);
  
  const venuePricePerHour = 250;
  const baseTotal = venuePricePerHour * hours;
  const serviceFee = Math.round(baseTotal * 0.08);
  const totalAmount = baseTotal + serviceFee;

  return (
    <div className="booking-page-container">
      
      {/* Left Column: Form Fields */}
      <main className="booking-form-section">
        <h2>Confirm Your Booking</h2>
        <p className="booking-subtitle">Fill in your reservation details and review your custom setup layout specifications.</p>
        
        <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-card-section">
            <h3>1. Date & Time</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Event Date</label>
                <input type="date" required defaultValue="2026-07-15" />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" required defaultValue="14:00" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (Hours)</label>
                <input 
                  type="number" 
                  min="2" 
                  max="24" 
                  value={hours} 
                  onChange={(e) => setHours(Math.max(2, Number(e.target.value)))}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Expected Guests</label>
                <input 
                  type="number" 
                  min="1" 
                  max="200" 
                  value={guestCount} 
                  onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-card-section">
            <h3>2. Payment Information</h3>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="Jane Doe" required />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" maxLength="19" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiration Date</label>
                <input type="text" placeholder="MM/YY" maxLength="5" required />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="password" placeholder="•••" maxLength="3" required />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-confirm-payment">
            Request Secure Booking
          </button>
        </form>
      </main>

      {/* Right Column: Dynamic Invoice Sidebar */}
      <aside className="booking-summary-sidebar">
        <div className="summary-sticky-card">
          <div className="summary-venue-preview">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80" 
              alt="The Glass Atelier" 
            />
            <div>
              <h4>The Glass Atelier</h4>
              <p>📍 Chelsea, Manhattan</p>
              <span className="summary-rating">★ 4.9 (124 reviews)</span>
            </div>
          </div>

          <div className="pricing-breakdown">
            <h3>Price Summary</h3>
            
            <div className="pricing-row">
              <span>${venuePricePerHour} × {hours} hours</span>
              <span>${baseTotal}</span>
            </div>
            
            <div className="pricing-row">
              <span>Host Service Fee (8%)</span>
              <span>${serviceFee}</span>
            </div>
            
            <hr className="summary-divider" />
            
            <div className="pricing-row total-row">
              <span>Total (USD)</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          <div className="guarantee-badge">
            <span className="shield-icon">🛡️</span>
            <p><strong>BookMyVenue Guarantee.</strong> Your payment is kept safe in escrow until your event finishes successfully.</p>
          </div>
        </div>
      </aside>

    </div>
  );
}