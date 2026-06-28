import { useState } from 'react';
import './ListVenue.css';

export default function ListVenue() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Location' },
    { id: 3, label: 'Pricing' },
    { id: 4, label: 'Review' }
  ];

  return (
    <div className="host-page-wrapper">
      <div className="host-hero-banner">
        <span className="host-badge">Become a Host</span>
        <h2>List Your Space Beautifully</h2>
        <p>Fill out the details below to publish your venue to thousands of event planners.</p>
      </div>

      {/* Modern High-Contrast Stepper Timeline */}
      <div className="stepper-timeline">
        {steps.map((step, index) => (
          <div key={step.id} className="timeline-item">
            <div className="node-row">
              <div className={`timeline-node ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`timeline-line ${currentStep > step.id ? 'active' : ''}`} />
              )}
            </div>
            <span className={`timeline-label ${currentStep >= step.id ? 'active' : ''}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="host-form-container">
        {currentStep === 1 && (
          <div className="step-content-fade">
            <div className="step-header">
              <h3>Basic Information</h3>
              <p>Let's start with the foundational details of your premium listing.</p>
            </div>
            
            <div className="host-input-group">
              <label>Venue Name</label>
              <input type="text" placeholder="e.g. The Grand Ballroom at Emerald Heights" className="styled-input" />
            </div>

            <div className="host-input-group">
              <label>Venue Category</label>
              <div className="select-wrapper">
                <select defaultValue="" className="styled-select">
                  <option value="" disabled>Select a workspace or event category</option>
                  <option value="corporate">Corporate Office / Co-working</option>
                  <option value="party">Banquet & Party Hall</option>
                  <option value="wedding">Wedding Venue Grounds</option>
                  <option value="workshop">Creative Workshop Studio</option>
                </select>
              </div>
            </div>

            <div className="host-input-group">
              <label>Maximum Guest Capacity</label>
              <div className="icon-input-container">
                <span className="input-inner-icon">👥</span>
                <input type="number" placeholder="50" className="styled-input with-icon" />
              </div>
            </div>
          </div>
        )}

        {currentStep > 1 && (
          <div className="step-content-fade placeholder-view">
            <div className="placeholder-icon">⚙️</div>
            <h3>{steps[currentStep - 1].label} Setup</h3>
            <p>Advanced parameters for this layout phase will attach here.</p>
          </div>
        )}

        {/* Elegant Floating Action Bar */}
        <div className="host-actions-row">
          {currentStep > 1 ? (
            <button className="btn-host-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
              Back
            </button>
          ) : (
            <div /> 
          )}
          
          <button 
            className="btn-host-primary" 
            onClick={() => currentStep < 4 ? setCurrentStep(currentStep + 1) : null}
          >
            {currentStep === 4 ? 'Publish Listing 🎉' : 'Continue Step'}
          </button>
        </div>
      </div>

      {/* Re-designed Value Proposition Grid */}
      <div className="host-trust-grid">
        <div className="trust-card">
          <div className="trust-badge-icon">🛡️</div>
          <div>
            <h4>Verified Host Protocol</h4>
            <p>Gain premium visibility status badges instantly. Verified accounts average 3x user engagement conversion metrics.</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-badge-icon">✨</div>
          <div>
            <h4>Dedicated Expert Strategy</h4>
            <p>Access our 24/7 client relations core team to help format your dynamic asset photo layouts seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}