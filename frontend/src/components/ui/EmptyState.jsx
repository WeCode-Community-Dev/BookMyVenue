import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.scss';

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
  variant = 'default',
}) {
  return (
    <div className={`empty-state empty-state--${variant} animate-fade-up`}>
      {Icon && (
        <div className="empty-state__icon-wrap">
          <Icon className="empty-state__icon" />
        </div>
      )}
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
      {(actionLabel && actionTo) && (
        <Link to={actionTo} className="empty-state__cta">
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button type="button" className="empty-state__cta" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
