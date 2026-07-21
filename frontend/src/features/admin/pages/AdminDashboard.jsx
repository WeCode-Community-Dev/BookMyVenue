import React from 'react';
import { useGetAdminStatsQuery } from '../api/adminApi.js';
import './AdminDashboard.scss';

function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminStatsQuery();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const payload = data?.data || {};

  const stats = [
    { label: 'Total Venues', value: payload.totalVenues ?? 0 },
    { label: 'Total Users', value: payload.totalUsers ?? 0 },
    { label: 'Total Bookings', value: payload.totalBookings ?? 0 },
    { label: 'Pending Approvals', value: payload.totalPendingApprovals ?? 0 },
    { label: 'Approved Venues', value: payload.totalApprovedVenues ?? 0 },
    { label: 'Rejected Venues', value: payload.totalRejectedVenues ?? 0 },
    { label: 'Active Venues', value: payload.totalActiveVenues ?? 0 },
  ];

  const bookingBreakdown = [
    { label: 'Approved Bookings', value: payload.totalApprovedBookings ?? 0 },
    { label: 'Pending Bookings', value: payload.totalPendingBookings ?? 0 },
    { label: 'Cancelled Bookings', value: payload.totalCancelledBookings ?? 0 },
    { label: 'Rejected Bookings', value: payload.totalRejectedBookings ?? 0 },
    { label: 'Completed Bookings', value: payload.totalCompletedBookings ?? 0 },
  ];

  const revenue = payload.totalRevenue ?? 0;

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <p className="admin-dashboard__subtitle">
          Monitor venue approvals, bookings, users, and revenue in one place.
        </p>
      </header>

      {isLoading ? (
        <p>Loading admin stats...</p>
      ) : isError ? (
        <p>Unable to load dashboard stats. Please refresh or try again later.</p>
      ) : (
        <>
          <div className="admin-dashboard__stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="admin-stat-card">
                <span className="admin-stat-card__label">{item.label}</span>
                <span className="admin-stat-card__value">{item.value}</span>
              </article>
            ))}
            <article className="admin-stat-card">
              <span className="admin-stat-card__label">Total Revenue</span>
              <span className="admin-stat-card__value">
                {formatCurrency(revenue)}
              </span>
              <span className="admin-stat-card__note">
                Based on completed payments only.
              </span>
            </article>
          </div>

          <section className="admin-dashboard__footer">
            {bookingBreakdown.map((item) => (
              <div key={item.label} className="admin-dashboard__footer-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;