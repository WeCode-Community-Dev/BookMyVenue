import { useSelector } from 'react-redux';
import { selectUserRole } from '../redux/slices/authSlice';
import MainLayout from './MainLayout';
import OwnerLayout from './OwnerLayout';

function RoleBasedLayout() {
  const role = useSelector(selectUserRole);
  return role === 'owner' ? <OwnerLayout /> : <MainLayout />;
}

export default RoleBasedLayout;
