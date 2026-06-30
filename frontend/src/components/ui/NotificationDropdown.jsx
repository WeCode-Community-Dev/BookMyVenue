import React from 'react';
import { FiCalendar, FiCheckCircle, FiXCircle, FiBell } from 'react-icons/fi';
import {
  getNotificationContent,
  formatRelativeTime,
} from '../../utils/notificationHelpers';

const variantIcons = {
  success: FiCheckCircle,
  danger: FiXCircle,
  default: FiBell,
};

function NotificationDropdown({ notifications, onItemClick }) {
  if (notifications.length === 0) {
    return (
      <div className="notification-dropdown">
        <div className="notification-dropdown__header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-dropdown__empty">
          <FiBell className="notification-dropdown__empty-icon" />
          <p>You&apos;re all caught up</p>
          <span>No new notifications right now.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <h3>Notifications</h3>
        <span className="notification-dropdown__count">{notifications.length}</span>
      </div>

      <ul className="notification-dropdown__list">
        {notifications.map((notification) => {
          const { title, message, variant, link } = getNotificationContent(notification);
          const Icon = variant === 'success' && notification.type === 'BOOKING_CONFIRMED'
            ? FiCalendar
            : variantIcons[variant] || FiBell;

          return (
            <li key={notification.id}>
              <button
                type="button"
                className={`notification-item${notification.isRead ? '' : ' notification-item--unread'}`}
                onClick={() => onItemClick?.(notification, link)}
              >
                <span className={`notification-item__icon notification-item__icon--${variant}`}>
                  <Icon />
                </span>
                <span className="notification-item__body">
                  <span className="notification-item__title">{title}</span>
                  <span className="notification-item__message">{message}</span>
                  <span className="notification-item__time">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </span>
                {!notification.isRead && (
                  <span className="notification-item__dot" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NotificationDropdown;
