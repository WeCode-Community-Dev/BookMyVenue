import React from 'react';
import './LoadingSkeleton.scss';

export function Skeleton({ className = '', style }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

export function VenueCardSkeleton() {
  return (
    <div className="skeleton-venue-card">
      <Skeleton className="skeleton-venue-card__image" />
      <div className="skeleton-venue-card__body">
        <Skeleton className="skeleton-line skeleton-line--title" />
        <Skeleton className="skeleton-line skeleton-line--short" />
        <Skeleton className="skeleton-line skeleton-line--price" />
        <div className="skeleton-chips">
          <Skeleton className="skeleton-chip" />
          <Skeleton className="skeleton-chip" />
          <Skeleton className="skeleton-chip" />
        </div>
        <Skeleton className="skeleton-line skeleton-line--btn" />
      </div>
    </div>
  );
}

export function VenueGridSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-venue-grid">
      {Array.from({ length: count }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__spinner" />
      <span className="page-loader__label">{label}</span>
    </div>
  );
}

export function VenueDetailSkeleton() {
  return (
    <div className="skeleton-venue-detail-page">
      <div className="skeleton-venue-detail-page__hero" />
      <div className="skeleton-venue-detail-page__stats">
        <Skeleton className="skeleton-stat" />
        <Skeleton className="skeleton-stat" />
        <Skeleton className="skeleton-stat" />
      </div>
      <div className="skeleton-venue-detail-page__grid">
        <div className="skeleton-venue-detail-page__main">
          <Skeleton className="skeleton-line skeleton-line--title" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line skeleton-line--short" />
        </div>
        <div className="skeleton-venue-detail-page__sidebar">
          <Skeleton className="skeleton-line skeleton-line--title" />
          <Skeleton className="skeleton-line skeleton-line--btn" />
          <Skeleton className="skeleton-line skeleton-line--btn" />
        </div>
      </div>
    </div>
  );
}

