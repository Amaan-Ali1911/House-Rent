import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";
import AllUsers from "./modules/admin/AllUsers";
import AddProperty from "./modules/user/owner/AddProperty";
import OwnerAllBookings from "./modules/user/owner/AllBookings";
import RenterAllProperty from "./modules/user/renter/AllProperties";
import AdminAllBookings from "./modules/admin/AllBookings";
import AdminAllProperty from "./modules/admin/AllProperty";
import OwnerAllProperties from "./modules/user/owner/AllProperties";
import AllPropertiesCards from "./modules/user/AllPropertiesCards";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole, userData, userLoggedIn }) => {
  if (!userLoggedIn || !userData) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Loading...</h2>
    </div>;
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, userLoggedIn, setUserLoggedIn }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/getAllProperties' element={<AllPropertiesCards />} />

          {/* Admin Routes */}
          <Route 
            path='/adminhome' 
            element={
              <ProtectedRoute requiredRole="admin" userData={userData} userLoggedIn={userLoggedIn}>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/admin/users' 
            element={
              <ProtectedRoute requiredRole="admin" userData={userData} userLoggedIn={userLoggedIn}>
                <AllUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/admin/properties' 
            element={
              <ProtectedRoute requiredRole="admin" userData={userData} userLoggedIn={userLoggedIn}>
                <AdminAllProperty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/admin/bookings' 
            element={
              <ProtectedRoute requiredRole="admin" userData={userData} userLoggedIn={userLoggedIn}>
                <AdminAllBookings />
              </ProtectedRoute>
            } 
          />

          {/* Owner Routes */}
          <Route 
            path='/ownerhome' 
            element={
              <ProtectedRoute requiredRole="owner" userData={userData} userLoggedIn={userLoggedIn}>
                <OwnerHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/owner/properties' 
            element={
              <ProtectedRoute requiredRole="owner" userData={userData} userLoggedIn={userLoggedIn}>
                <OwnerAllProperties />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/owner/add-property' 
            element={
              <ProtectedRoute requiredRole="owner" userData={userData} userLoggedIn={userLoggedIn}>
                <AddProperty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/owner/bookings' 
            element={
              <ProtectedRoute requiredRole="owner" userData={userData} userLoggedIn={userLoggedIn}>
                <OwnerAllBookings />
              </ProtectedRoute>
            } 
          />

          {/* Renter/User Routes */}
          <Route 
            path='/renterhome' 
            element={
              <ProtectedRoute requiredRole="user" userData={userData} userLoggedIn={userLoggedIn}>
                <RenterHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/renter/properties' 
            element={
              <ProtectedRoute requiredRole="user" userData={userData} userLoggedIn={userLoggedIn}>
                <RenterAllProperty />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
