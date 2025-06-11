import React from 'react';

const gridBg = {
  backgroundColor: '#fff',
  minHeight: '100vh',
  width: '100vw',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

const gridPattern = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage:
    'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  zIndex: 0 as const,
};

const navStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '32px 48px 0 48px',
  position: 'relative' as const,
  zIndex: 2 as const,
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700 as const,
  fontSize: 28 as const,
  letterSpacing: '-1px',
  color: '#222',
};

const menuStyle = {
  display: 'flex',
  gap: 32,
  fontSize: 16 as const,
  color: '#444',
};

const mainStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  zIndex: 2 as const,
  position: 'relative' as const,
};

const headingStyle = {
  fontSize: 72 as const,
  fontWeight: 800 as const,
  textAlign: 'center' as const,
  marginBottom: 16,
  lineHeight: 1.1,
  color: '#111',
};

const gradientText = {
  background: 'linear-gradient(90deg, #3fffa8 20%, #1cc8ee 80%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
};

const descStyle = {
  fontSize: 22 as const,
  color: '#888',
  textAlign: 'center' as const,
  maxWidth: 800 as const,
  margin: '0 auto 40px auto',
  fontWeight: 400 as const,
};

const btnRow = {
  display: 'flex',
  gap: 20,
  justifyContent: 'center',
};

const btnPrimary = {
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600 as const,
  fontSize: 18 as const,
  padding: '14px 36px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'background 0.2s',
};

const btnSecondary = {
  background: '#fff',
  color: '#222',
  fontWeight: 600 as const,
  fontSize: 18 as const,
  padding: '14px 36px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  marginLeft: 8,
  transition: 'background 0.2s',
};

const Home: React.FC = () => {
  return (
    <div style={gridBg}>
      <div style={gridPattern} />
      {/* Navbar */}
      <nav style={navStyle}>
        <div style={logoStyle}>
          <span style={{marginRight: 8}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#222"/><path d="M10 22V10h12v12H10z" fill="#fff"/></svg>
          </span>
          Ecme
        </div>
        <div style={menuStyle}>
          <span>Features</span>
          <span>Demos</span>
          <span>Components</span>
          <span>Documentations</span>
        </div>
        <div style={{fontSize: 20, color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{fontSize: 18, opacity: 0.6}}>☀️</span>
          <span style={{background: '#eee', borderRadius: 16, padding: '4px 14px'}}>Next</span>
        </div>
      </nav>
      {/* Main Content */}
      <main style={mainStyle}>
        <h1 style={headingStyle}>
          Unlock Ultimate Control<br />
          with the <span style={gradientText}>Perfect Template</span>
        </h1>
        <div style={descStyle}>
          Experience a powerful, intuitive, and customizable admin dashboard that adapts to your needs. Built for developers, by developers, to simplify workflow management and enhance user experiences.
        </div>
        <div style={btnRow}>
          <button style={btnPrimary}>Preview</button>
          <button style={btnSecondary}>Get this template</button>
        </div>
      </main>
    </div>
  );
};

export default Home; 