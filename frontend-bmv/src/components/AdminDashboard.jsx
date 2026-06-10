import { useState } from 'react';

const INITIAL_USERS = [
  { id: 1, name: 'Adarsh Hari', email: 'adarsh@bmv.com', role: 'admin', location: 'Delhi, India', status: 'Active' },
  { id: 2, name: 'Alice Smith', email: 'alice@bmv.com', role: 'owner', location: 'New York, USA', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@bmv.com', role: 'user', location: 'London, UK', status: 'Active' },
  { id: 4, name: 'Clara Oswald', email: 'clara@bmv.com', role: 'user', location: 'Cardiff, UK', status: 'Suspended' }
];

const INITIAL_LOGS = [
  { id: 1, action: 'User Registration', details: 'Bob Johnson created an account', time: '10 minutes ago' },
  { id: 2, action: 'Venue Approved', details: 'Alice Smith listed "Grand Ballroom"', time: '1 hour ago' },
  { id: 3, action: 'System Backup', details: 'Weekly automated database backup completed', time: '3 hours ago' }
];

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'logs'

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Add to activity logs
    const changedUser = users.find(u => u.id === userId);
    const newLog = {
      id: Date.now(),
      action: 'Role Modification',
      details: `Admin changed role of ${changedUser.name} to ${newRole}`,
      time: 'Just now'
    };
    setLogs([newLog, ...logs]);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        
        // Log action
        const newLog = {
          id: Date.now(),
          action: nextStatus === 'Active' ? 'User Reinstated' : 'User Suspended',
          details: `Admin changed status of ${u.name} to ${nextStatus}`,
          time: 'Just now'
        };
        setLogs(prev => [newLog, ...prev]);

        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-nav">
        <div className="dashboard-user-info">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="user-text-info">
            <h3>{user?.name || 'Guest'}</h3>
            <span className="role-badge admin-badge">Administrator</span>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management ({users.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            System Activity Logs ({logs.length})
          </button>
          <button className="logout-link-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-content-area">
        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Total Users</span>
            <span className="metric-val">{users.length}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Approved Venues</span>
            <span className="metric-val">12</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Platform Bookings</span>
            <span className="metric-val">58</span>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="admin-users-section">
            <h3>User Accounts Registry</h3>
            <div className="bookings-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User Details</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-table-cell">
                          <span className="bold">{u.name}</span>
                          <span className="subtext">{u.email}</span>
                        </div>
                      </td>
                      <td>{u.location}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="table-select-role"
                        >
                          <option value="user">User (Booker)</option>
                          <option value="owner">Owner (Host)</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge ${u.status.toLowerCase()}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`action-btn-sm ${u.status === 'Active' ? 'suspend-btn' : 'activate-btn'}`}
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-logs-section">
            <h3>System Activity Audit Logs</h3>
            <div className="logs-list">
              {logs.map(log => (
                <div className="log-item" key={log.id}>
                  <div className="log-header">
                    <span className="log-action-badge">{log.action}</span>
                    <span className="log-time">{log.time}</span>
                  </div>
                  <p className="log-details">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
