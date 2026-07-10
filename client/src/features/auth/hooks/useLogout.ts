import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app.store';
import { logoutApi } from '../services/auth.api';

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutState = useAppStore((state) => state.logout);

  const handleLogout = async () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?');
    if (!isConfirmed) return;

    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      navigate('/', { replace: true });
      setTimeout(() => {
        logoutState();
      }, 0);
    }
  };

  return handleLogout;
};
