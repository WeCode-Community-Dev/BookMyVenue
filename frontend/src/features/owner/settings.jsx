import React from 'react';

function OwnerSettings() {
  return (
    <div className="settings-container">
      <div className="settings-header-row">
        <h1 className="settings-title">Account Settings</h1>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h3>Profile Details</h3>
          <div className="settings-form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Jane Smith" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="jane.smith@bookmyvenue.com" />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" defaultValue="+1 (555) 019-2834" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" defaultValue="Owner" disabled className="disabled-input" />
            </div>
          </div>
        </div>

        <div className="settings-section-divider"></div>

        <div className="settings-section">
          <h3>Venue Settings</h3>
          <div className="form-group-checkbox">
            <input type="checkbox" id="notify-bookings" defaultChecked />
            <label htmlFor="notify-bookings">Receive email notifications for new bookings</label>
          </div>
          <div className="form-group-checkbox">
            <input type="checkbox" id="auto-approve" />
            <label htmlFor="auto-approve">Auto-approve pending booking slots (Instant Booking)</label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default OwnerSettings;
