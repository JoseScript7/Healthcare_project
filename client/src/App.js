import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Analytics/Dashboard';
import InventoryList from './components/Inventory/InventoryList';
import FacilityList from './components/Facility/FacilityList';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <SocketProvider>
          <NotificationProvider>
            <div className="app-container">
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <div className="main-content">
                        <Dashboard />
                      </div>
                    </>
                  </PrivateRoute>
                } />

                <Route path="/inventory" element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <div className="main-content">
                        <InventoryList />
                      </div>
                    </>
                  </PrivateRoute>
                } />

                <Route path="/facilities" element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <div className="main-content">
                        <FacilityList />
                      </div>
                    </>
                  </PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </NotificationProvider>
        </SocketProvider>
      </Router>
    </AuthProvider>
  );
}

export default App; 