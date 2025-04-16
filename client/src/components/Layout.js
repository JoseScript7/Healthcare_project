import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    // navigate('/login'); // Uncomment when login page is ready
  };

  return (
    <div className="layout">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h1 className="logo">EDMS</h1>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>
              Inventory
            </Link>
            <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
              Orders
            </Link>
            <Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
              Reports
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-button">
            <FaBell />
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 