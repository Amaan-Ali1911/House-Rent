import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";

const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" },
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,252,247,0.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2DBD0', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1C1C1E' },
  logoSpan: { color: '#C4622D' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  greeting: { fontSize: '0.875rem', color: '#7A7470' },
  adminBadge: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(196,98,45,0.1)', color: '#C4622D', padding: '0.2rem 0.6rem', borderRadius: '4px' },
  logoutBtn: { background: '#1C1C1E', color: 'white', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' },
  content: { maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 2rem' },
  header: { marginBottom: '2rem' },
  eyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.4rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C1C1E' },
  tabs: { display: 'flex', gap: 0, borderBottom: '2px solid #E2DBD0', marginBottom: '1.5rem' },
  tab: (active) => ({ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: active ? '#C4622D' : '#7A7470', background: 'none', border: 'none', cursor: 'pointer', borderBottom: active ? '2px solid #C4622D' : '2px solid transparent', marginBottom: '-2px', transition: 'color 0.2s', fontFamily: "'DM Sans', sans-serif" }),
  panel: { background: '#FFFCF7', border: '1px solid #E2DBD0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(28,28,30,0.04)' },
};

const AdminHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogOut = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

  if (!user || !user.userData) return null;

  const tabs = [
    { key: "users", label: "All Users" },
    { key: "properties", label: "All Properties" },
    { key: "bookings", label: "All Bookings" },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></div>
        <div style={S.navRight}>
          <span style={S.adminBadge}>Admin</span>
          <span style={S.greeting}>Hi, {user.userData.name}</span>
          <button onClick={handleLogOut} style={S.logoutBtn}
            onMouseEnter={e => e.target.style.background = '#C4622D'}
            onMouseLeave={e => e.target.style.background = '#1C1C1E'}>
            Log Out
          </button>
        </div>
      </nav>

      <div style={S.content}>
        <div style={S.header}>
          <div style={S.eyebrow}>Control Panel</div>
          <h1 style={S.title}>Admin Dashboard</h1>
        </div>

        <div style={S.tabs}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={S.tab(activeTab === t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={S.panel}>
          {activeTab === "users" && <AllUsers />}
          {activeTab === "properties" && <AllProperty />}
          {activeTab === "bookings" && <AllBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
