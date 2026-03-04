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
  typeBadge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(196,98,45,0.1)', color: '#C4622D' },
  availBadge: (avail) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: avail ? 'rgba(21,128,61,0.1)' : 'rgba(185,28,28,0.1)', color: avail ? '#15803D' : '#B91C1C' }),
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C1C1E' },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' },
  deleteBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: '1.5px solid #B91C1C', color: '#B91C1C', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
};

const AdminAllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const getAllProperty = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/api/admin/properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setAllProperties(response.data.data);
      else { message.error(response.data.message || "Unauthorized access"); navigate("/login"); }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) { message.error("Admin access required"); navigate("/login"); }
      else message.error("Failed to fetch properties");
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/api/admin/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Property deleted!");
      getAllProperty();
    } catch (error) { message.error("Failed to delete"); }
  };

  useEffect(() => { getAllProperty(); }, []);

  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <thead style={S.thead}>
          <tr>
            {['ID', 'Owner', 'Address', 'City', 'Rent', 'Beds', 'Available', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {allProperties.length > 0 ? allProperties.map((property, index) => (
            <tr key={property._id} style={index % 2 === 0 ? S.trEven : S.trOdd}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
              <td style={S.td}><span style={S.idText}>{property._id}</span></td>
              <td style={{ ...S.td, color: '#7A7470' }}>{property.owner}</td>
              <td style={{ ...S.td, fontWeight: 500 }}>{property.address}</td>
              <td style={{ ...S.td, color: '#7A7470' }}>{property.city}</td>
              <td style={S.td}><span style={S.price}>₹{property.rent?.toLocaleString()}</span></td>
              <td style={S.td}>{property.bedrooms}</td>
              <td style={S.td}><span style={S.availBadge(property.isAvailable)}>{property.isAvailable ? 'Yes' : 'No'}</span></td>
              <td style={S.td}>
                <button onClick={() => handleDelete(property._id)} style={S.deleteBtn}
                  onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#B91C1C'; }}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8" style={S.empty}>No properties found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllProperty;
