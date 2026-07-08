import React from 'react';

export const TableLoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p className="text-sm text-muted">Loading data...</p>
  </div>
);

export const TableEmptyState: React.FC<{ message?: string }> = ({ message = 'No data available' }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-xl border border-border">
    <div className="bg-muted/20 p-4 rounded-full mb-4">
      <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <p className="text-muted text-sm">{message}</p>
  </div>
);

export const TableErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Failed to load data',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-xl border border-border">
    <p className="text-destructive mb-4 text-sm font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium cursor-pointer"
      >
        Try Again
      </button>
    )}
  </div>
);
