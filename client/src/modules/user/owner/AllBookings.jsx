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
      cancellation_requested: { bg: 'rgba(234,88,12,0.15)', color: '#EA580C' },
      cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
    };
    const c = colors[status] || colors.pending;
    return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: c.bg, color: c.color };
  },
  payBadge: (status) => {
    const colors = {
      pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309' },
      paid: { bg: 'rgba(21,128,61,0.1)', color: '#15803D' },
      failed: { bg: 'rgba(185,28,28,0.1)', color: '#B91C1C' },
    };
    const c = colors[status] || colors.pending;
    return { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: c.bg, color: c.color };
  },
  confirmBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(21,128,61,0.1)', color: '#15803D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', marginRight: '0.3rem' },
  rejectBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(185,28,28,0.1)', color: '#B91C1C', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  cancelApproveBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(234,88,12,0.1)', color: '#EA580C', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', marginRight: '0.3rem' },
  cancelDenyBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(59,130,246,0.1)', color: '#2563EB', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C1C1E' },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
  cancelAlert: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.2)', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.75rem', color: '#EA580C', fontWeight: 500 },
};

const statusLabel = (status) => {
  const labels = {
    pending: 'Pending', confirmed: 'Confirmed', rejected: 'Rejected',
    completed: 'Completed', cancellation_requested: '⚠️ Cancel Requested', cancelled: 'Cancelled',
  };
  return labels[status] || status;
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

  const handleCancelApprove = async (bookingId) => {
    if (!window.confirm("Approve cancellation? This will cancel the booking and free the property.")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Cancellation approved! Property is now available.");
      getAllBookings();
    } catch (error) { message.error("Failed to cancel booking"); }
  };

  const handleCancelDeny = async (bookingId) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, { status: "confirmed" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Cancellation denied. Booking remains confirmed.");
      getAllBookings();
    } catch (error) { message.error("Failed to update status"); }
  };

  const cancelRequests = allBookings.filter(b => b.status === 'cancellation_requested');

  return (
    <div style={S.wrap}>
      {/* Cancellation Alerts */}
      {cancelRequests.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {cancelRequests.map(b => (
            <div key={b._id} style={S.cancelAlert}>
              ⚠️ <strong>{b.tenant}</strong> has requested cancellation for their booking (₹{b.totalAmount?.toLocaleString()}) — scroll down to take action.
            </div>
          ))}
        </div>
      )}

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['Tenant', 'Phone', 'Start', 'End', 'Rent/Mo', 'Total', 'Payment', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {allBookings.length > 0 ? allBookings.map((b, idx) => (
              <tr key={b._id} style={{
                ...(idx % 2 === 0 ? S.trEven : S.trOdd),
                ...(b.status === 'cancellation_requested' ? { background: 'rgba(234,88,12,0.04)' } : {})
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = b.status === 'cancellation_requested' ? 'rgba(234,88,12,0.04)' : (idx % 2 === 0 ? '#FFFCF7' : '#FBF7F2')}>
                <td style={{ ...S.td, fontWeight: 500 }}>{b.tenant}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{b.tenantPhone}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingStartDate).toLocaleDateString()}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingEndDate).toLocaleDateString()}</td>
                <td style={S.td}><span style={S.price}>₹{b.rentAmount?.toLocaleString()}</span></td>
                <td style={S.td}><span style={S.price}>₹{b.totalAmount?.toLocaleString()}</span></td>
                <td style={S.td}><span style={S.payBadge(b.paymentStatus)}>{b.paymentStatus || 'pending'}</span></td>
                <td style={S.td}><span style={S.badge(b.status)}>{statusLabel(b.status)}</span></td>
                <td style={S.td}>
                  {/* Pending booking: Confirm or Reject */}
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => handleStatus(b._id, "confirmed")} style={S.confirmBtn}
                        onMouseEnter={e => { e.target.style.background = '#15803D'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(21,128,61,0.1)'; e.target.style.color = '#15803D'; }}>
                        Confirm
                      </button>
                      <button onClick={() => handleStatus(b._id, "rejected")} style={S.rejectBtn}
                        onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(185,28,28,0.1)'; e.target.style.color = '#B91C1C'; }}>
                        Reject
                      </button>
                    </>
                  )}
                  {/* Cancellation requested: Approve or Deny */}
                  {b.status === "cancellation_requested" && (
                    <>
                      <button onClick={() => handleCancelApprove(b._id)} style={S.cancelApproveBtn}
                        onMouseEnter={e => { e.target.style.background = '#EA580C'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(234,88,12,0.1)'; e.target.style.color = '#EA580C'; }}>
                        ✓ Approve Cancel
                      </button>
                      <button onClick={() => handleCancelDeny(b._id)} style={S.cancelDenyBtn}
                        onMouseEnter={e => { e.target.style.background = '#2563EB'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(59,130,246,0.1)'; e.target.style.color = '#2563EB'; }}>
                        ✗ Deny
                      </button>
                    </>
                  )}
                  {/* Confirmed: owner can mark completed */}
                  {b.status === "confirmed" && (
                    <button onClick={() => handleStatus(b._id, "completed")} style={{ ...S.confirmBtn, background: 'rgba(59,130,246,0.1)', color: '#2563EB' }}
                      onMouseEnter={e => { e.target.style.background = '#2563EB'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(59,130,246,0.1)'; e.target.style.color = '#2563EB'; }}>
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={9} style={S.empty}>No bookings available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerAllBookings;
