import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'linear-gradient(90deg, #b16b6b 0%, #3a5a6b 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
        alt="Background"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      {/* Left content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 600,
        marginLeft: 80,
        color: 'white',
      }}>
        <h1 style={{ fontSize: 80, fontWeight: 700, marginBottom: 24 }}>Bridge</h1>
        <p style={{ fontSize: 22, marginBottom: 40 }}>
          Introducing the power behind 200K+ modern websites. Create any type of site you imagine with 630+ demos.
        </p>
        <button style={{
          background: 'white',
          color: '#222',
          fontWeight: 600,
          fontSize: 18,
          padding: '16px 40px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          BUY NOW $69
        </button>
      </div>
      {/* Right mockup */}
      <div style={{
        position: 'absolute',
        right: 80,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        borderRadius: 32,
        padding: 40,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Mockup"
          style={{ width: 180, height: 180, borderRadius: 16, marginBottom: 24, objectFit: 'cover' }}
        />
        <img
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
          alt="Mobile Mockup"
          style={{ width: 120, borderRadius: 16, objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default Home; 