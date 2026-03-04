import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";
import { UserContext } from "../../App";



const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' },
  nav: {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    background: 'rgba(255,252,247,0.92)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #E2DBD0', height: '68px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem'
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1C1C1E', textDecoration: 'none' },
  logoSpan: { color: '#C4622D' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { fontSize: '0.875rem', fontWeight: 500, color: '#7A7470', textDecoration: 'none' },
  btnNav: { background: '#C4622D', color: 'white', padding: '0.45rem 1.1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' },
  body: { flex: 1, display: 'flex', marginTop: '68px' },
  visual: {
    flex: 1, background: '#1C1C1E', position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem',
    minHeight: '400px'
  },
  visualBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1C1C1E 0%, #2D1F17 50%, #3D2010 100%)' },
  visualPattern: { position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg, #C4622D 0, #C4622D 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' },
  visualContent: { position: 'relative', zIndex: 1 },
  visualQuote: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'white', lineHeight: 1.3, marginBottom: '1.5rem' },
  visualSub: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' },
  accent: { display: 'inline-block', width: '40px', height: '3px', background: '#C4622D', borderRadius: '2px', marginBottom: '1rem' },
  formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', maxWidth: '560px', margin: '0 auto' },
  formBox: { width: '100%', maxWidth: '380px', animation: 'fadeUp 0.5s ease' },
  eyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.6rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '0.5rem' },
  sub: { fontSize: '0.875rem', color: '#7A7470', marginBottom: '2rem' },
  field: { marginBottom: '1.1rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7470', marginBottom: '0.4rem' },
  input: {
    width: '100%', padding: '0.72rem 1rem',
    background: '#FFFCF7', border: '1.5px solid #E2DBD0',
    borderRadius: '8px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
    color: '#1C1C1E', outline: 'none', transition: 'border-color 0.2s'
  },
  submit: {
    width: '100%', background: '#C4622D', color: 'white',
    padding: '0.85rem', borderRadius: '8px', fontSize: '0.95rem',
    fontWeight: 600, border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", marginTop: '0.5rem',
    transition: 'background 0.2s', letterSpacing: '0.01em'
  },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '0.85rem' },
  link: { color: '#C4622D', textDecoration: 'none', fontWeight: 500 },
  muted: { color: '#7A7470' },
};

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setUserLoggedIn } = useContext(UserContext);
  const [data, setData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => setToast({ show: true, type, message });
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) return showToast("error", "Please fill all fields");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(`${API_URL}/api/users/login`, data);
      if (res.data.success) {
        showToast("success", "Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        setUserData(res.data.data);
        setUserLoggedIn(true);
        const user = res.data.data;
        setTimeout(() => {
          switch (user.role) {
            case "admin": navigate("/adminhome"); break;
            case "user": navigate("/renterhome"); break;
            case "owner": navigate("/ownerhome"); break;
            default: navigate("/login"); break;
          }
        }, 1000);
      } else showToast("error", res.data.message);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Login failed");
      navigate("/login");
    }
  };

  return (
    <div style={S.page}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      <nav style={S.nav}>
        <Link to="/" style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></Link>
        <div style={S.navLinks}>
          <Link to="/" style={S.navLink}>Home</Link>
          <Link to="/login" style={{ ...S.navLink, color: '#1C1C1E', fontWeight: 600 }}>Login</Link>
          <Link to="/register" style={S.btnNav}>Register</Link>
        </div>
      </nav>

      <div style={S.body}>
        {/* Visual Side */}
        <div style={S.visual}>
          <div style={S.visualBg}></div>
          <div style={S.visualPattern}></div>
          <div style={S.visualContent}>
            <div style={S.accent}></div>
            <div style={S.visualQuote}>"Your next home<br />is waiting for you."</div>
            <p style={S.visualSub}>RENTEASE · PREMIUM PROPERTIES</p>
          </div>
        </div>

        {/* Form Side */}
        <div style={S.formSide}>
          <div style={S.formBox}>
            <div style={S.eyebrow}>Welcome back</div>
            <h1 style={S.title}>Sign In</h1>
            <p style={S.sub}>Access your RentEase account</p>

            <form onSubmit={handleSubmit}>
              <div style={S.field}>
                <label style={S.label}>Email Address</label>
                <input type="email" name="email" value={data.email} onChange={handleChange}
                  placeholder="you@example.com" style={S.input}
                  onFocus={e => e.target.style.borderColor = '#C4622D'}
                  onBlur={e => e.target.style.borderColor = '#E2DBD0'} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Password</label>
                <input type="password" name="password" value={data.password} onChange={handleChange}
                  placeholder="••••••••" style={S.input}
                  onFocus={e => e.target.style.borderColor = '#C4622D'}
                  onBlur={e => e.target.style.borderColor = '#E2DBD0'} />
              </div>
              <button type="submit" style={S.submit}
                onMouseEnter={e => e.target.style.background = '#9E4820'}
                onMouseLeave={e => e.target.style.background = '#C4622D'}>
                Sign In →
              </button>
            </form>

            <div style={S.footer}>
              <Link to="/forgotpassword" style={{ ...S.link, color: '#7A7470' }}>Forgot Password?</Link>
              <span style={S.muted}>No account? <Link to="/register" style={S.link}>Sign Up</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
