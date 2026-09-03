import toast from 'react-hot-toast';

const successStyle = {
  background: '#059669',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500' as const,
};

const errorStyle = {
  background: '#DC2626',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500' as const,
};

const infoStyle = {
  background: '#000000',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500' as const,
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: successStyle,
    iconTheme: { primary: '#fff', secondary: '#059669' },
    duration: 3000,
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: errorStyle,
    iconTheme: { primary: '#fff', secondary: '#DC2626' },
    duration: 4000,
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    style: infoStyle,
    iconTheme: { primary: '#fff', secondary: '#000000' },
    duration: 3000,
  });
};

export const extractErrorMessage = (
  error: unknown,
  fallback = 'An unexpected error occurred'
): string => {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    if (data) {
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }
    if (typeof err.message === 'string') return err.message;
  }
  return fallback;
};
