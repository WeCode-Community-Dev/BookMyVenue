import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", notes: "" });

  if (!state?.venue) return <div className="not-found">No booking details found. <button onClick={() => navigate("/venues")}>Browse Venues</button></div>;

  const { venue, date, guests, eventType } = state;
  const total = Math.round(venue.price * 1.05);
  const advance = Math.round(total * 0.5);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleConfirm = (e) => {
    e.preventDefault();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="booking-success">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h1>Booking Confirmed!</h1>
          <p>Your venue has been successfully booked. Check your email for confirmation details.</p>
          <div className="booking-ref">Booking ID: <strong>BMV{Date.now().toString().slice(-8)}</strong></div>
          <div className="success-details">
            <div className="sd-row"><span>Venue</span><span>{venue.name}</span></div>
            <div className="sd-row"><span>Date</span><span>{date || "TBD"}</span></div>
            <div className="sd-row"><span>Guests</span><span>{guests}</span></div>
            <div className="sd-row"><span>Advance Paid</span><span>₹{advance.toLocaleString()}</span></div>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate("/")}>Back to Home</button>
            <button className="btn-secondary" onClick={() => navigate("/venues")}>Explore More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-layout">
        {/* Left: Form */}
        <div className="booking-form-side">
          <div className="booking-steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. Details</div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. Payment</div>
            <div className="step-line" />
            <div className={`step ${step >= 3 ? "active" : ""}`}>3. Confirm</div>
          </div>

          {step === 1 && (
            <form className="booking-details-form" onSubmit={() => setStep(2)}>
              <h2>Your Details</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={set("name")} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set("email")} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={set("phone")} className="form-input" required placeholder="+91 ..." />
              </div>
              <div className="form-group">
                <label>Special Requests (optional)</label>
                <textarea value={form.notes} onChange={set("notes")} className="form-input form-textarea" placeholder="Any special arrangements..." />
              </div>
              <button type="submit" className="auth-submit-btn">Continue to Payment →</button>
            </form>
          )}

          {step === 2 && (
            <form className="booking-payment-form" onSubmit={() => setStep(3)}>
              <h2>Payment</h2>
              <p className="payment-note">Pay 50% advance now. Remaining to be paid at venue.</p>
              <div className="advance-amount">₹{advance.toLocaleString()} <span>advance</span></div>
              <div className="payment-methods">
                {["💳 Credit / Debit Card", "📱 UPI", "🏦 Net Banking", "💵 Pay at Venue"].map(m => (
                  <label key={m} className="payment-option">
                    <input type="radio" name="payment" defaultChecked={m.includes("UPI")} />
                    {m}
                  </label>
                ))}
              </div>
              <div className="upi-input">
                <label>UPI ID</label>
                <input type="text" className="form-input" placeholder="yourname@upi" />
              </div>
              <div className="step-buttons">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="auth-submit-btn">Review & Confirm →</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="booking-confirm-form" onSubmit={handleConfirm}>
              <h2>Review & Confirm</h2>
              <div className="confirm-details">
                <div className="cd-row"><span>Name</span><span>{form.name}</span></div>
                <div className="cd-row"><span>Email</span><span>{form.email}</span></div>
                <div className="cd-row"><span>Phone</span><span>{form.phone}</span></div>
                <div className="cd-row"><span>Event</span><span>{eventType}</span></div>
                <div className="cd-row"><span>Date</span><span>{date || "TBD"}</span></div>
                <div className="cd-row"><span>Guests</span><span>{guests}</span></div>
                <div className="cd-row cd-total"><span>Advance Due</span><span>₹{advance.toLocaleString()}</span></div>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" required />
                I agree to the venue's <a href="#">terms & cancellation policy</a>
              </label>
              <div className="step-buttons">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button type="submit" className="auth-submit-btn">Confirm & Pay ₹{advance.toLocaleString()}</button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Summary */}
        <div className="booking-summary-side">
          <h3>Booking Summary</h3>
          <img src={venue.image} alt={venue.name} className="summary-img" />
          <h4>{venue.name}</h4>
          <p>📍 {venue.location}, {venue.city}</p>
          <div className="summary-grid">
            <div className="sg-item"><span>Event</span><strong>{eventType}</strong></div>
            <div className="sg-item"><span>Date</span><strong>{date || "TBD"}</strong></div>
            <div className="sg-item"><span>Guests</span><strong>{guests}</strong></div>
            <div className="sg-item"><span>Capacity</span><strong>{venue.capacity}</strong></div>
          </div>
          <div className="summary-price-breakdown">
            <div className="spb-row"><span>Venue Charge</span><span>₹{venue.price?.toLocaleString()}</span></div>
            <div className="spb-row"><span>Service Fee (5%)</span><span>₹{Math.round(venue.price * 0.05).toLocaleString()}</span></div>
            <div className="spb-row spb-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <div className="spb-row spb-advance"><span>Advance (50%)</span><span>₹{advance.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}