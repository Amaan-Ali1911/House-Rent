import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";



const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' },
  nav: { position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, background: 'rgba(255,252,247,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2DBD0', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1C1C1E', textDecoration: 'none' },
  logoSpan: { color: '#C4622D' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { fontSize: '0.875rem', fontWeight: 500, color: '#7A7470', textDecoration: 'none' },
  btnNav: { background: '#C4622D', color: 'white', padding: '0.45rem 1.1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' },
  body: { flex: 1, display: 'flex', marginTop: '68px' },
  visual: { flex: 1, background: '#1C1C1E', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem', minHeight: '400px' },
  visualBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2D1F17 0%, #1C1C1E 60%, #0D0D0F 100%)' },
  visualPattern: { position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #C4622D 1px, transparent 1px)', backgroundSize: '24px 24px' },
  visualContent: { position: 'relative', zIndex: 1 },
  accent: { display: 'inline-block', width: '40px', height: '3px', background: '#D4A853', borderRadius: '2px', marginBottom: '1rem' },
  visualQuote: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'white', lineHeight: 1.3, marginBottom: '1.5rem' },
  visualSub: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' },
  formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' },
  formBox: { width: '100%', maxWidth: '400px', animation: 'fadeUp 0.5s ease' },
  eyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.6rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '0.5rem' },
  sub: { fontSize: '0.875rem', color: '#7A7470', marginBottom: '2rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7470', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.72rem 1rem', background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', transition: 'border-color 0.2s' },
  select: { width: '100%', padding: '0.72rem 1rem', background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7470' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center' },
  submit: { width: '100%', background: '#C4622D', color: 'white', padding: '0.85rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '0.5rem', transition: 'background 0.2s', letterSpacing: '0.01em' },
  footer: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#7A7470' },
  link: { color: '#C4622D', textDecoration: 'none', fontWeight: 500 },
};

const Register = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [data, setData] = useState({ name: "", email: "", password: "", phone: "", role: "" });

  const showToast = (type, message) => setToast({ show: true, type, message });
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password || !data.phone || !data.role) return showToast("error", "Please fill all fields");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await axios.post(`${API_URL}/api/users/register`, data);
      if (response.data.success) {
        showToast("success", response.data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const focusStyle = (e) => e.target.style.borderColor = '#C4622D';
  const blurStyle = (e) => e.target.style.borderColor = '#E2DBD0';

  return (
    <div style={S.page}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      <nav style={S.nav}>
        <Link to="/" style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></Link>
        <div style={S.navLinks}>
          <Link to="/" style={S.navLink}>Home</Link>
          <Link to="/login" style={S.navLink}>Login</Link>
          <Link to="/register" style={{ ...S.btnNav, background: '#1C1C1E' }}>Register</Link>
        </div>
      </nav>

      <div style={S.body}>
        <div style={S.visual}>
          <div style={S.visualBg}></div>
          <div style={S.visualPattern}></div>
          <div style={S.visualContent}>
            <div style={S.accent}></div>
            <div style={S.visualQuote}>"Own it. List it.<br />Earn from it."</div>
            <p style={S.visualSub}>RENTEASE · JOIN 10,000+ USERS</p>
          </div>
        </div>

        <div style={S.formSide}>
          <div style={S.formBox}>
            <div style={S.eyebrow}>Create Account</div>
            <h1 style={S.title}>Sign Up</h1>
            <p style={S.sub}>Join RentEase as an owner or renter</p>

            <form onSubmit={handleSubmit}>
              <div style={S.field}>
                <label style={S.label}>Full Name</label>
                <input type="text" name="name" value={data.name} onChange={handleChange}
                  placeholder="John Doe" style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Email Address</label>
                <input type="email" name="email" value={data.email} onChange={handleChange}
                  placeholder="you@example.com" style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Password</label>
                <input type="password" name="password" value={data.password} onChange={handleChange}
                  placeholder="••••••••" style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Phone Number</label>
                <input type="tel" name="phone" value={data.phone} onChange={handleChange}
                  placeholder="9876543210" style={S.input} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={S.field}>
                <label style={S.label}>I am a</label>
                <select name="role" value={data.role} onChange={handleChange} style={S.select}>
                  <option value="">Select role...</option>
                  <option value="user">Renter</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" style={S.submit}
                onMouseEnter={e => e.target.style.background = '#9E4820'}
                onMouseLeave={e => e.target.style.background = '#C4622D'}>
                Create Account →
              </button>
            </form>

            <p style={S.footer}>Already have an account? <Link to="/login" style={S.link}>Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
