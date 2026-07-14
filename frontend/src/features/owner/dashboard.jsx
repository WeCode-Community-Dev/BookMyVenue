import React from 'react';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiDollarSign, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { isChatEnabled } from '../../config/featureFlags';
import PageTransition from '../../components/ui/PageTransition';

const MOCK_STATS = [
  { label: 'Total Revenue', value: '$12,450', change: '+12% this month', icon: FiDollarSign, color: 'stat-green' },
  { label: 'Total Bookings', value: '48', change: '+8% this week', icon: FiTrendingUp, color: 'stat-blue' },
  { label: 'Active Venues', value: '8', change: '2 pending approval', icon: FiUsers, color: 'stat-teal' },
  { label: 'Approval Rate', value: '94%', change: 'Same as last month', icon: FiCheckCircle, color: 'stat-purple' },
];

const RECENT_ACTIVITIES = [
  { id: 1, text: 'New booking request for "Rustic Barn" from Robert Smith', time: '10 minutes ago' },
  { id: 2, text: '"The Grand Ballroom" listing was approved', time: '2 hours ago' },
  { id: 3, text: 'Payment of $1,200 received from Alice Johnson', time: '5 hours ago' },
  { id: 4, text: 'Booking B104 cancelled by David Brown', time: '1 day ago' },
];

function OwnerDashboard() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const userName = currentUser?.username || 'Owner';

  return (
    <PageTransition className="dashboard-container">
      <div className="dashboard-welcome-banner">
        <div className="dashboard-welcome-banner__content">
          <span className="dashboard-welcome-banner__eyebrow">Welcome back</span>
          <h2 className="dashboard-welcome-banner__title">Hello, {userName}!</h2>
          <p className="dashboard-welcome-banner__subtitle">
            Here&apos;s what&apos;s happening with your venues today.
          </p>
        </div>
        <div className="dashboard-welcome-banner__actions">
          <button
            className="dashboard-quick-btn dashboard-welcome-banner__cta"
            onClick={() => navigate('/owner/venues')}
          >
            Manage Venues
          </button>
          {isChatEnabled && (
            <button
              className="dashboard-quick-btn dashboard-quick-btn--secondary"
              onClick={() => navigate('/messages')}
            >
              <FiMessageSquare />
              Messages
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-header-row">
        <h1 className="dashboard-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        {MOCK_STATS.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className={`stat-card ${stat.color}`}>
              <div className="stat-icon-wrapper">
                <IconComponent className="stat-icon" />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-change">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-details-row">
        <div className="dashboard-card main-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="quick-actions-list">
            <button className="action-btn" onClick={() => navigate('/owner/add-venue')}>
              + Add New Venue
            </button>
            <button className="action-btn outline" onClick={() => navigate('/owner/bookings')}>
              View Bookings Calendar
            </button>
            <button className="action-btn outline" onClick={() => navigate('/owner/settings')}>
              Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default OwnerDashboard;