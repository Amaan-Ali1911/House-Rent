import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  wrap: { fontFamily: "'DM Sans', sans-serif" },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '1.75rem' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7A7470' },
  input: { padding: '0.7rem 0.9rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', transition: 'border-color 0.2s' },
  textarea: { padding: '0.7rem 0.9rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', resize: 'vertical', minHeight: '100px', transition: 'border-color 0.2s' },
  footer: { display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' },
  submit: { background: '#C4622D', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s', letterSpacing: '0.01em' },
};

function AddProperty() {
  const [propertyDetails, setPropertyDetails] = useState({
    address: "", city: "", state: "", pincode: "",
    rent: "", bedrooms: "", bathrooms: "", squareFeet: "",
    ownerPhone: "", description: "", image: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setPropertyDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!user || !token) { message.error("Please login first"); navigate("/login"); return; }

      const payload = {
        ...propertyDetails,
        rent: Number(propertyDetails.rent),
        bedrooms: Number(propertyDetails.bedrooms),
        bathrooms: Number(propertyDetails.bathrooms),
        squareFeet: propertyDetails.squareFeet ? Number(propertyDetails.squareFeet) : undefined,
        owner: user.name,
        ownerEmail: user.email,
        ownerPhone: propertyDetails.ownerPhone || user.phone,
      };

      const res = await axios.post(`${API_URL}/api/houses`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        message.success("Property added successfully!");
        setPropertyDetails({ address: "", city: "", state: "", pincode: "", rent: "", bedrooms: "", bathrooms: "", squareFeet: "", ownerPhone: "", description: "", image: "" });
      } else { message.error(res.data.message || "Failed to add property"); }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) { message.error("Session expired"); navigate("/login"); }
      else message.error(error.response?.data?.message || "Failed to add property");
    }
  };

  const f = (e) => e.target.style.borderColor = '#C4622D';
  const b = (e) => e.target.style.borderColor = '#E2DBD0';

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>Add New Property</h2>
      <form onSubmit={handleSubmit}>
        <div style={S.grid3}>
          <div style={S.field}>
            <label style={S.label}>Full Address</label>
            <input type="text" name="address" value={propertyDetails.address} onChange={handleChange} placeholder="123 Main Street" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>City</label>
            <input type="text" name="city" value={propertyDetails.city} onChange={handleChange} placeholder="Mumbai" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>State</label>
            <input type="text" name="state" value={propertyDetails.state} onChange={handleChange} placeholder="Maharashtra" required style={S.input} onFocus={f} onBlur={b} />
          </div>
        </div>
        <div style={S.grid3}>
          <div style={S.field}>
            <label style={S.label}>Pincode</label>
            <input type="text" name="pincode" value={propertyDetails.pincode} onChange={handleChange} placeholder="400001" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Monthly Rent (₹)</label>
            <input type="number" name="rent" value={propertyDetails.rent} onChange={handleChange} placeholder="25000" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Owner Phone</label>
            <input type="tel" name="ownerPhone" value={propertyDetails.ownerPhone} onChange={handleChange} placeholder="+91 98765 43210" required style={S.input} onFocus={f} onBlur={b} />
          </div>
        </div>
        <div style={S.grid3}>
          <div style={S.field}>
            <label style={S.label}>Bedrooms</label>
            <input type="number" name="bedrooms" value={propertyDetails.bedrooms} onChange={handleChange} placeholder="2" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Bathrooms</label>
            <input type="number" name="bathrooms" value={propertyDetails.bathrooms} onChange={handleChange} placeholder="1" required style={S.input} onFocus={f} onBlur={b} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Area (sqft)</label>
            <input type="number" name="squareFeet" value={propertyDetails.squareFeet} onChange={handleChange} placeholder="1200" style={S.input} onFocus={f} onBlur={b} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Image URL (optional)</label>
          <input type="text" name="image" value={propertyDetails.image} onChange={handleChange} placeholder="https://example.com/image.jpg" style={S.input} onFocus={f} onBlur={b} />
        </div>
        <div style={{ ...S.field, marginTop: '1rem' }}>
          <label style={S.label}>Description</label>
          <textarea name="description" value={propertyDetails.description} onChange={handleChange} placeholder="Describe the property, amenities, nearby facilities..." style={S.textarea} onFocus={f} onBlur={b} />
        </div>
        <div style={S.footer}>
          <button type="submit" style={S.submit} onMouseEnter={e => e.target.style.background = '#9E4820'} onMouseLeave={e => e.target.style.background = '#C4622D'}>
            Submit Listing →
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProperty;
