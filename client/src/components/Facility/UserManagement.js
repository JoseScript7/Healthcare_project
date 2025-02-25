import React, { useState, useEffect } from 'react';
import { getFacilityUsers, addFacilityUser, removeFacilityUser } from '../../services/facility.service';
import { useAuth } from '../../contexts/AuthContext';

function UserManagement({ facility }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const { user: currentUser } = useAuth();

  const [newUser, setNewUser] = useState({
    email: '',
    role: 'staff',
    name: ''
  });

  useEffect(() => {
    loadUsers();
  }, [facility.facility_id]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getFacilityUsers(facility.facility_id);
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addFacilityUser(facility.facility_id, newUser);
      setShowAddUser(false);
      setNewUser({ email: '', role: 'staff', name: '' });
      await loadUsers();
    } catch (error) {
      setError(error.message || 'Failed to add user');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await removeFacilityUser(facility.facility_id, userId);
        await loadUsers();
      } catch (error) {
        setError(error.message || 'Failed to remove user');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <div className="section-header">
        <h3>Facility Users</h3>
        {currentUser.role === 'admin' && (
          <button onClick={() => setShowAddUser(true)}>Add User</button>
        )}
      </div>

      {showAddUser && (
        <div className="modal">
          <div className="add-user-form">
            <h4>Add New User</h4>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit">Add User</button>
                <button type="button" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.user_id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <p className="role">{user.role}</p>
            </div>
            {currentUser.role === 'admin' && user.user_id !== currentUser.user_id && (
              <button
                onClick={() => handleRemoveUser(user.user_id)}
                className="delete"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManagement; 