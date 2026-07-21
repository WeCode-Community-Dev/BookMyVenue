import React from 'react';
import './PageTransition.scss';

export default function PageTransition({ children, className = '' }) {
  return (
    <div className={`page-transition animate-fade-up ${className}`}>
      {children}
    </div>
  );
}
