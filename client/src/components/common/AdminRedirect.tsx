import { useEffect, useState } from 'react';
import { DASHBOARD_URL } from '@/constants';

export const AdminRedirect = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.location.replace(`${DASHBOARD_URL}`);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1c1c1c] text-[#f2f2f2] gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      <p className="text-lg font-medium tracking-wide">
        Redirecting to admin dashboard<span className="inline-block w-8 text-left">{dots}</span>
      </p>
    </div>
  );
};
