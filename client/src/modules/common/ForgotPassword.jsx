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
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '68px', padding: '3rem 1.5rem' },
  card: { background: '#FFFCF7', border: '1px solid #E2DBD0', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(28,28,30,0.07)', animation: 'fadeUp 0.5s ease' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(196,98,45,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' },
  eyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.4rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '0.5rem' },
  sub: { fontSize: '0.875rem', color: '#7A7470', marginBottom: '1.75rem', lineHeight: 1.5 },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7470', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.72rem 1rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', transition: 'border-color 0.2s' },
  submit: { width: '100%', background: '#C4622D', color: 'white', padding: '0.85rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '0.5rem', transition: 'background 0.2s' },
  footer: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#7A7470' },
  link: { color: '#C4622D', textDecoration: 'none', fontWeight: 500 },
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [data, setData] = useState({ email: "", password: "", confirmPassword: "" });

  const showToast = (type, message) => setToast({ show: true, type, message });
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password || !data.confirmPassword) return showToast("error", "Please fill all fields");
    if (data.password !== data.confirmPassword) return showToast("error", "Passwords do not match");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(`${API_URL}/api/users/register`, { ...data, type: "reset" });
      if (res.data.success) { showToast("success", "Your password has been changed!"); navigate("/login"); }
      else showToast("error", res.data.message);
    } catch (err) {
      if (err.response?.status === 401) showToast("error", "User doesn't exist");
      else showToast("error", "Something went wrong. Please try again.");
      navigate("/register");
    }
  };

  const f = (e) => e.target.style.borderColor = '#C4622D';
  const b = (e) => e.target.style.borderColor = '#E2DBD0';

  return (
    <div style={S.page}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
      <nav style={S.nav}>
        <Link to="/" style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></Link>
        <div style={S.navLinks}>
          <Link to="/" style={S.navLink}>Home</Link>
          <Link to="/login" style={S.navLink}>Login</Link>
          <Link to="/register" style={S.btnNav}>Register</Link>
        </div>
      </nav>

      <div style={S.main}>
        <div style={S.card}>
          <div style={S.iconWrap}>🔑</div>
          <div style={S.eyebrow}>Account Recovery</div>
          <h1 style={S.title}>Reset Password</h1>
          <p style={S.sub}>Enter your email and choose a new password to regain access to your account.</p>

          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Email Address</label>
              <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="you@example.com" style={S.input} onFocus={f} onBlur={b} />
            </div>
            <div style={S.field}>
              <label style={S.label}>New Password</label>
              <input type="password" name="password" value={data.password} onChange={handleChange} placeholder="••••••••" style={S.input} onFocus={f} onBlur={b} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={data.confirmPassword} onChange={handleChange} placeholder="••••••••" style={S.input} onFocus={f} onBlur={b} />
            </div>
            <button type="submit" style={S.submit} onMouseEnter={e => e.target.style.background = '#9E4820'} onMouseLeave={e => e.target.style.background = '#C4622D'}>
              Change Password →
            </button>
          </form>

          <p style={S.footer}>Remember your password? <Link to="/login" style={S.link}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
