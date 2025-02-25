import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './Notification/NotificationBell';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/facilities" className="nav-link">Facilities</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
      </div>
      <div className="navbar-right">
        <NotificationBell />
        <span className="user-name">{user.name}</span>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar; 