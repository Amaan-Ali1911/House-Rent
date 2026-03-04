import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "../common/Toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  wrap: { fontFamily: "'DM Sans', sans-serif" },
  tableWrap: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2DBD0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  thead: { background: '#1C1C1E' },
  th: { padding: '0.85rem 1rem', textAlign: 'left', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F0EBE3', color: '#1C1C1E', verticalAlign: 'middle' },
  trEven: { background: '#FFFCF7' },
  trOdd: { background: '#FBF7F2' },
  badge: (verified) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: verified ? 'rgba(21,128,61,0.1)' : 'rgba(185,28,28,0.1)', color: verified ? '#15803D' : '#B91C1C' }),
  typeBadge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(196,98,45,0.1)', color: '#C4622D' },
  verifyBtn: { padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: 'rgba(21,128,61,0.1)', color: '#15803D', transition: 'all 0.2s' },
  deleteBtn: { padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: 'rgba(185,28,28,0.1)', color: '#B91C1C', transition: 'all 0.2s', marginLeft: '0.3rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' },
};

const AllUsers = () => {
  const [allUser, setAllUser] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const navigate = useNavigate();

  const showToast = (type, message) => setToast({ show: true, type, message });
  const getToken = () => localStorage.getItem("token");

  useEffect(() => { getAllUser(); }, []);

  const getAllUser = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setAllUser(response.data.data);
      else { showToast("error", response.data.message || "Unauthorized access"); navigate("/login"); }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) { showToast("error", "Unauthorized. Admin access required."); navigate("/login"); }
      else showToast("error", "Failed to fetch users");
    }
  };

  const handleVerify = async (userId) => {
    try {
      const token = getToken();
      const res = await axios.put(`${API_URL}/api/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { showToast("success", "User verified!"); getAllUser(); }
      else showToast("error", res.data.message);
    } catch (error) { console.error(error); showToast("error", "Failed to verify user"); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = getToken();
      const res = await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { showToast("success", "User deleted!"); getAllUser(); }
      else showToast("error", res.data.message);
    } catch (error) { console.error(error); showToast("error", "Failed to delete user"); }
  };

  return (
    <div style={S.wrap}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['User ID', 'Name', 'Email', 'Phone', 'Role', 'Verified', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {allUser.length > 0 ? allUser.map((user, index) => (
              <tr key={user._id} style={index % 2 === 0 ? S.trEven : S.trOdd}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
                <td style={S.td}><span style={S.idText}>{user._id}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{user.name}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{user.email}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{user.phone || '—'}</td>
                <td style={S.td}><span style={S.typeBadge}>{user.role}</span></td>
                <td style={S.td}><span style={S.badge(user.isVerified)}>{user.isVerified ? 'Verified' : 'Unverified'}</span></td>
                <td style={S.td}>
                  {!user.isVerified && (
                    <button onClick={() => handleVerify(user._id)} style={S.verifyBtn}
                      onMouseEnter={e => { e.target.style.background = '#15803D'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(21,128,61,0.1)'; e.target.style.color = '#15803D'; }}>
                      Verify
                    </button>
                  )}
                  <button onClick={() => handleDelete(user._id)} style={S.deleteBtn}
                    onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(185,28,28,0.1)'; e.target.style.color = '#B91C1C'; }}>
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={S.empty}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
