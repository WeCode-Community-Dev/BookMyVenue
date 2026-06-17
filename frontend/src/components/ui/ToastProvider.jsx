import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './ToastProvider.scss';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'bmv-toast',
        success: { className: 'bmv-toast bmv-toast--success' },
        error: { className: 'bmv-toast bmv-toast--error' },
      }}
    />
  );
}

/** Visual-only: fires a toast when `message` appears — does not touch parent handlers */
export function ToastBanner({ message, type = 'error' }) {
  useEffect(() => {
    if (!message) return;
    if (type === 'success') toast.success(message);
    else toast.error(message);
  }, [message, type]);

  if (!message) return null;

  return (
    <div className={`toast-banner toast-banner--${type}`} role="alert">
      {message}
    </div>
  );
}

export default AppToaster;
