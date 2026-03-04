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
  typeBadge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(196,98,45,0.1)', color: '#C4622D' },
  availBadge: (avail) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: avail ? 'rgba(21,128,61,0.1)' : 'rgba(185,28,28,0.1)', color: avail ? '#15803D' : '#B91C1C' }),
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
  idText: { fontSize: '0.75rem', color: '#7A7470', fontFamily: 'monospace', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' },
  editBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: '1.5px solid #C4622D', color: '#C4622D', background: 'transparent', cursor: 'pointer', marginRight: '0.4rem', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  deleteBtn: { padding: '0.3rem 0.7rem', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: '1.5px solid #B91C1C', color: '#B91C1C', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  empty: { textAlign: 'center', padding: '3rem', color: '#7A7470', fontSize: '0.875rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(28,28,30,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.2s ease' },
  modal: { background: '#FFFCF7', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', animation: 'fadeUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7470', marginBottom: '0.35rem' },
  mInput: { width: '100%', padding: '0.65rem 0.85rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', marginBottom: '0.75rem' },
  mTextarea: { width: '100%', padding: '0.65rem 0.85rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', marginBottom: '0.75rem', resize: 'vertical', minHeight: '80px' },
  btnRow: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: { padding: '0.6rem 1.25rem', border: '1.5px solid #E2DBD0', borderRadius: '8px', background: 'transparent', color: '#7A7470', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: 'all 0.2s' },
  saveBtn: { padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', background: '#C4622D', color: 'white', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: 'background 0.2s' },
};

const OwnerAllProperties = () => {
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");
  const getUser = () => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } };

  const handleClose = () => setShow(false);
  const handleShow = (property) => { setEditingPropertyId(property._id); setEditingPropertyData({ ...property }); setShow(true); };

  const getAllProperty = async () => {
    try {
      const user = getUser();
      if (!user?.email) { navigate("/login"); return; }
      const response = await axios.get(`${API_URL}/api/houses/owner/${user.email}`);
      if (response.data.success) setAllProperties(response.data.data);
      else { message.error("Failed to fetch properties"); }
    } catch (error) {
      if (error.response?.status === 401) { message.error("Session expired"); navigate("/login"); }
      else message.error("Failed to fetch properties");
    }
  };

  useEffect(() => { getAllProperty(); }, []);

  const saveChanges = async () => {
    try {
      const token = getToken();
      const payload = {
        address: editingPropertyData.address,
        city: editingPropertyData.city,
        state: editingPropertyData.state,
        pincode: editingPropertyData.pincode,
        rent: Number(editingPropertyData.rent),
        bedrooms: Number(editingPropertyData.bedrooms),
        bathrooms: Number(editingPropertyData.bathrooms),
        ownerPhone: editingPropertyData.ownerPhone,
        description: editingPropertyData.description,
        image: editingPropertyData.image,
      };
      const res = await axios.put(`${API_URL}/api/houses/${editingPropertyId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { message.success("Property updated!"); handleClose(); getAllProperty(); }
      else message.error(res.data.message || "Update failed");
    } catch (error) {
      if (error.response?.status === 401) { message.error("Session expired"); navigate("/login"); }
      else message.error("Failed to save changes");
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = getToken();
        const response = await axios.delete(`${API_URL}/api/houses/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) { message.success("Property deleted!"); getAllProperty(); }
        else message.error(response.data.message || "Delete failed");
      } catch (error) {
        if (error.response?.status === 401) { message.error("Session expired"); navigate("/login"); }
        else message.error("Failed to delete property");
      }
    }
  };

  const f = (e) => e.target.style.borderColor = '#C4622D';
  const b = (e) => e.target.style.borderColor = '#E2DBD0';

  return (
    <div style={S.wrap}>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              {['ID', 'Address', 'City', 'Rent', 'Beds', 'Baths', 'Available', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {allProperties.length > 0 ? allProperties.map((property, index) => (
              <tr key={property._id} style={index % 2 === 0 ? S.trEven : S.trOdd}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,98,45,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#FFFCF7' : '#FBF7F2'}>
                <td style={S.td}><span style={S.idText}>{property._id}</span></td>
                <td style={{ ...S.td, fontWeight: 500 }}>{property.address}</td>
                <td style={{ ...S.td, color: '#7A7470' }}>{property.city}</td>
                <td style={S.td}><span style={S.price}>₹{property.rent?.toLocaleString()}</span></td>
                <td style={S.td}>{property.bedrooms}</td>
                <td style={S.td}>{property.bathrooms}</td>
                <td style={S.td}><span style={S.availBadge(property.isAvailable)}>{property.isAvailable ? 'Available' : 'Occupied'}</span></td>
                <td style={S.td}>
                  <button onClick={() => handleShow(property)} style={S.editBtn}
                    onMouseEnter={e => { e.target.style.background = '#C4622D'; e.target.style.color = 'white'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C4622D'; }}>Edit</button>
                  <button onClick={() => handleDelete(property._id)} style={S.deleteBtn}
                    onMouseEnter={e => { e.target.style.background = '#B91C1C'; e.target.style.color = 'white'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#B91C1C'; }}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={S.empty}>No properties found. Add one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
          <div style={S.modal}>
            <h3 style={S.modalTitle}>Edit Property</h3>
            <form onSubmit={e => { e.preventDefault(); saveChanges(); }}>
              {[
                { name: 'address', label: 'Address', type: 'text' },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'pincode', label: 'Pincode', type: 'text' },
                { name: 'rent', label: 'Rent (₹)', type: 'number' },
                { name: 'bedrooms', label: 'Bedrooms', type: 'number' },
                { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
                { name: 'ownerPhone', label: 'Phone', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label style={S.label}>{field.label}</label>
                  <input type={field.type} name={field.name} value={editingPropertyData[field.name] || ''} onChange={e => setEditingPropertyData(prev => ({ ...prev, [e.target.name]: e.target.value }))} style={S.mInput} onFocus={f} onBlur={b} />
                </div>
              ))}
              <div>
                <label style={S.label}>Description</label>
                <textarea name="description" value={editingPropertyData.description || ''} onChange={e => setEditingPropertyData(prev => ({ ...prev, description: e.target.value }))} style={S.mTextarea} onFocus={f} onBlur={b} />
              </div>
              <div style={S.btnRow}>
                <button type="button" onClick={handleClose} style={S.cancelBtn}>Cancel</button>
                <button type="submit" style={S.saveBtn} onMouseEnter={e => e.target.style.background = '#9E4820'} onMouseLeave={e => e.target.style.background = '#C4622D'}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAllProperties;
