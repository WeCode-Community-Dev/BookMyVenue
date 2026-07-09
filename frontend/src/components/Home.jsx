import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bmvLogo from '../assets/bmv_logo.png';
import homeLogo from '../assets/home_logo.png'

const Home = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Background morphic blobs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(199, 255, 46, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-15%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(199, 255, 46, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        zIndex: 0
      }} />

      {/* Navbar */}
      <nav style={{
        background: 'rgba(15, 15, 15, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '18px 40px',
        borderBottom: '1px solid rgba(199, 255, 46, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px',
          fontWeight: '800'
        }}>
          <img 
            src={bmvLogo} 
            alt="Book My Venue Logo" 
            style={{ 
              height: '52px', 
              width: 'auto',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
            }} 
          />
          <div style={{
            fontSize: '26px',
            letterSpacing: '-1px',
            color: '#FFFFFF'
          }}>
            Book My Venue
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 28px',
              border: '2px solid rgba(199, 255, 46, 0.6)',
              background: 'rgba(255,255,255,0.05)',
              color: '#C7FF2E',
              borderRadius: '50px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#C7FF2E';
              e.target.style.color = '#0F0F0F';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)';
              e.target.style.color = '#C7FF2E';
            }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            style={{
              padding: '12px 28px',
              background: '#C7FF2E',
              color: '#0F0F0F',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.4s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative',
        gap: '0px',
        zIndex: 1
      }}>
        <div>
          <img 
            src={homeLogo} 
            alt="Book My Venue Logo" 
            style={{ 
              height: '424px', 
              width:  '424px',
              filter: 'drop-shadow(0 2px 6px rgba(129, 212, 27, 0.4))'
            }} 
          />
        </div>
        <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            lineHeight: '1.05',
            marginBottom: '24px',
            letterSpacing: '-3.5px',
            background: 'linear-gradient(90deg, #FFFFFF, #C7FF2E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'left'
          }}>
            FIND YOUR<br />
            PERFECT VENUE
          </h1>
          
          <p style={{
            fontSize: '1.4rem',
            color: '#B0B0B0',
            maxWidth: '580px',
            margin: '0 auto 50px',
            lineHeight: '1.6',
            textAlign: 'left',
            lineHeight: '1.1'
          }}>
            Discover extraordinary spaces for your events, celebrations, and unforgettable moments.
          </p>

          <button 
            onClick={() => setShowPopup(true)}
            style={{
              width: '220px',
              height: '40px',
              fontSize: '1.3rem',
              fontWeight: '900',
              color: 'rgb(255, 255, 255)',
              background: 'rgba(154, 202, 21, 0.95)',
              //color: '#0F0F0F',
              border: 'none',
              borderRadius: '60px',
              cursor: 'pointer'
            }}
          >
            START NOW
          </button>
        </div>
      </div>

      {/* Glassmorphic Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 15, 15, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={() => setShowPopup(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(199, 255, 46, 0.25)',
              borderRadius: '28px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
              padding: '65px 55px',
              width: '100%',
              maxWidth: '440px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '25px',
                right: '30px',
                background: 'none',
                border: 'none',
                fontSize: '32px',
                cursor: 'pointer',
                color: '#808080'
              }}
              onMouseOver={(e) => e.target.style.color = '#C7FF2E'}
              onMouseOut={(e) => e.target.style.color = '#808080'}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '92px',
                height: '92px',
                background: 'linear-gradient(135deg, #C7FF2E, #A3E600)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
                color: '#0F0F0F',
                fontSize: '44px',
                boxShadow: '0 0 50px rgba(199, 255, 46, 0.6)'
              }}>
                👋
              </div>
              <h2 style={{ fontSize: '2.7rem', fontWeight: '800', marginBottom: '12px' }}>
                Welcome
              </h2>
              <p style={{ color: '#B0B0B0', fontSize: '1.15rem' }}>
                Please log in or create an account to continue
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '18px 32px',
                  fontSize: '1.18rem',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '60px',
                  background: '#C7FF2E',
                  color: '#0F0F0F',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>

              <button 
                onClick={() => navigate('/signup')}
                style={{
                  padding: '18px 32px',
                  fontSize: '1.18rem',
                  fontWeight: '700',
                  border: '2px solid #C7FF2E',
                  borderRadius: '60px',
                  background: 'transparent',
                  color: '#C7FF2E',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;