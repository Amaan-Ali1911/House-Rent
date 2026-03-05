import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  tableWrap: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2DBD0', fontFamily: "'DM Sans', sans-serif" },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' },
  thead: { background: '#1C1C1E' },
  th: { padding: '0.85rem 1rem', textAlign: 'left', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F0EBE3', color: '#1C1C1E', verticalAlign: 'middle' },
  trEven: { background: '#FFFCF7' },
  trOdd: { background: '#FBF7F2' },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' },
  badge: (status) => {
    const colors = {
      confirmed: { bg: 'rgba(21,128,61,0.1)', color: '#15803D' },
      pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309' },
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
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C1C1E' },
  approveBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(21,128,61,0.1)', color: '#15803D', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", marginRight: '0.3rem' },
  rejectBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(185,28,28,0.1)', color: '#B91C1C', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", marginRight: '0.3rem' },
  payBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: 'none', background: 'rgba(59,130,246,0.1)', color: '#2563EB', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
  summary: { display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  summaryCard: (color) => ({ padding: '0.6rem 1rem', background: '#FFFCF7', border: `1.5px solid ${color}20`, borderLeft: `3px solid ${color}`, borderRadius: '6px', fontSize: '0.82rem' }),
};

const statusLabel = (status) => {
  const labels = {
    pending: 'Pending', confirmed: 'Confirmed', rejected: 'Rejected',
    completed: 'Completed', cancellation_requested: 'Cancel Req.', cancelled: 'Cancelled',
  };
  return labels[status] || status;
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

  const handlePayment = async (bookingId, paymentStatus) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/api/bookings/${bookingId}/payment`, { paymentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success(`Payment marked as ${paymentStatus}!`);
      getAllBooking();
    } catch (error) { message.error("Failed to update payment"); }
  };

  useEffect(() => { getAllBooking(); }, []);

  // Summary calculations
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;
  const confirmedCount = allBookings.filter(b => b.status === 'confirmed').length;
  const cancelReqCount = allBookings.filter(b => b.status === 'cancellation_requested').length;

  return (
    <div>
      {/* Revenue Summary */}
      <div style={S.summary}>
        <div style={S.summaryCard('#C4622D')}>
          <div style={{ fontSize: '0.7rem', color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Total Revenue</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', color: '#1C1C1E' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={S.summaryCard('#B45309')}>
          <div style={{ fontSize: '0.7rem', color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Pending</div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#B45309' }}>{pendingCount}</div>
        </div>
        <div style={S.summaryCard('#15803D')}>
          <div style={{ fontSize: '0.7rem', color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Confirmed</div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#15803D' }}>{confirmedCount}</div>
        </div>
        {cancelReqCount > 0 && (
          <div style={S.summaryCard('#EA580C')}>
            <div style={{ fontSize: '0.7rem', color: '#7A7470', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Cancel Requests</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#EA580C' }}>{cancelReqCount}</div>
          </div>
        )}
      </div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['Tenant', 'Property', 'Start', 'End', 'Rent/Mo', 'Total', 'Payment', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {allBookings.length > 0 ? allBookings.map((b, idx) => (
              <tr key={b._id} style={{
                ...(idx % 2 === 0 ? S.trEven : S.trOdd),
                ...(b.status === 'cancellation_requested' ? { background: 'rgba(234,88,12,0.04)' } : {})
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = b.status === 'cancellation_requested' ? 'rgba(234,88,12,0.04)' : (idx % 2 === 0 ? '#FFFCF7' : '#FBF7F2')}>
                <td style={{ ...S.td, fontWeight: 500 }}>{b.tenant}</td>
                <td style={S.td}>{b.property?.address || 'N/A'}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingStartDate).toLocaleDateString()}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{new Date(b.bookingEndDate).toLocaleDateString()}</td>
                <td style={S.td}><span style={S.price}>₹{b.rentAmount?.toLocaleString()}</span></td>
                <td style={S.td}><span style={S.price}>₹{b.totalAmount?.toLocaleString()}</span></td>
                <td style={S.td}>
                  <span style={S.payBadge(b.paymentStatus)}>{b.paymentStatus || 'pending'}</span>
                  {b.status === 'confirmed' && b.paymentStatus !== 'paid' && (
                    <button onClick={() => handlePayment(b._id, 'paid')} style={{ ...S.payBtn, marginLeft: '0.3rem', padding: '0.15rem 0.4rem', fontSize: '0.68rem' }}
                      onMouseEnter={e => { e.target.style.background = '#2563EB'; e.target.style.color = 'white'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(59,130,246,0.1)'; e.target.style.color = '#2563EB'; }}>
                      ✓ Paid
                    </button>
                  )}
                </td>
                <td style={S.td}><span style={S.badge(b.status)}>{statusLabel(b.status)}</span></td>
                <td style={S.td}>
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(b._id)} style={S.approveBtn}
                        onMouseEnter={e => { e.target.style.background = '#15803D'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(21,128,61,0.1)'; e.target.style.color = '#15803D'; }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(b._id)} style={S.rejectBtn}
                        onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(185,28,28,0.1)'; e.target.style.color = '#B91C1C'; }}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" style={S.empty}>No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllBookings;
