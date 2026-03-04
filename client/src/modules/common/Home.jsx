import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import p1 from "../../images/p1.jpg";
import p2 from "../../images/p2.jpg";
import p3 from "../../images/p3.jpg";
import p4 from "../../images/p4.jpg";
import AllPropertiesCards from "../user/AllPropertiesCards";

const images = [p1, p2, p3, p4];

const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" },
  nav: {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    background: 'rgba(255,252,247,0.92)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #E2DBD0', height: '68px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem'
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1C1C1E', letterSpacing: '-0.02em', textDecoration: 'none' },
  logoSpan: { color: '#C4622D' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { fontSize: '0.875rem', fontWeight: 500, color: '#7A7470', textDecoration: 'none', transition: 'color 0.2s' },
  btnPrimary: {
    background: '#C4622D', color: 'white', padding: '0.5rem 1.25rem',
    borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500,
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif"
  },
  hero: { position: 'relative', width: '100%', height: '85vh', marginTop: '68px', overflow: 'hidden' },
  heroImg: { position: 'absolute', width: '100%', height: '100%', transition: 'opacity 1s ease' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,28,30,0.75) 0%, rgba(28,28,30,0.2) 60%, transparent 100%)' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 3rem' },
  heroEyebrow: { display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '1rem' },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '1rem', maxWidth: '700px' },
  heroSub: { fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', fontWeight: 300, maxWidth: '480px', marginBottom: '2rem' },
  heroCta: {
    background: '#C4622D', color: 'white', padding: '0.85rem 2rem',
    borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500,
    textDecoration: 'none', display: 'inline-block',
    transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif"
  },
  dots: { position: 'absolute', bottom: '1.5rem', right: '3rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
  section: { padding: '5rem 2.5rem' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2 },
  sectionSub: { fontSize: '0.9rem', color: '#7A7470', maxWidth: '320px', textAlign: 'right' },
  divider: { width: '60px', height: '3px', background: '#C4622D', margin: '0.75rem 0 1.5rem', borderRadius: '2px' },
  ownerLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.875rem', fontWeight: 500, color: '#C4622D',
    textDecoration: 'none', border: '1.5px solid #C4622D',
    padding: '0.5rem 1rem', borderRadius: '6px', transition: 'all 0.2s'
  },
};

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverNav, setHoverNav] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={S.page}>
      {/* Navbar */}
      <nav style={S.nav}>
        <Link to="/" style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></Link>
        <div style={S.navLinks}>
          <Link to="/" style={{ ...S.navLink, color: '#1C1C1E' }}>Home</Link>
          <Link to="/login" style={S.navLink}>Login</Link>
          <Link to="/register" style={S.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Slideshow */}
      <div style={S.hero}>
        {images.map((img, idx) => (
          <div key={idx} style={{ ...S.heroImg, opacity: currentIndex === idx ? 1 : 0 }}>
            <img src={img} alt={`Slide ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div style={S.heroOverlay}></div>

        <div style={S.heroContent} className="animate-fadeUp">
          <div style={S.heroEyebrow}>Premium Real Estate</div>
          <h1 style={S.heroTitle}>Find Your Perfect<br /><em>Rental Property</em></h1>
          <p style={S.heroSub}>Comfort, convenience & class — curated properties across prime locations.</p>
          <Link to="/register" style={S.heroCta}>Explore Properties →</Link>
        </div>

        <div style={S.dots}>
          {images.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)} style={{
              ...S.dot,
              background: currentIndex === idx ? '#D4A853' : 'rgba(255,255,255,0.5)',
              width: currentIndex === idx ? '24px' : '8px',
              borderRadius: currentIndex === idx ? '4px' : '50%'
            }} />
          ))}
        </div>
      </div>

      {/* Properties Section */}
      <section style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionHeader}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.5rem' }}>Listed Properties</div>
              <h2 style={S.sectionTitle}>Explore Premium<br />Listings</h2>
              <div style={S.divider}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#7A7470' }}>Looking to list your property?</p>
              <Link to="/register" style={S.ownerLink}>Register as Owner →</Link>
            </div>
          </div>
          <AllPropertiesCards />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1C1C1E', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem', fontSize: '0.8rem' }}>
        © 2025 RentEase · Premium Property Rentals
      </footer>
    </div>
  );
};

export default Home;
