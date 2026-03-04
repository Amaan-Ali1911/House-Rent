import axios from "axios";
import React, { useState, useEffect } from "react";
import Toast from "../common/Toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const S = {
  wrap: { fontFamily: "'DM Sans', sans-serif" },
  filters: { display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' },
  filterInput: { padding: '0.6rem 0.9rem', background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', flex: '1', minWidth: '180px' },
  filterSelect: { padding: '0.6rem 2rem 0.6rem 0.9rem', background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7470' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { background: '#FFFCF7', border: '1px solid #E2DBD0', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' },
  img: { width: '100%', height: '180px', objectFit: 'cover', display: 'block', background: '#F5F0E8' },
  body: { padding: '1rem 1.25rem 1.25rem' },
  tagRow: { display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' },
  tag: (color) => ({ display: 'inline-block', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: color.bg, color: color.text }),
  address: { fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, color: '#1C1C1E', marginBottom: '0.25rem' },
  type: { fontSize: '0.8rem', color: '#7A7470', marginBottom: '0.75rem' },
  detail: { fontSize: '0.82rem', color: '#1C1C1E', marginBottom: '0.2rem' },
  detailLabel: { fontWeight: 600, color: '#7A7470' },
  divider: { height: '1px', background: '#E2DBD0', margin: '0.75rem 0' },
  loginMsg: { fontSize: '0.8rem', color: '#C4622D', fontStyle: 'italic' },
  bookBtn: { width: '100%', background: '#C4622D', color: 'white', padding: '0.65rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '0.75rem', transition: 'background 0.2s' },
  unavail: { fontSize: '0.8rem', color: '#B91C1C', fontWeight: 600, marginTop: '0.5rem' },
  empty: { fontSize: '0.9rem', color: '#7A7470', textAlign: 'center', padding: '3rem', gridColumn: '1/-1' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(28,28,30,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn 0.2s ease' },
  modal: { background: '#FFFCF7', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', animation: 'fadeUp 0.3s ease' },
  modalHeader: { padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1C1C1E' },
  closeBtn: { background: '#F5F0E8', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#7A7470', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  modalImg: { width: '100%', height: '200px', objectFit: 'cover', margin: '1rem 0 0' },
  modalBody: { padding: '1.25rem 1.5rem 1.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' },
  infoItem: { fontSize: '0.85rem', color: '#1C1C1E' },
  infoLabel: { fontWeight: 600, color: '#7A7470', fontSize: '0.75rem', display: 'block', marginBottom: '0.15rem' },
  mInput: { width: '100%', padding: '0.65rem 0.9rem', background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", color: '#1C1C1E', outline: 'none', marginBottom: '0.75rem' },
  submitBtn: { width: '100%', background: '#15803D', color: 'white', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' },
};

const AllPropertiesCards = ({ loggedIn }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [filterAddress, setFilterAddress] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingData, setBookingData] = useState({ bookingStartDate: "", bookingEndDate: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => setToast({ show: true, type, message });

  const getToken = () => localStorage.getItem("token");
  const getUser = () => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/houses`);
      if (res.data.success) setAllProperties(res.data.data);
    } catch (error) { console.log(error); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const user = getUser();
    if (!user) return showToast("error", "Please login first");
    if (!bookingData.bookingStartDate || !bookingData.bookingEndDate) return showToast("error", "Please select dates");

    try {
      const token = getToken();
      const res = await axios.post(`${API_URL}/api/bookings`, {
        tenant: user.name,
        tenantEmail: user.email,
        tenantPhone: user.phone || "N/A",
        property: selectedProperty._id,
        bookingStartDate: bookingData.bookingStartDate,
        bookingEndDate: bookingData.bookingEndDate,
        rentAmount: selectedProperty.rent,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        showToast("success", "Booking request sent!");
        setShowModal(false);
        setBookingData({ bookingStartDate: "", bookingEndDate: "" });
        getAllProperties();
      } else showToast("error", res.data.message);
    } catch (error) {
      console.log(error);
      showToast("error", error.response?.data?.message || "Booking failed");
    }
  };

  useEffect(() => { getAllProperties(); }, []);

  const filteredProperties = allProperties
    .filter(p => filterAddress === "" || `${p.address} ${p.city} ${p.state}`.toLowerCase().includes(filterAddress.toLowerCase()))
    .filter(p => filterBedrooms === "" || String(p.bedrooms) === filterBedrooms);

  return (
    <div style={S.wrap}>
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}

      {/* Filters */}
      <div style={S.filters}>
        <input type="text" placeholder="🔍  Search by address..." value={filterAddress} onChange={e => setFilterAddress(e.target.value)} style={S.filterInput}
          onFocus={e => e.target.style.borderColor = '#C4622D'} onBlur={e => e.target.style.borderColor = '#E2DBD0'} />
        <select value={filterBedrooms} onChange={e => setFilterBedrooms(e.target.value)} style={S.filterSelect}>
          <option value="">All Bedrooms</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
      </div>

      {/* Cards */}
      <div style={S.grid}>
        {filteredProperties.length > 0 ? filteredProperties.map((house) => (
          <div key={house._id} style={S.card}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(28,28,30,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            {house.image ? (
              <img src={house.image.startsWith('http') ? house.image : `${API_URL}${house.image}`} alt="Property" style={S.img} />
            ) : (
              <div style={{ ...S.img, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7470', fontSize: '0.85rem' }}>No Image</div>
            )}
            <div style={S.body}>
              <div style={S.tagRow}>
                <span style={S.tag({ bg: 'rgba(196,98,45,0.1)', text: '#C4622D' })}>{house.bedrooms} BHK</span>
                <span style={S.tag({ bg: '#F5F0E8', text: '#7A7470' })}>{house.city}</span>
              </div>
              <div style={S.address}>{house.address}</div>
              <div style={S.type}>{house.city}, {house.state} - {house.pincode}</div>
              {loggedIn && (
                <>
                  <div style={S.divider}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#1C1C1E' }}>₹{house.rent?.toLocaleString()}/mo</span>
                    <span style={{ fontSize: '0.78rem', color: house.isAvailable ? '#15803D' : '#B91C1C', fontWeight: 600, background: house.isAvailable ? 'rgba(21,128,61,0.1)' : 'rgba(185,28,28,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      {house.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7A7470', marginTop: '0.3rem' }}>
                    {house.bedrooms} Bed • {house.bathrooms} Bath {house.squareFeet ? `• ${house.squareFeet} sqft` : ''}
                  </div>
                </>
              )}
              {house.isAvailable ? (
                loggedIn ? (
                  <button onClick={() => { setSelectedProperty(house); setShowModal(true); }}
                    style={S.bookBtn}
                    onMouseEnter={e => e.target.style.background = '#9E4820'}
                    onMouseLeave={e => e.target.style.background = '#C4622D'}>
                    View Details & Book
                  </button>
                ) : (
                  <p style={S.loginMsg}>Login to view full details</p>
                )
              ) : (
                <p style={S.unavail}>Currently Occupied</p>
              )}
            </div>
          </div>
        )) : (
          <div style={S.empty}>No properties match your filters.</div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={S.modal}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}>Property Details</h3>
              <button onClick={() => setShowModal(false)} style={S.closeBtn}>✕</button>
            </div>
            {selectedProperty.image && (
              <img src={selectedProperty.image.startsWith('http') ? selectedProperty.image : `${API_URL}${selectedProperty.image}`} alt="Property" style={S.modalImg} />
            )}
            <div style={S.modalBody}>
              <div style={S.grid2}>
                <div style={S.infoItem}><span style={S.infoLabel}>Location</span>{selectedProperty.address}, {selectedProperty.city}</div>
                <div style={S.infoItem}><span style={S.infoLabel}>Rent</span>₹{selectedProperty.rent?.toLocaleString()}/month</div>
                <div style={S.infoItem}><span style={S.infoLabel}>Bedrooms</span>{selectedProperty.bedrooms} BHK</div>
                <div style={S.infoItem}><span style={S.infoLabel}>Bathrooms</span>{selectedProperty.bathrooms}</div>
                <div style={S.infoItem}><span style={S.infoLabel}>Owner Contact</span>{selectedProperty.ownerPhone}</div>
                <div style={S.infoItem}><span style={S.infoLabel}>Availability</span>{selectedProperty.isAvailable ? 'Available' : 'Occupied'}</div>
              </div>
              {selectedProperty.description && (
                <div style={{ fontSize: '0.85rem', color: '#7A7470', marginBottom: '1.25rem', padding: '0.75rem', background: '#F5F0E8', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1C1C1E' }}>Description: </span>{selectedProperty.description}
                </div>
              )}
              {selectedProperty.amenities?.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#7A7470', marginBottom: '1.25rem', padding: '0.75rem', background: '#F5F0E8', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1C1C1E' }}>Amenities: </span>{selectedProperty.amenities.join(', ')}
                </div>
              )}
              <div style={{ height: '1px', background: '#E2DBD0', margin: '0 0 1.25rem' }}></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7470', marginBottom: '0.75rem' }}>Book This Property</div>
              <form onSubmit={handleBooking}>
                <input type="date" name="bookingStartDate" required value={bookingData.bookingStartDate} onChange={e => setBookingData({ ...bookingData, bookingStartDate: e.target.value })} style={S.mInput} placeholder="Start Date" />
                <input type="date" name="bookingEndDate" required value={bookingData.bookingEndDate} onChange={e => setBookingData({ ...bookingData, bookingEndDate: e.target.value })} style={S.mInput} placeholder="End Date" />
                <button type="submit" style={S.submitBtn} onMouseEnter={e => e.target.style.background = '#166534'} onMouseLeave={e => e.target.style.background = '#15803D'}>
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;
