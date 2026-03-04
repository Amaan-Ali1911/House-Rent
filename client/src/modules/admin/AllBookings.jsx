import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const statusStyle = (status) => {
  const m = {
    confirmed: { bg: 'rgba(21,128,61,0.1)', color: '#15803D' },
    pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309' },
    rejected: { bg: 'rgba(185,28,28,0.1)', color: '#B91C1C' },
    completed: { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  };
  return m[status] || { bg: 'rgba(185,28,28,0.1)', color: '#B91C1C' };
};

const S = {
  tableWrap: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2DBD0', fontFamily: "'DM Sans', sans-serif" },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  thead: { background: '#1C1C1E' },
  th: { padding: '0.85rem 1rem', textAlign: 'left', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F0EBE3', color: '#1C1C1E', verticalAlign: 'middle' },
  trEven: { background: '#FFFCF7' },
  trOdd: { background: '#FBF7F2' },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' },
  approveBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(21,128,61,0.1)', color: '#15803D', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", marginRight: '0.3rem' },
  rejectBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(185,28,28,0.1)', color: '#B91C1C', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
};

const AdminAllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const getAllBooking = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setAllBookings(response.data.data);
      else { message.error(response.data.message || "Unauthorized access"); navigate("/login"); }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) { message.error("Admin access required"); navigate("/login"); }
      else message.error("Failed to fetch bookings");
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/api/admin/bookings/${bookingId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Booking approved!");
      getAllBooking();
    } catch (error) { message.error("Failed to approve"); }
  };

  const handleReject = async (bookingId) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/api/admin/bookings/${bookingId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Booking rejected!");
      getAllBooking();
    } catch (error) { message.error("Failed to reject"); }
  };

  useEffect(() => { getAllBooking(); }, []);

  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <thead style={S.thead}>
          <tr>
            {['Booking ID', 'Tenant', 'Property', 'Start', 'End', 'Amount', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {allBookings.length > 0 ? allBookings.map((booking, index) => {
            const st = statusStyle(booking.status);
            return (
              <tr key={booking._id} style={index % 2 === 0 ? S.trEven : S.trOdd}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
                <td style={S.td}><span style={S.idText}>{booking._id}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{booking.tenant}</td>
                <td style={S.td}><span style={S.idText}>{booking.property?.address || booking.property?._id || 'N/A'}</span></td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(booking.bookingStartDate).toLocaleDateString()}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(booking.bookingEndDate).toLocaleDateString()}</td>
                <td style={S.td}>₹{booking.totalAmount?.toLocaleString()}</td>
                <td style={S.td}>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: st.bg, color: st.color }}>
                    {booking.status}
                  </span>
                </td>
                <td style={S.td}>
                  {booking.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(booking._id)} style={S.approveBtn}
                        onMouseEnter={e => { e.target.style.background = '#15803D'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(21,128,61,0.1)'; e.target.style.color = '#15803D'; }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(booking._id)} style={S.rejectBtn}
                        onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(185,28,28,0.1)'; e.target.style.color = '#B91C1C'; }}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          }) : (
            <tr><td colSpan="8" style={S.empty}>No bookings found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllBookings;
