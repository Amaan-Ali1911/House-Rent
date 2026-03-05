import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../../common/Toast";

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
      cancellation_requested: { bg: 'rgba(234,88,12,0.1)', color: '#EA580C' },
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
  cancelBtn: { padding: '0.3rem 0.85rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(234,88,12,0.1)', color: '#EA580C', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  disabledLabel: { fontSize: '0.72rem', color: '#7A7470', fontStyle: 'italic' },
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C1C1E' },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '1rem' },
};

const statusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    completed: 'Completed',
    cancellation_requested: 'Cancel Requested',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

const RenterAllProperty = () => {
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const navigate = useNavigate();

  const showToast = (type, message) => setToast({ show: true, type, message });

  const getBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) { navigate("/login"); return; }
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/bookings/tenant/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setBookings(response.data.data);
      else { showToast("error", response.data.message); navigate("/login"); }
    } catch (error) {
      if (error.response?.status === 401) { showToast("error", "Session expired"); navigate("/login"); }
      else showToast("error", "Failed to fetch bookings");
    }
  };

  const handleCancelRequest = async (bookingId) => {
    if (!window.confirm("Are you sure you want to request cancellation? The property owner will review your request.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/bookings/${bookingId}/status`, { status: "cancellation_requested" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("success", "Cancellation request sent to the property owner!");
      getBookings();
    } catch (error) {
      showToast("error", "Failed to send cancellation request");
    }
  };

  useEffect(() => { getBookings(); }, []);

  return (
    <div style={S.wrap}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
      <h3 style={S.heading}>My Booking History</h3>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['Property', 'Start', 'End', 'Rent/Mo', 'Months', 'Total', 'Payment', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map((b, i) => (
              <tr key={b._id} style={i % 2 === 0 ? S.trEven : S.trOdd}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
                <td style={{ ...S.td, fontWeight: 500 }}>{b.property?.address || 'N/A'}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingStartDate).toLocaleDateString()}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingEndDate).toLocaleDateString()}</td>
                <td style={S.td}><span style={S.price}>₹{b.rentAmount?.toLocaleString()}</span></td>
                <td style={S.td}>{b.numberOfMonths || '—'}</td>
                <td style={S.td}><span style={S.price}>₹{b.totalAmount?.toLocaleString()}</span></td>
                <td style={S.td}><span style={S.payBadge(b.paymentStatus)}>{b.paymentStatus || 'pending'}</span></td>
                <td style={S.td}><span style={S.badge(b.status)}>{statusLabel(b.status)}</span></td>
                <td style={S.td}>
                  {(b.status === "confirmed" || b.status === "pending") && (
                    <button onClick={() => handleCancelRequest(b._id)} style={S.cancelBtn}
                      onMouseEnter={e => { e.target.style.background = '#EA580C'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(234,88,12,0.1)'; e.target.style.color = '#EA580C'; }}>
                      Request Cancel
                    </button>
                  )}
                  {b.status === "cancellation_requested" && (
                    <span style={S.disabledLabel}>⏳ Awaiting owner</span>
                  )}
                  {(b.status === "cancelled" || b.status === "rejected") && (
                    <span style={S.disabledLabel}>—</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" style={S.empty}>No bookings found. Browse properties to make your first booking!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RenterAllProperty;
