import { message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  wrap: { fontFamily: "'DM Sans', sans-serif" },
  tableWrap: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2DBD0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  thead: { background: '#1C1C1E' },
  th: { padding: '0.85rem 1rem', textAlign: 'left', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F0EBE3', color: '#1C1C1E', verticalAlign: 'middle' },
  trEven: { background: '#FFFCF7' },
  trOdd: { background: '#FBF7F2' },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' },
  badge: (status) => {
    const colors = {
      pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309' },
      confirmed: { bg: 'rgba(21,128,61,0.1)', color: '#15803D' },
      rejected: { bg: 'rgba(185,28,28,0.1)', color: '#B91C1C' },
      completed: { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
    };
    const c = colors[status] || colors.pending;
    return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: c.bg, color: c.color };
  },
  confirmBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(21,128,61,0.1)', color: '#15803D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', marginRight: '0.3rem' },
  rejectBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(185,28,28,0.1)', color: '#B91C1C', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
};

const OwnerAllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");
  const getUser = () => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } };

  const getAllBookings = async () => {
    try {
      const user = getUser();
      if (!user?.email) { navigate("/login"); return; }
      const response = await axios.get(`${API_URL}/api/bookings/owner/${user.email}`);
      if (response.data.success) setAllBookings(response.data.data);
      else { message.error(response.data.message || "Failed to fetch bookings"); }
    } catch (error) {
      if (error.response?.status === 401) { message.error("Session expired"); navigate("/login"); }
      else message.error("Failed to fetch bookings");
    }
  };

  useEffect(() => { getAllBookings(); }, []);

  const handleStatus = async (bookingId, status) => {
    try {
      const token = getToken();
      const res = await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { message.success(`Booking ${status}!`); getAllBookings(); }
      else message.error("Failed to update status");
    } catch (error) { message.error("Failed to update booking status"); }
  };

  return (
    <div style={S.wrap}>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['Booking ID', 'Tenant', 'Phone', 'Start Date', 'End Date', 'Rent', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {allBookings.length > 0 ? allBookings.map((booking, idx) => (
              <tr key={booking._id} style={idx % 2 === 0 ? S.trEven : S.trOdd}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
                <td style={S.td}><span style={S.idText}>{booking._id}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{booking.tenant}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{booking.tenantPhone}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(booking.bookingStartDate).toLocaleDateString()}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(booking.bookingEndDate).toLocaleDateString()}</td>
                <td style={S.td}>₹{booking.rentAmount?.toLocaleString()}</td>
                <td style={S.td}><span style={S.badge(booking.status)}>{booking.status}</span></td>
                <td style={S.td}>
                  {booking.status === "pending" && (
                    <>
                      <button onClick={() => handleStatus(booking._id, "confirmed")} style={S.confirmBtn}
                        onMouseEnter={e => { e.target.style.background = '#15803D'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(21,128,61,0.1)'; e.target.style.color = '#15803D'; }}>
                        Confirm
                      </button>
                      <button onClick={() => handleStatus(booking._id, "rejected")} style={S.rejectBtn}
                        onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(185,28,28,0.1)'; e.target.style.color = '#B91C1C'; }}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} style={S.empty}>No bookings available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerAllBookings;
